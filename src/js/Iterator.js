
/**
 * Iterator class for the DatatableJs library
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
	 * Iterator constructor
	 *
	 * @param {DatatableJs.lib.Data} data Optional, an instance of DatatableJs.lib.Data
	 * @param {DatatableJs.lib.Schema} schema Optional, an instance of DatatableJs.lib.Schema
	 */
	var Iterator = function(data, schema) {

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
		 * An array of Object instances defining iterators
		 * @private
		 * @type {Array} An array of simple objects that are combined to create a filter rule:
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
		this._pagination = {
			  enabled:       _PAGINATION_DEFAULTS.enabled
			, rows_per_page: _PAGINATION_DEFAULTS.rows_per_page
			, current_page:  _PAGINATION_DEFAULTS.current_page
		};

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
		 * @type {Array} An array of simple objects that are combined to create a sort order:
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
	 * @param {DatatableJs.lib.Data} data Optional, an instance of DatatableJs.lib.Data
	 * @param {DatatableJs.lib.Schema} schema Optional, an instance of DatatableJs.lib.Schema
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.init = function(data, schema) {
		this.setData(data);
		this.setSchema(schema);
		return this;
	};

	/**
	 * Get the current DatatableJs.lib.Data instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	Iterator.prototype.getData = function() {
		if (!(this._data instanceof global.DatatableJs.lib.Data)) {this._data = new global.DatatableJs.lib.Data();}
		return this._data;
	};

	/**
	 * Set the current DatatableJs.lib.Data reference
	 *
	 * @param  {DatatableJs.lib.Data}   data
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setData = function(data) {
		if (!(data instanceof global.DatatableJs.lib.Data)) {throw new global.DatatableJs.lib.Exception('"data" must be an instance of DatatableJs.lib.Data');}
		this._data = data;
		return this;
	};

	/**
	 * Get the current set of data rows
	 *
	 * @return {Array}
	 */
	Iterator.prototype.getRows = function() {
		return this.getData().getRows();
	};

	/**
	 * Replace the current data set with an array of data rows
	 *
	 * @param  {Array} rows
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setRows = function(rows) {
		if (!(rows instanceof Array)) {throw new global.DatatableJs.lib.Exception('The data set must be an array of data rows');}
		this.getData().setRows(rows);
		return this;
	};

	/**
	 * Get the current DatatableJs.lib.Schema instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Schema}
	 */
	Iterator.prototype.getSchema = function() {
		if (!(this._schema instanceof global.DatatableJs.lib.Schema)) {
			this._schema = new global.DatatableJs.lib.Schema();
		}
		return this._schema;
	};

	/**
	 * Set the current DatatableJs.lib.Schema instance
	 *
	 * @param  {DatatableJs.lib.Schema} schema
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setSchema = function(schema) {
		if (!(schema instanceof global.DatatableJs.lib.Schema)) {throw new global.DatatableJs.lib.Exception('"schema" must be an instance of DatatableJs.lib.Schema');}
		this._schema = schema;
		return this;
	};

	/**
	 * Add a filter rule
	 *
	 * {
	 *     fields:        [array of column names]
	 *     , comparators: [array of comparison control characters or functions]
	 *     , values:      [array of values to compare with]
	 * }
	 *
	 * @param  {Object}                 filter
	 * @return {DatatableJs.lib.Filter}
	 */
	Iterator.prototype.addFilterRule = function(filter) {

		// Filter rules
		if (filter.fields && filter.comparators && filter.values) {
			if (!(filter.fields instanceof Array))      {filter.fields = [filter.fields];}
			if (!(filter.comparators instanceof Array)) {filter.comparators = [filter.comparators];}
			if (!(filter.values instanceof Array))      {filter.values = [filter.values];}

			this._filters.push({
				  fields:      filter.fields
				, comparators: filter.comparators
				, values:      filter.values
			});
			this._length_is_calculated = false;

		// Rule rejected
		} else {
			global.console.error('DatatableJs - An invalid filter definition was rejected', filter);
		}

		return this;
	};

	/**
	 * Clear out all defined filters
	 *
	 * Also re-executes this iterator
	 *
	 * @return {[type]} [description]
	 */
	Iterator.prototype.clearFilterRules = function() {
		this._filters = [];
		this._length_is_calculated = false;
		return this;
	};

	/**
	 * Set all filter rules at once.
	 *
	 * Requires an array of valid filter rule objects
	 *
	 * @param {Array} filter_rules
	 */
	Iterator.prototype.setFilterRules = function(filter_rules) {
		if (!(filter_rules instanceof Array)) {throw new global.DatatableJs.lib.Exception('Filter rules must be an array of valid rule definition objects');}

		this.clearFilterRules();
		for (var a = 0; a < filter_rules.length; a++) {
			this.addFilterRule(filter_rules[a]);
		}
		this.execute();

		return this;
	};

	/**
	 * Add a sorting rule.  Supports a stable multi-sort.
	 * Resets the executed flag to false...
	 * @param  {Object}                 sort
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.addSortRule = function(sort) {

		// Sort rules
		if (sort.column) { // Only column is required
			this._sorts.push({
				  column:      sort.column
				, direction:   (sort.direction ? sort.direction : undefined)
				, comparator:  (sort.comparator ? sort.comparator : undefined)
				, transformer: (sort.transformer ? sort.transformer : undefined)
			});
			this._is_executed = false;

		// Rule rejected
		} else {
			global.console.error('DatatableJs - An invalid sort definition was rejected', sort);
		}

		return this;
	};

	/**
	 * Clear all sort rules
	 *
	 * @param  {Array}                   sort
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.clearSortRules = function() {
		this._sorts = [];
		this._is_executed = false;
		return this;
	};

	/**
	 * Set all sort rules at once
	 *
	 * @param  {Array}                   sort
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setSortRules = function(sort_rules) {
		if (!(sort_rules instanceof Array)) {throw new global.DatatableJs.lib.Exception('Sort rules must be an array of valid rule definition objects');}

		this.clearSortRules();
		for (var a = 0; a < sort_rules.length; a++) {
			this.addSortRule(sort_rules[a]);
		}

		return this;
	};

	/**
	 * Set a pagination rule for this iterator
	 *
	 * Pagination rules are taken into account when calling the next() and prev()
	 * methods. Page counts only include rows that match all current filter rules.
	 *
	 * @param {Object} pagination An object containing pagination rules.  Options are:
	 *     enabled       - True or false
	 *     rows_per_page - Number of data rows to display per page
	 *     current_page  - Set the current page index, default 1
	 */
	Iterator.prototype.setPaginationRule = function(pagination) {
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

		this._pagination.enabled       = pagination.enabled;
		this._pagination.rows_per_page = pagination.rows_per_page;
		this._pagination.current_page  = pagination.current_page;
	};

	/**
	 * [setPage description]
	 * @param {[type]} page [description]
	 */
	Iterator.prototype.getPage = function() {
		return this._pagination.current_page;
	}

	/**
	 * [setPage description]
	 * @param {[type]} page [description]
	 */
	Iterator.prototype.setPage = function(page) {
		if (!page) {throw new global.DatatableJs.lib.Exception('Invalid page number "'+page+'"');}
		this._pagination.current_page = Math.round(Number(page));
		return this;
	}

	/**
	 * [setRowsPerPage description]
	 * @return {Number}
	 */
	Iterator.prototype.getRowsPerPage = function() {
		return this._pagination.rows_per_page;
	}

	/**
	 * [setRowsPerPage description]
	 * Always sets the current page to 1
	 * @param {[type]} rows [description]
	 */
	Iterator.prototype.setRowsPerPage = function(rows) {
		if (!rows) {throw new global.DatatableJs.lib.Exception('Invalid page size "'+rows+'"');}
		this._pagination.rows_per_page = Math.round(Number(rows));
		this._pagination.current_page = 1;
		return this;
	}

	/**
	 * [setRowsPerPage description]
	 * @param {[type]} rows [description]
	 */
	Iterator.prototype.getPaginationEnabled = function() {
		return (this._pagination.enabled === true);
	}

	/**
	 * [setRowsPerPage description]
	 * @param {[type]} rows [description]
	 */
	Iterator.prototype.setPaginationEnabled = function(enabled) {
		if (!this._pagination.enabled) {
			this._pagination.enabled = (true === enabled);
		}
		return this;
	}

	/**
	 * "execute" an iterator
	 *
	 * Resets iterator position and related values, and executes all sort rules
	 * on initial execution. The current pagination position can be passed as an
	 * argument
	 *
	 * @param  {Object}     options     Initialization options, currently only supports
	 *                                  a 'page' option for pagination.  If included,
	 *                                  pagination is automatically enabled and rows
	 *                                  returned by next() are limited to those in the
	 *                                  specified page.
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.execute = function(options) {

		this._iterator_key   = -1;
		this._iterator_value = undefined;
		this._cur_value      = undefined;
		this._pagination_counter = 0;

		// Set the current page
		if (options) {
			if (options.page) {
				this.setPaginationEnabled(true);
				this.setPage(Number(options.page));
			}
		}

		// Perform any defined sort rules in order, this allows multi-sort
		// operations.  Only do this once unless the sort rules change
		if (!this._is_executed) {
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
	Iterator.prototype.next = function() {

		if (this._iterator_key < this.getRows().length) {this._iterator_key++;}
		if (!this._is_executed) {this.execute();}
		this._iterator_value = undefined;

		// Pagination checks
		var min_page_row;
		var max_page_row;
		if (this._pagination.enabled) {
			min_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - this._pagination.rows_per_page;
			max_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - 1;
		}

		if (this._iterator_key < this.getRows().length) {
			for (var a = this._iterator_key; a < this.getRows().length; a++) {

				// Row matches current filters
				if (this.getRows()[a] && this.rowMatches(this.getRows()[a])) {

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
						this._iterator_value = this.getRows()[a];
						this._cur_value      = this.getRows()[a];
						break;
					}
				}
			}
			this._iterator_key = a;
		}

		return this._iterator_value;
	};

	/**
	 * Return the last data row matched by this iterator since the last execute() call
	 *
	 * @return {Object} A data row, else undefined
	 */
	Iterator.prototype.curr = function() {
		if (!this._is_executed) {throw new global.DatatableJs.lib.Exception('Iterators must be executed before they can be iterated');}
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
	Iterator.prototype.prev = function() {
		if (this._iterator_key > -1) {this._iterator_key--;}
		if (!this._is_executed) {throw new global.DatatableJs.lib.Exception('Iterators must be executed before they can be iterated');}
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
				if (this.getRows()[a] && this.rowMatches(this.getRows()[a])) {

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
						this._iterator_value = this.getRows()[a];
						this._cur_value      = this.getRows()[a];
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
	Iterator.prototype.rowMatches = function(row) {

		// AND matching between filters
		var ret_val = true;

		for (var a = 0; a < this._filters.length; a++) {

			// OR matching within a single filter using multiple fields, comparators or values
			var filter_matches = false;
			var filter = this._filters[a];

			if (!(filter.fields      instanceof Array)) {filter.fields      = [filter.fields];}
			if (!(filter.comparators instanceof Array)) {filter.comparators = [filter.comparators];}
			if (!(filter.values      instanceof Array)) {filter.values      = [filter.values];}

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
	Iterator.prototype._compare = function(data, comparators, values) {
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

	/**
	 * Flag noting whether the length has been calculated.  Any change to filter
	 * rules should set this to false.
	 * @type {Boolean}
	 */
	Iterator.prototype._length_is_calculated = false;

	/**
	 * Storage for the calculated number of rows for a given set of filters
	 * @type {Number}
	 */
	Iterator.prototype._calculated_length = 0;

	/**
	 * Support method for the Iterator.length property.
	 * Count the number of rows that match the current filter set.
	 * @return {Number}
	 */
	Iterator.prototype._getCalculatedLength = function() {
		if (!this._length_is_calculated) {
			if (0 === this._filters.length) {
				this._calculated_length = this.getRows().length;
			} else {
				for (var a = 0; a < this.getRows().length; a++) {
					if (this.getRows()[a] && this.rowMatches(this.getRows()[a])) {
						this._calculated_length++;
					}
				}
			}
		}
		return this._calculated_length;
	};

	/**
	 * Define the length property for the Iterator object
	 */
	Object.defineProperty(Iterator.prototype, 'length', {
		set: function() {
			throw new global.DatatableJs.lib.Exception('Cannot redefine property: length');
		}
		, get: function() {
			return this._getCalculatedLength();
		}
	});

	global.DatatableJs.lib.Iterator = Iterator;

}(this);
