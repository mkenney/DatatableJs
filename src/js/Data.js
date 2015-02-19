
+function(global, undefined) {
	'use strict';

	/**
	 * Data constructor
	 *
	 * @param {Object} rows Optional, an object containing named DatatableJs.lib.Column instances
	 */
	var Data = function(rows) {

		/**
		 * The current sort column, if any
		 * @private
		 * @type {String}
		 */
		this._current_sort_column    = undefined;

		/**
		 * The current sort direction, if any
		 * @private
		 * @type {String} 'asc' or 'desc'
		 */
		this._current_sort_direction = undefined;

		/**
		 * An object containing named DatatableJs.lib.Column instances
		 * @private
		 * @type {Array}
		 */
		this._rows = [];

		/**
		 * Local reference to the Schema object
		 * @private
		 * @type {DatatableJs.lib.Schema}
		 */
		this._schema = undefined;

		this.init(rows);
	};

	/**
	 * Initialize
	 *
	 * @param  {Object} rows Optional, an object containing named DatatableJs.lib.Column instances
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.init = function(rows) {
		if (undefined !== rows && rows instanceof Array) {
			this.setData(rows);
		}
		return this;
	};

	/**
	 * Get the current set of data rows
	 *
	 * @return  {Array}
	 */
	Data.prototype.getData = function() {
		if (!(this._rows instanceof Array)) {this._rows = [];}
		return this._rows;
	};

	/**
	 * Completely replace the current set of data rows
	 * @param  {Array} rows
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.setData = function(rows) {
		if (!rows instanceof Array) {throw new global.DatatableJs.lib.Exception('Data must be an array of row objects');}

		this.truncate();
		this._current_sort_column    = undefined;
		this._current_sort_direction = undefined;

		var row_key;

		for (row_key = 0; row_key < rows.length; row_key++) {
			this.addRow(rows[row_key]);
		}

		if (0 === row_key)                              {window.console.info('DatatableJs - No data rows found');}
		if (0 === this.getData().length && row_key > 0) {window.console.warn('DatatableJs - No valid data rows found');}
		if (this.getData().length < row_key)            {window.console.warn('DatatableJs - '+(row_key - this.getData().length)+' of '+row_key+' data rows were invalid');}

		return this;
	};

	/**
	 * Completely replace the current set of data rows, validating each one
	 *
	 * @param  {Object} row
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.addRow = function(row) {
		if ('object' !== typeof row)       {throw new global.DatatableJs.lib.Exception('Row data must be a simple object');}
		if (0 === Object.keys(row).length) {window.console.warn('DatatableJs - An attempt to insert an empty data row rejected');}

		var is_valid_row = true;
		if (this.getSchema() instanceof global.DatatableJs.lib.Schema) {
			is_valid_row = this.getSchema().isValidRow(row);
		}

		if (is_valid_row) {

			// Create and populate a property to allow row position tracking for
			// use in multi-column sort operations rather than implementing my own
			// stable sort algorithm
			if (!row.hasOwnProperty('__pos__')) {
				var __pos__;
				Object.defineProperty(row, '__pos__', {
					get: function() {
						return __pos__;
					}
					, set: function(val) {
						__pos__ = val;
					}
				});
			}
			row.__pos__ = this._rows.length;
			this._rows.push(row);
		}

		return this;
	};

	/**
	 * Get the schema instance
	 *
	 * @return {DatatableJs.lib.Schema}
	 */
	Data.prototype.getSchema = function() {
		return this._schema;
	};

	/**
	 * Set the schema instance
	 *
	 * @param  {DatatableJs.lib.Schema} schema
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.setSchema = function(schema) {
		if (!(schema instanceof global.DatatableJs.lib.Schema)) {throw new global.DatatableJs.lib.Exception('"schema" must be an instance of DatatableJs.lib.Schema');}
		var current_data = this.getData();
		this.truncate();
		this._schema = schema;
		if (current_data.length) {
			this.setData(current_data); // This will re-validate current rows against the schema
		}
		return this;
	};

	/**
	 * Sort the data
	 *
	 * @param  {String}          column     The column to sort on
	 * @param  {String}          direction  Optional, the sort direction, either 'asc' or 'desc'
	 * @param  {Function|String} comparator Optional, a method to use when comparing values for sorting
	 *                                          - function(a, b) {} // A custom comparison function that compares two values for
	 *                                                              // a match, return -1, 0 or 1
	 * @param  {Function}        transformer A function to use to transform values prior to the sort
	 *                                       comparison (stripping HTML, typecasting, etc.)
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.sort = function(column, direction, comparator, transformer) {

		if (undefined === column) {column = this._current_sort_column;}
		if ('string' !== typeof column) {throw new global.DatatableJs.lib.Exception('Invalid column value: '+column);}
		var reverse_direction = false;

		// If a direction isn't specified and the data is currently sorted by the
		// requested column assume we're just reversing the order
		if ('string' !== typeof direction) {
			if (column === this._current_sort_column) {
				direction = ('asc' === this._current_sort_direction
					? 'desc'
					: 'asc'
				);

				// Update local metadata
				this._current_sort_column    = column;
				this._current_sort_direction = direction;

				reverse_direction = true;
			}
		}

		// Reverse the current sort order
		if (reverse_direction) {
			this._rows.reverse();

		// Continue defining sort logic and execute
		} else {

			// Optional function to transform values before comparison, I.E stripping
			// out HTML or typecasting values
			if ('function' !== transformer) {
				transformer = undefined;
			}

			// Default comparison engine
			if ('function' !== typeof comparator) {
				comparator = function(a, b) {
					var ret_val;

					if (undefined === a || null === a) {ret_val = -1}
					if (undefined === b || null === b) {ret_val = 1}
					else if (a < b) {ret_val = -1;}
					else if (a > b) {ret_val = 1;}
					else {ret_val = 0;}

					return ret_val;
				};
			}

			// If a schema definition exists, look for sort options
			if (this.getSchema().getColumn(column) instanceof global.DatatableJs.lib.Column) {

				if ('function' === typeof this.getSchema().getColumn(column).get('sort_transformer')) {
					transformer = this.getSchema().getColumn(column).get('sort_transformer');
				}

				if ('function' === typeof this.getSchema().getColumn(column).get('sort_comparator')) {
					comparator = this.getSchema().getColumn(column).get('sort_comparator');
				}

				// If a direction isn't yet defined, see if a default sort order is
				// specified in the column schema
				if ('string' !== typeof direction) {
					if (this.getSchema().getColumn(column).get('sort_direction')) {
						direction = ('desc' === this.getSchema().getColumn(column).get('sort_direction')
							? 'desc'
							: 'asc'
						);
					}
				}
			}

			// If a direction still isn't defined, default to ascending
			if ('string' !== typeof direction) {
				direction = 'asc';
			}

			// Sort the data set
			this._rows.sort(function(a, b) {
				var ret_val = 0;
				var a_val = a[column];
				var b_val = b[column];

				// Sort rows missing data to the "bottom"
				if ((undefined === a[column] || null === a[column]) && a[column] !== b[column]) {
					ret_val = 1;

				} else if ((undefined === b[column] || null === b[column]) && a[column] !== b[column]) {
					ret_val = -1;

				// Maintain relative position when values are equal to allow
				// multi-column sorting
				} else if (a[column] === b[column]) {
					ret_val = a.__pos__ - b.__pos__;

				} else {
					// Perform any specified pre-comparison transformations
					if (undefined !== transformer) {
						a_val = transformer(a_val);
						b_val = transformer(b_val);
					}

					ret_val = comparator(a_val, b_val);
				}
				return ret_val;
			});

			// Update row position tracking for future sorts to allow multi-column
			// sorting
			for (var a = 0; a < this._rows.length; a++) {
				this._rows[a].__pos__ = a;
			}

			if ('desc' === direction) {
				this._rows.reverse();
			}

			// Update local metadata
			this._current_sort_column    = column;
			this._current_sort_direction = direction;
		}

		return this;
	}

	/**
	 * Empty the data set
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.truncate = function() {
		this._current_sort_column    = undefined;
		this._current_sort_direction = undefined;
		this._rows = [];
		return this;
	}

	global.DatatableJs.lib.Data = Data;

}(this);
