
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
	 * Default value for the is_shaow flag
	 * @type {Boolean}
	 */
	Data.prototype._is_shadow = false;

	/**
	 * Initialize
	 *
	 * @param  {Object} rows Optional, an object containing named DatatableJs.lib.Column instances
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.init = function(rows) {
		if (undefined !== rows) {
			this.setRows(rows);
		}
		return this;
	};

	/**
	 * Get the current set of data rows
	 *
	 * @return  {Array}
	 */
	Data.prototype.getRows = function() {
		if (!(this._rows instanceof Array)) {this._rows = [];}
		return this._rows;
	};

	/**
	 * Replace the current data set with an array of data rows
	 *
	 * @param  {Array} rows
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.setRows = function(rows) {
		if (!(rows instanceof Array)) {throw new global.DatatableJs.lib.Exception('Data must be an array objects representing rows');}
		this.truncate();
		this._current_sort_column    = undefined;
		this._current_sort_direction = undefined;

		var row_key;

		for (row_key = 0; row_key < rows.length; row_key++) {
			this.addRow(rows[row_key]);
		}

		if (0 === row_key)                              {global.DatatableJs.console.info('DatatableJs - No data rows found');}
		if (0 === this.getRows().length && row_key > 0) {global.DatatableJs.console.info('DatatableJs - No valid data rows found');}
		if (this.getRows().length < row_key)            {global.DatatableJs.console.info('DatatableJs - '+(row_key - this.getRows().length)+' of '+row_key+' data rows were invalid');}

		return this;
	};

	/**
	 * Add a row to the current dataset
	 *
	 * If a schema is available, validate the row data.  Add support properties
	 * for the stable sort implementation.
	 *
	 * @param  {Object} row
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.addRow = function(row) {
		if ('object' !== typeof row)       {throw new global.DatatableJs.lib.Exception('Row data must be a simple object');}
		if (0 === Object.keys(row).length) {global.DatatableJs.console.warn('DatatableJs - An attempt to insert an empty data row rejected');}

		var is_valid_row = true;
		if ((this.getSchema() instanceof global.DatatableJs.lib.Schema)) {
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

			if (!this.isShadow()) {
				row.__pos__ = this._rows.length;
			}

			this._rows.push(row);
		}

		return this;
	};

	/**
	 * Get the current DatatableJs.lib.Schema instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Schema}
	 */
	Data.prototype.getSchema = function() {
		if (!(this._schema instanceof global.DatatableJs.lib.Schema)) {
			this._schema = new global.DatatableJs.lib.Schema();
		}
		return this._schema;
	};

	/**
	 * Set the current DatatableJs.lib.Schema instance
	 *
	 * @param  {DatatableJs.lib.Schema} schema
	 * @return {DatatableJs.lib.Data}
	 */
	Data.prototype.setSchema = function(schema) {
		if (!(schema instanceof global.DatatableJs.lib.Schema)) {throw new global.DatatableJs.lib.Exception('"schema" must be an instance of DatatableJs.lib.Schema');}
		var current_data = this.getRows();
		this.truncate();
		this._schema = schema;
		if (current_data.length) {
			this.setRows(current_data); // This will re-validate current rows against the schema
		}
		return this;
	};

	/**
	 * Sort the data.
	 *
	 * This implements a stable multi-sort algorithm
	 *
	 * @param  {String}          column      The column to sort on
	 * @param  {String}          direction   Optional, the sort direction, either
	 *                                       'asc' or 'desc'
	 * @param  {Function|String} comparator  Optional, a method to use when comparing
	 *                                       values for sorting
	 *                                           - function(a, b) {} // A custom comparison function that
	 *                                                               // compares two values for a match,
	 *                                                               // return -1, 0 or 1
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
			if ('function' !== typeof transformer) {
				transformer = undefined;
			}

			// Default comparison engine
			if ('function' !== typeof comparator) {
				comparator = function(a, b) {
					var ret_val;

					if (undefined === a || null === a) {ret_val = -1}
					else if (undefined === b || null === b) {ret_val = 1}
					else if (a < b) {ret_val = -1;}
					else if (a > b) {ret_val = 1;}
					else {ret_val = 0;}

					return ret_val;
				};
			}

			// If a schema definition exists, look for sort options
			if ((this.getSchema() instanceof global.DatatableJs.lib.Schema)) {
				if ((this.getSchema().getColumn(column) instanceof global.DatatableJs.lib.Column)) {

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

			if ('desc' === direction) {
				this._rows.reverse();
			}

			// Update row position tracking for future sorts to allow multi-column
			// sorting
			this.indexRows();

			// Update local metadata
			this._current_sort_column    = column;
			this._current_sort_direction = direction;
		}

		return this;
	}

	// Update row position tracking for future sorts to allow multi-column
	// sorting
	Data.prototype.indexRows = function() {
		for (var a = 0; a < this._rows.length; a++) {
			this._rows[a].__pos__ = a;
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

	/**
	 * Define the length property for the Iterator object
	 */
	Object.defineProperty(Data.prototype, 'length', {
		set: function() {
			throw new global.DatatableJs.lib.Exception('Cannot redefine property: length');
		}
		, get: function() {
			return this._rows.length;
		}
	});

	/**
	 * Get/Set a flag noting whether this is a shadow instance
	 *
	 * @param
	 * @return {DatatableJs.lib.Iterator}
	 */
	Data.prototype.isShadow = function(bool) {
		var ret_val;
		if ('undefined' !== typeof bool) {
			this._is_shadow = Boolean(bool);
			ret_val = this;
		} else {
			ret_val = this._is_shadow;
		}
		return ret_val;
	};

	global.DatatableJs.lib.Data = Data;

}(this);
