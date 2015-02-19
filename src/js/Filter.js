/*jshint evil: true */
/*jshint unused: true*/

/**
 * Filter class for the DatatableJs library
 * References a Data and optionally a Schema object
 */
+function(global, undefined) {
	'use strict';


	var _PAGINATION_DEFAULTS = {
		  enabled:       false
		, rows_per_page: 25
		, current_page:  1
	}

	/**
	 * Filter constructor
	 *
	 * @param {Object} filters Optional, an array of data filter definitions
	 */
	var Filter = function(data, schema) {

		/**
		 * Reference to the last matched row
		 * @private
		 * @type {Object}
		 */
		this._cur_value = undefined;

		/**
		 * A DatatableJs.lib.Data instance
		 * @private
		 * @type {DatatableJs.lib.Data}
		 */
		this._data = undefined;

		/**
		 * An array of Object instances defining filters
		 * @private
		 * @type {Array} An array of filter objects that are combined to create a filter rule:
		 *       {
		 *           fields: []        // One or more valid schema fields
		 *           , comparators: [] // One or more comparison functions.  May be any of:
		 *               - '>'
		 *               - '>='
		 *               - '<'
		 *               - '<='
		 *               - '=='
		 *               - '==='
		 *               - '!='
		 *               - '!=='
		 *               - function(a, b) {} // A custom comparison function that compares two values for
		 *                                   // a match, return bool
		 *           , values: []      // One or more values to match against
		 *       }
		 */
		this._filters = [];

		/**
		 * [_is_executed description]
		 * @private
		 * @type {Boolean}
		 */
		this._is_executed = false;

		/**
		 * Stack pointer and current value for the data set referenced by _data
		 * @private
		 * @type {Number}
		 */
		this._iterator_key   = -1;

		/**
		 * Reference to the data identified by _iterator_key
		 * @private
		 * @type {Object}
		 */
		this._iterator_value = undefined;

		/**
		 * [_pagination description]
		 * @private
		 * @type {[type]}
		 */
		this._pagination = _PAGINATION_DEFAULTS;

		/**
		 * [_pagination_counter description]
		 * @private
		 * @type {[type]}
		 */
		this._pagination_counter = 0;

		/**
		 * A DatatableJs.lib.Schema instance
		 * @private
		 * @type {DatatableJs.lib.Schema}
		 */
		this._schema = undefined;

		/**
		 * An array of Object instances defining sorting rules
		 * @private
		 * @type {Array} An array of filter objects that are combined to create a filter rule:
		 *     {
		 *           column:      ''                  The name of the column to sort by
		 *         , direction:   'asc'               Optional, the sort order, either 'asc' or 'desc'
		 *         , comparator:  function(a, b, dir) Optional, a custom sort method.  This method
		 *                                            is passed two values and a sort direction string
		 *         , transformer: function(a)         Optional, a custom function used to perform
		 *                                            pre-comparison transformations
		 *     }
		 */
		this._sorts = []

		this.init(data, schema);
	};

	/**
	 * Initialize
	 * @param  {Object} filters Optional, an array of data filter definitions
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.init = function(data, schema) {
		this.setData(data);
		this.setSchema(schema);
		return this;
	};

	/**
	 * Get the current DatatableJs.lib.Data reference
	 * @return {Array}
	 */
	Filter.prototype.getData = function() {
		return this._data;
	};

	/**
	 * Set the current DatatableJs.lib.Data reference
	 * @param  {DatatableJs.lib.Data}   data
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.setData = function(data) {
		if (!data instanceof global.DatatableJs.lib.Data) {throw new global.DatatableJs.lib.Exception('"data" must be an instance of DatatableJs.lib.Data');}
		this._data = data;
		return this;
	};

	/**
	 * Get the current DatatableJs.lib.Schema reference
	 * @return {[type]} [description]
	 */
	Filter.prototype.getSchema = function() {
		return this._schema;
	};

	/**
	 * Set the current DatatableJs.lib.Data reference
	 * @param  {DatatableJs.lib.Schema} data
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.setSchema = function(schema) {
		if (!schema instanceof global.DatatableJs.lib.Schema) {throw new global.DatatableJs.lib.Exception('"schema" must be an instance of DatatableJs.lib.Schema');}
		this._schema = schema;
		return this;
	};

	/**
	 * [addFilter description]
	 * @param  {Object}                 filter
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.addFilterRule = function(filter) {

		// Filter rules
		if (filter.fields && filter.comparators && filter.values) {
			if (false === (filter.fields instanceof Array))      {filter.fields = [filter.fields];}
			if (false === (filter.comparators instanceof Array)) {filter.comparators = [filter.comparators];}
			if (false === (filter.values instanceof Array))      {filter.values = [filter.values];}

			this._filters.push({
				  fields:      filter.fields
				, comparators: filter.comparators
				, values:      filter.values
			});

		// Rule rejected
		} else {
			window.console.error('DatatableJs - An invalid filter definition was rejected', filter);
		}

		return this;
	};

	/**
	 * [addSortRule description]
	 * @param  {Object}                 sort
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.addSortRule = function(sort) {

		// Sort rules
		if (sort.column) { // Only column is required
			this._sorts.push({
				  column:      sort.column
				, direction:   (sort.direction ? sort.direction : undefined)
				, comparator:  (sort.comparator ? sort.comparator : undefined)
				, transformer: (sort.transformer ? sort.transformer : undefined)
			});

		// Rule rejected
		} else {
			window.console.error('DatatableJs - An invalid sort definition was rejected', sort);
		}

		return this;
	};

	/**
	 * Set a pagination rule for this filter
	 *
	 * Pagination rules are taken into account when calling the next() method.
	 * Page counts only include rows that match all current filter rules.
	 *
	 * @param {Object} pagination An object containing pagination rules.  Options are:
	 *     enabled       - True or false
	 *     rows_per_page - Number of data rows to display per page
	 *     current_page  - Set the current page index, default 1
	 */
	Filter.prototype.setPaginationRule = function(pagination) {
		if (undefined === pagination) {
			throw new global.DatatableJs.lib.Exception('Argument required');

		} else if (!pagination) {
			pagination = _PAGINATION_DEFAULTS;
		}

		if (undefined === pagination.enabled) {pagination.enabled = _PAGINATION_DEFAULTS.enabled;}
		pagination.enabled = (true === pagination.enabled);

		if (undefined === pagination.rows_per_page) {pagination.rows_per_page = _PAGINATION_DEFAULTS.rows_per_page;}
		pagination.rows_per_page = Math.round(Number(pagination.rows_per_page));

		if (undefined === pagination.current_page) {pagination.current_page = _PAGINATION_DEFAULTS.current_page;}
		pagination.current_page = Math.round(Number(pagination.current_page));

		this._pagination = pagination;
	};

	Filter.prototype.setPage = function(page) {
		if (!page) {throw new global.DatatableJs.lib.Exception('Invalid page number "'+page+'"');}
		this._pagination.current_page = Math.round(Number(page));
	}

	Filter.prototype.setRowsPerPage = function(rows) {
		if (!rows) {throw new global.DatatableJs.lib.Exception('Invalid page size "'+rows+'"');}
		this._pagination.rows_per_page = Math.round(Number(rows));
	}

	/**
	 * "execute" a filter
	 *
	 * Resets iterator properties, executes all sort rules and optionally sets
	 * the pagination position
	 *
	 * @param  {Object}     options     Initialization options, currently only supports
	 *                                  a 'page' option for pagination.  If included,
	 *                                  pagination is automatically enabled and rows
	 *                                  returned by next() are limited to those in the
	 *                                  specified page.
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.execute = function(options) {

		this._iterator_key   = -1;
		this._iterator_value = undefined;
		this._cur_value      = undefined;
		this._pagination_counter = 0;

		//
		if (options) {

			// Set the current page
			if (options.page) {
				this._pagination.enabled = true;
				this._pagination.current_page = Number(options.page);
			}
		}

		// Perform any defined sort operations in order to allow multi-sort
		// operations
		if (0 < this._sorts.length) {
			for (var a = 0; a < this._sorts.length; a++) {
				this.getData().sort(
					  this._sorts[a].column
					, this._sorts[a].direction
					, this._sorts[a].comparator
					, this._sorts[a].transformer
				);
			}
		}

		this._is_executed = true;

		return this;
	};

	/**
	 * Return the next matching row of data and increment the iterator accordingly
	 *
	 * Takes pagination rules into account and only iterates through the current
	 * page number if enabled.  Page counts only include rows that match all current
	 * filter rules.
	 *
	 * @return {Object} A data row, else undefined
	 */
	Filter.prototype.next = function() {

		if (this._iterator_key < this._data.getData().length) {this._iterator_key++;}
		if (!this._is_executed) {this.execute();}
		this._iterator_value = undefined;

		// Pagination checks
		var min_page_row;
		var max_page_row;
		if (this._pagination.enabled) {
			min_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - this._pagination.rows_per_page;
			max_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - 1;
		}

		if (this._iterator_key < this._data.getData().length) {
			for (var a = this._iterator_key; a < this._data.getData().length; a++) {

				// Row matches current filters
				if (this._data.getData()[a] && this.rowMatches(this._data.getData()[a])) {

					// Check to see if the row is in the current page
					var in_page = false;
					if (this._pagination.enabled) {
						in_page = (
							this._pagination_counter >= min_page_row
							&& this._pagination_counter <= max_page_row
						);
						this._pagination_counter++;
					}

					// If not paginated or in the current page, return row
					if (!this._pagination.enabled || in_page) {
						this._iterator_key   = a;
						this._iterator_value = this._data.getData()[a];
						this._cur_value      = this._data.getData()[a];
						break;
					}
				}
			}
			this._iterator_key = a;
		}

		return this._iterator_value;
	};

	/**
	 * Return the last data row matched by this filter since the last execute() call
	 *
	 * @return {Object} A data row, else undefined
	 */
	Filter.prototype.curr = function() {
		if (!this._is_executed) {throw new global.DatatableJs.lib.Exception('Filters must be executed before they can be iterated');}
		return this._cur_value;
	};

	/**
	 * Return the previous matching row of data and decrement the iterator accordingly
	 *
	 * Takes pagination rules into account and only iterates through the current page number
	 * if enabled
	 *
	 * @return {Object} A data row, else undefined
	 */
	Filter.prototype.prev = function() {
		if (this._iterator_key > -1) {this._iterator_key--;}
		if (!this._is_executed) {throw new global.DatatableJs.lib.Exception('Filters must be executed before they can be iterated');}
		this._iterator_value = undefined;

		// Pagination checks
		var min_page_row;
		var max_page_row;
		if (this._pagination.enabled) {
			min_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - this._pagination.rows_per_page;
			max_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - 1;
		}

		if (-1 < this._iterator_key) {
			for (var a = this._iterator_key; a > -1; a--) {

				// Row matches current filters
				if (this._data.getData()[a] && this.rowMatches(this._data.getData()[a])) {

					// Check to see if the row is in the current page
					var in_page;
					if (this._pagination.enabled) {
						this._pagination_counter--;
						in_page = (
							this._pagination_counter >= min_page_row
							&& this._pagination_counter <= max_page_row
						);
					}

					// If not paginated or in the current page, return row
					if (!this._pagination.enabled || in_page) {
						this._iterator_key   = a;
						this._iterator_value = this._data.getData()[a];
						this._cur_value      = this._data.getData()[a];
						break;
					}
				}
			}
			this._iterator_key = a;
		}

		return this._iterator_value;
	};

	/**
	 * Test to see if a row matches this filter definition
	 *
	 * The logic gives an AND match between filters and an OR match within filters
	 * that specify multiple fields, comparators or values
	 *
	 * @param  {Object} row A single row of data
	 * @return {bool}       True of the row matches ALL of the defined filters
	 */
	Filter.prototype.rowMatches = function(row) {

		// AND matching between filters
		var ret_val = true;

		for (var a = 0; a < this._filters.length; a++) {

			// OR matching within a single filter using multiple fields, comparators or values
			var filter_matches = false;
			var filter = this._filters[a];

			if (!filter.fields      instanceof Array) {filter.fields      = [filter.fields];}
			if (!filter.comparators instanceof Array) {filter.comparators = [filter.comparators];}
			if (!filter.values      instanceof Array) {filter.values      = [filter.values];}

			for (var b = 0; b < filter.fields.length; b++) {

				var field_name = filter.fields[b];

				if (undefined === row[field_name]) {
					filter_matches = false;

				} else {
					filter_matches = this._compare(row[field_name], filter.comparators, filter.values);
				}
				if (filter_matches) {break;}
			}
			ret_val = filter_matches;
			if (!ret_val) {break;}
		}

		return ret_val;
	};

	/**
	 * Compare a single field against a filter's set of comparators and values
	 *
	 * @param  {mixed} data        The field data to compare
	 * @param  {Array} comparators An array of comparators to use for matching
	 * @param  {Array} values      An array of values to compare against data
	 * @return {bool}              True if data matches any combination of comparators and values, else false
	 */
	Filter.prototype._compare = function(data, comparators, values) {
		var ret_val = false;
		for (var a = 0; a < comparators.length; a++) {
			for (var b = 0; b < values.length; b++) {

				if ('function' === typeof comparators[a]) {
					ret_val = comparators[a](data, values[b]);

				} else {
					switch (comparators[a]) {
						case '>':   ret_val = (data >   values[b]); break;
						case '>=':  ret_val = (data >=  values[b]); break;
						case '<':   ret_val = (data >   values[b]); break;
						case '<=':  ret_val = (data >=  values[b]); break;
						case '==':  ret_val = (data ==  values[b]); break;
						case '===': ret_val = (data === values[b]); break;
						case '!=':  ret_val = (data !=  values[b]); break;
						case '!==': ret_val = (data !== values[b]); break;
					}
				}
				if (ret_val) {break;}
			}
			if (ret_val) {break;}
		}
		return ret_val;
	};

	global.DatatableJs.lib.Filter = Filter;

}(this);
