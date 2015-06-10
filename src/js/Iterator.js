
/**
 * Iterator class for the DatatableJs library
 * References a DatatableJs instance
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
	var Iterator = function(datatable_instance) {

		if (!(datatable_instance instanceof global.DatatableJs)) {throw new global.DatatableJs.lib.Exception('Iterator constructor requres a DatatableJs reference');}

		this.datatable_instance = datatable_instance;

		this.shadow_instance = new global.DatatableJs();
		this.shadow_instance.setSchema(this.datatable_instance.getSchema());
		this.shadow_instance.isShadow(true);

		/**
		 * Reference to the last matched row
		 * @private
		 * @type {Object}
		 */
		this._cur_value = undefined;

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
		 * [_is_filtered description]
		 * @private
		 * @type {Boolean}
		 */
		this._is_filtered = false;

		/**
		 * [_is_sorted description]
		 * @private
		 * @type {Boolean}
		 */
		this._is_sorted = false;

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
	};

	/**
	 * Get the current DatatableJs.lib.Data instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	Iterator.prototype.getData = function() {
		this.applyFilterRules();
		return this.shadow_instance.getData();
	};

	/**
	 * Get the current set of data rows
	 *
	 * @return {Array}
	 */
	Iterator.prototype.getRows = function() {
		this.applyFilterRules();
		return this.shadow_instance.getRows();
	};

	/**
	 * Get the current DatatableJs.lib.Schema instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Schema}
	 */
	Iterator.prototype.getSchema = function() {
		return this.datatable_instance.getSchema();
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
		if (filter && filter.fields && filter.comparators && filter.values) {
			if (!(filter.fields instanceof Array))      {filter.fields = [filter.fields];}
			if (!(filter.comparators instanceof Array)) {filter.comparators = [filter.comparators];}
			if (!(filter.values instanceof Array))      {filter.values = [filter.values];}

			this._filters.push({
				  fields:      filter.fields
				, comparators: filter.comparators
				, values:      filter.values
			});
			this._is_filtered = false;

		// Rule rejected
		} else {
			throw new global.DatatableJs.lib.Exception('An invalid filter definition was rejected', filter);
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
		this._is_filtered = false;
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
		if (sort && sort.column && sort.column+'') { // Only column is required
			this._sorts.push({
				  column:      sort.column+''
				, direction:   (sort.direction ? sort.direction : undefined)
				, comparator:  (sort.comparator ? sort.comparator : undefined)
				, transformer: (sort.transformer ? sort.transformer : undefined)
			});
			this._is_sorted = false;

		// Rule rejected
		} else {
			throw new global.DatatableJs.lib.Exception('An invalid sort definition was rejected', sort);
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
		this._is_sorted = false;
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
		if (
			undefined === pagination
			|| (
				undefined === pagination.enabled
				&& undefined === pagination.rows_per_page
				&& undefined === pagination.current_page
			)
		) {
			throw new global.DatatableJs.lib.Exception('An invalid pagination rule was rejected', pagination);
		}

		// Merge with current or default values
		if (!pagination.enabled) {
			pagination.enabled = (this._pagination.enabled ? this._pagination.enabled : _PAGINATION_DEFAULTS.enabled);
		}
		if (!pagination.rows_per_page) {
			pagination.rows_per_page = (this._pagination.rows_per_page ? this._pagination.rows_per_page : _PAGINATION_DEFAULTS.rows_per_page);
		}
		if (!pagination.current_page) {
			pagination.current_page  = (this._pagination.current_page ? this._pagination.current_page : _PAGINATION_DEFAULTS.current_page);
		}

		// Typecast/typecheck
		pagination.enabled       = (true === pagination.enabled);
		pagination.rows_per_page = Math.round(Number(pagination.rows_per_page));
		pagination.current_page  = Math.round(Number(pagination.current_page));

		this._pagination.enabled       = pagination.enabled;
		this._pagination.rows_per_page = pagination.rows_per_page;
		this._pagination.current_page  = pagination.current_page;

		return this;
	};

	/**
	 * Get the current page value
	 * @return {Number}
	 */
	Iterator.prototype.getPage = function() {
		return Number(this._pagination.current_page);
	}

	/**
	 * Set the current page value
	 *
	 * @param  {Number}
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setPage = function(page) {
		if (!page) {throw new global.DatatableJs.lib.Exception('Invalid page number "'+page+'"');}
		this._pagination.current_page = Math.round(Number(page));
		return this;
	}

	/**
	 * Get the current number of rows per page
	 *
	 * @return {Number}
	 */
	Iterator.prototype.getRowsPerPage = function() {
		return this._pagination.rows_per_page;
	}

	/**
	 * Set the numer of rows per page
	 *
	 * Always sets the current page to 1
	 *
	 * @param  {Number} rows
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setRowsPerPage = function(rows) {
		if (!rows) {throw new global.DatatableJs.lib.Exception('Invalid page size "'+rows+'"');}
		this._pagination.rows_per_page = Math.round(Number(rows));
		this._pagination.current_page = 1;
		return this;
	}

	/**
	 * Get the current enablement flag for pagination limiters
	 *
	 * @param {Boolean}
	 */
	Iterator.prototype.getPaginationEnabled = function() {
		return (this._pagination.enabled === true);
	}

	/**
	 * Enable or disable pagination limiters
	 * @param  {Boolean} enabled
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setPaginationEnabled = function(enabled) {
		this._pagination.enabled = (true === enabled);
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

		// Set the current page
		if (options && options.page) {
			this.setPaginationEnabled(true);
			this.setPage(Number(options.page));
		}

		this._iterator_key   = this.getMinRow() - 1;
		this._iterator_value = undefined;

		// Shadow-copy the filtered data
		this.applyFilterRules();

		// Perform any defined sort rules in order on the shadow copy.
		// This allows multi-sort operations.  Only do this once unless the sort
		// rules change
		this.applySortRules();

		this._is_executed = true;

		return this;
	};

	/**
	 * Shadow-copy the filtered data
	 * @return {[type]} [description]
	 */
	Iterator.prototype.applyFilterRules = function() {
		if (!this._is_filtered) {
			this.shadow_instance.getData().truncate();
			for (var a = 0; a < this.datatable_instance.getRows().length; a++) {
				if (
					this.datatable_instance.getRows()[a]
					&& this.rowMatches(this.datatable_instance.getRows()[a])
				) {
					this.shadow_instance.addRow(this.datatable_instance.getRows()[a]);
				}
			}
			this._is_filtered = true;
		}
		return this;
	};

	/**
	 * Perform any defined sort rules in order, this allows multi-sort
	 * operations.
	 * @return {[type]} [description]
	 */
	Iterator.prototype.applySortRules = function() {
		if (!this._is_sorted) {
			if (0 < this._sorts.length) {
				for (var a = 0; a < this._sorts.length; a++) {
					this.datatable_instance.getData().sort(
						  this._sorts[a].column
						, this._sorts[a].direction
						, this._sorts[a].comparator
						, this._sorts[a].transformer
					);
				}
			}

			this.shadow_instance.getData().sort('__pos__', 'asc');

			this._is_sorted = true;
		}
		return this;
	}

	Iterator.prototype.sort = function() {
		if (!this._is_sorted) {
			this.applySortRules();
		} else {
			this.datatable_instance.getData().sort();
			this.shadow_instance.getData().sort();
		}
		return this;
	}

	Iterator.prototype.getMinRow = function() {
		var min_page_row = 0;
		if (this._pagination.enabled) {
			min_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - this._pagination.rows_per_page;
		}
		return min_page_row;
	}

	Iterator.prototype.getMaxRow = function() {
		var max_page_row = this.getRows().length;
		if (this._pagination.enabled) {
			max_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - 1;
		}
		return max_page_row;
	}

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

		if (!this._is_executed) {this.execute();}
		if (this._iterator_key <= this.getMaxRow()) {this._iterator_key++;}
		this._iterator_value = undefined;

		if (
			this._iterator_key >= this.getMinRow()
			&& this._iterator_key <= this.getMaxRow()
			&& this.getRows()[this._iterator_key]
		) {
			this._iterator_value = this.getRows()[this._iterator_key];
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
		return this._iterator_value;
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

		if (this._iterator_key >= this.getMinRow()) {this._iterator_key--;}
		if (!this._is_executed) {throw new global.DatatableJs.lib.Exception('Iterators must be executed before they can be iterated');}
		this._iterator_value = undefined;

		if (
			this._iterator_key >= this.getMinRow()
			&& this._iterator_key <= this.getMaxRow()
			&& this.getRows()[this._iterator_key]
		) {
			this._iterator_value = this.getRows()[this._iterator_key];
		}

		return this._iterator_value;
	};

	/**
	 * Delete the current row from the dataset
	 *
	 * @todo This might break other iterators created on the same datatable... keep an eye on that
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.remove = function() {
		this.datatable_instance.getRows().splice(this.getRows()[this._iterator_key].__pos__, 1);
		this.getRows().splice(this._iterator_key, 1);
		while (this._iterator_key > this.getRows().length) {this._iterator_key--;}

		this.datatable_instance.getData().indexRows();
		this._iterator_value = this.getRows()[this._iterator_key];
		this._cur_value      = this.getRows()[this._iterator_key];
		return this;
	}

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
						case '<':   ret_val = (data <   values[b]); break;
						case '<=':  ret_val = (data <=  values[b]); break;
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

	Iterator.prototype.reset = function() {
		this
			.clearFilterRules()
			.clearSortRules()
			.execute();
		this._is_executed = false;
	}

	Iterator.prototype.where = function(fields, comparators, values) {
		return this.addFilterRule({
			fields: fields
			, comparators: comparators
			, values: values
		});
	};

	Iterator.prototype.and = function(fields, comparators, values) {
		return this.where(fields, comparators, values);
	};

	Iterator.prototype.orderBy = function(column, direction, comparator, transformer) {
		return this.addSortRule({
			column: column
			, direction: direction
			, comparator: comparator
			, transformer: transformer
		});
	}

	/**
	 * Define the length property for the Iterator object
	 */
	Object.defineProperty(Iterator.prototype, 'length', {
		set: function() {
			throw new global.DatatableJs.lib.Exception('Cannot redefine property: length');
		}
		, get: function() {
			this.applyFilterRules();
			return this.shadow_instance.getRows().length
		}
	});

	global.DatatableJs.lib.Iterator = Iterator;

}(this);
