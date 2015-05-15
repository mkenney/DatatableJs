/*!
 * DatatableJs v0.1.2 (https://github.com/mkenney/DatatableJs)
 * Copyright 2014-2015 Michael Kenney
 * Licensed under MIT (https://github.com/mkenney/DatatableJs/blob/master/LICENSE)
 */

+function(global, undefined) {
	'use strict';

	// This library uses console messages to provide non-fatal error feedback, make
	// sure those methods exist in all environments.
	if (!global.console)                {global.console = {};}
	if (!global.console.assert)         {global.console.assert         = function() {};}
	if (!global.console.count)          {global.console.count          = function() {};}
	if (!global.console.dir)            {global.console.dir            = function() {};}
	if (!global.console.error)          {global.console.error          = function() {};}
	if (!global.console.group)          {global.console.group          = function() {};}
	if (!global.console.groupCollapsed) {global.console.groupCollapsed = function() {};}
	if (!global.console.groupEnd)       {global.console.groupEnd       = function() {};}
	if (!global.console.info)           {global.console.info           = function() {};}
	if (!global.console.log)            {global.console.log            = function() {};}
	if (!global.console.time)           {global.console.time           = function() {};}
	if (!global.console.timeEnd)        {global.console.timeEnd        = function() {};}
	if (!global.console.trace)          {global.console.trace          = function() {};}
	if (!global.console.warn)           {global.console.warn           = function() {};}

	/**
	 * DatatableJs constructor
	 *
	 * @param {Array} schema Optional, an array of column definitions
	 * @param {Array} data   Optional, an array of data row objects
	 */
	var DatatableJs = function(args) {

		/**
		 * @private
		 * @type {DatatableJs.lib.Data}
		 */
		this._data = undefined;

		/**
		 * @private
		 * @type {DatatableJs.lib.Schema}
		 */
		this._schema = undefined;

		this.init(args);
	};

	/**
	 * Store class references so they can be created and validated on demand
	 *
	 * @type {Object}
	 */
	DatatableJs.lib = {
		  Column:    undefined
		, Schema:    undefined
		, Data:      undefined
		, Filter:    undefined
		, Exception: undefined
	};
	DatatableJs.prototype.lib = DatatableJs.lib;

	/**
	 * Initialize
	 *
	 * @param  {DatatableJs.lib.Schema}     schema Optional
	 * @param  {DatatableJs.lib.Data|Array} data   Optional
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.init = function(args) {
		if (undefined !== args.schema) {this.setSchema(args.schema);}
		if (undefined !== args.data)   {
			// Accept an array of data rows for convenience
			if ((args.data instanceof Array)) {
				var rows = args.data;
				args.data = new this.lib.Data();
				args.data.setSchema(this.getSchema());
				args.data.setRows(rows);
			}
			this.setData(args.data);
		}
		return this;
	};

	/**
	 * Get the current DatatableJs.lib.Data instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	DatatableJs.prototype.getData = function() {
		if (!(this._data instanceof this.lib.Data)) {this._data = new this.lib.Data();}
		return this._data;
	};

	/**
	 * Set the current DatatableJs.lib.Data instance
	 *
	 * @param  {DatatableJs.lib.Data} data
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.setData = function(data) {
		if (!(data instanceof DatatableJs.lib.Data)) {throw new DatatableJs.lib.Exception('The data definition must be an instance of DatatableJs.lib.Data');}
		this._data = data;
		return this;
	};

	/**
	 * Get the current set of data rows
	 *
	 * @return {Array}
	 */
	DatatableJs.prototype.getRows = function() {
		return this.getData().getRows();
	};

	/**
	 * Replace the current data set with an array of data rows
	 *
	 * @param  {Array} rows
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.setRows = function(rows) {
		if (!(rows instanceof Array)) {throw new DatatableJs.lib.Exception('The data definition must be an array of data rows');}
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
	DatatableJs.prototype.getSchema = function() {
		if (!(this._schema instanceof this.lib.Schema)) {
			this._schema = new this.lib.Schema();
		}
		return this._schema;
	};

	/**
	 * Set the current DatatableJs.lib.Schema instance
	 *
	 * @param  {DatatableJs.lib.Schema} schema
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.setSchema = function(schema) {
		if (undefined !== schema) {
			if (
				'object' === typeof schema
				&& !(schema instanceof DatatableJs.lib.Schema)
			) {
				schema = new this.lib.Schema(schema);
			}
			this._schema = schema;

			// re-evaluate rows
			if ((this._data instanceof DatatableJs.lib.Data)) {
				this._data.setSchema(schema);
			}
		}
		return this;
	};

	/**
	 * Generate a filter instance linked to the current schema and data references
	 *
	 * @return {DatatableJs.lib.Schema}
	 */
	DatatableJs.prototype.createFilter = function() {
		return new this.lib.Filter(this.getData(), this.getSchema());
	};

	global.DatatableJs = DatatableJs;

}(this);


/**
 * Exception class for the DatatableJs library
 * Just extends Error
 */
+function(global, undefined) {
    'use strict';

    /**
     * Exception constructor
     *
     * Defined as "DatatableJs.Exception"
     *
     * @param {String} message    Optional. Human-readable description of the error.
     * @param {String} fileName   Optional. The value for the fileName property on the created Error
     *                            object. Defaults to the name of the file containing the code that
     *                            called the Error() constructor.
     * @param {Number} lineNumber Optional. The value for the lineNumber property on the created Error
     *                            object. Defaults to the line number containing the Error() constructor
     *                            invocation.
     */
    var Exception = function(message, fileName, lineNumber) {
        this.message = message;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
    };

    Exception.prototype = Error.prototype;
    Exception.prototype.constructor = Exception;
    Exception.prototype.name = 'DatatableJs.Exception';

    global.DatatableJs.lib.Exception = Exception;

}(this);


+function(global, undefined) {
	'use strict';

	/**
	 * Schema constructor
	 *
	 * @param {Object} columns Optional, an object containing named DatatableJs.lib.Column instances
	 */
	var Schema = function(columns) {

		/**
		 * An object containing named DatatableJs.lib.Column instances
		 * @private
		 * @type {Object}
		 */
		this._columns = {};

		this.init(columns);
	}

	/**
	 * Initialize
	 * @param  {Object} columns Optional, an object containing named DatatableJs.lib.Column instances
	 * @return {DatatableJs.lib.Schema}
	 */
	Schema.prototype.init = function(columns) {
		if (columns) {
			this.setColumns(columns);
		}
		return this;
	}

	/**
	 * Get current column definitions
	 *
	 * @return {Object}
	 */
	Schema.prototype.getColumns = function() {
		return this._columns;
	}

	/**
	 * Set or extend current column definitions
	 *
	 * This does not replace the current column definitions, it only extends and
	 * updates
	 *
	 * @param  {Array} columns An array of column definition objects
	 * @return {DatatableJs.lib.Schema}
	 */
	Schema.prototype.setColumns = function(columns) {
		if ('object' !== typeof columns) {
			throw new global.DatatableJs.lib.Exception('The schema definition must be passed as simple object');
		}

		this._columns = {};

		for (var column_name in columns) {if (columns.hasOwnProperty(column_name)) {
			if (!(columns[column_name] instanceof global.DatatableJs.lib.Column)) {
				this._columns[column_name] = new global.DatatableJs.lib.Column(columns[column_name]);
			} else {
				this._columns[column_name] = columns[column_name];
			}
		}}

		return this;
	}

	/**
	 * Get a column definition by name
	 *
	 * @param  {String} column_name
	 * @return {Object|undefined} The schema definition for the specified column, else undefined
	 */
	Schema.prototype.getColumn = function(column_name) {
		if (undefined !== this._columns[column_name] && !(this._columns[column_name] instanceof global.DatatableJs.lib.Column)) {throw new global.DatatableJs.lib.Exception('The column "'+column_name+'" has an invalid definition');}
		return this._columns[column_name];
	}

	/**
	 * Delete a column definition by name
	 *
	 * @param  {String} column_name
	 * @return {DatatableJs.lib.Schema}
	 */
	Schema.prototype.deleteColumn = function(column_name) {
		if (undefined !== this._columns[column_name]) {
			delete this._columns[column_name];
		}
		return this;
	}

	/**
	 * Update or add a named column definition
	 *
	 * @param {String} column_name
	 * @param {Object} column_definition
	 * @return {DatatableJs.lib.Schema}
	 */
	Schema.prototype.setColumn = function(column_name, column_definition) {

		// Validate
		if (!column_name)                   {throw new global.DatatableJs.lib.Exception('Invalid column name: "'+column_name+'"');}
		if (!column_name instanceof String) {throw new global.DatatableJs.lib.Exception('The column name must be a string')}

		// Store
		this._columns[column_name] = column_definition;

		return this;
	}

	/**
	 * Test a row of data to see if it meets requirements for this schema definition
	 *
	 * @param  {Object}  row A data row
	 * @return {Boolean}
	 */
	Schema.prototype.isValidRow = function(row) {
		var ret_val = true;
		var columns = this.getColumns();

		for (var column in columns) {if (columns.hasOwnProperty(column)) {
			ret_val = this.isValidData(column, row[column]);
			if (!ret_val) {
				global.console.error('DatatableJs - Could not import row: "'+column+'" value is invalid', row[column], columns[column].getDefinition());
				break;
			}
		}}

		return ret_val;
	}

	/**
	 * Test an individual piece of data to see if meets requirements for a specified
	 * column
	 *
	 * @param  {String}  column
	 * @param  {mixed}   value
	 * @return {Boolean}
	 */
	Schema.prototype.isValidData = function(col, value) {

		/**
		 * Get a variable's data type
		 *
		 * javscript type checking is stupid...
		 *
		 *     1 instanceof Number             === false
		 *     Number(1) instanceof Number     === false
		 *     new Number(1) instanceof Number === true
		 *     NaN instanceof Number           === false
		 *     null instanceof Object          === false
		 *     typeof 1                        === "number"
		 *     typeof Number                   === "function"
		 *     typeof Number(1)                === "number"
		 *     typeof new Number(1)            === "object"
		 *     typeof NaN                      === "number"
		 *     typeof null                     === "object"
		 *
		 * This function will return a string name of the native type or 'Object'
		 * for custom object instances
		 *
		 * @param  {mixed}  value The value to check
		 * @return {String}       The native type name as a string ala typeof()
		 *                        but accurate for native values and instances:
		 *
		 *                            getType(1)             === "Number"
		 *                            getType(Number(1))     === "Number"
		 *                            getType(new Number(1)) === "Number"
		 *                            getType(Number)        === "Function" - use instanceof in this case
		 *                            getType(NaN)           === "NaN"
		 *                            getType()              === "Undefined"
		 *                            getType(null)          === "Null"
		 */
		var getType = function(value) {
			var ret_val = '';
			if (null === value) {
				ret_val = 'Null';
			} else {
				ret_val = {}.toString.call(value).replace(/[\[\]]/g, '').split(' ')[1];
			}
			if ('Number' === ret_val && isNaN(value)) {
				ret_val = 'NaN';
			}
			return ret_val;
		}

		var ret_val = true;
		var column = this.getColumn(col);

		if (ret_val) {

			ret_val = (
					// Datatype is not defined
					undefined === column.get('type')
				||	(
					// Datatype is specified using a string in the schema
					getType(value) === column.get('type')
				)
				|| (
					// Null data check
					'Undefined' === getType(value)
					&& column.get('nullable')
				)
				|| (
					// Datatype is specified as a function reference but the
					// actual value is probably a primitive
					'Function' === getType(column.get('type'))
					&& getType(value) === column.get('type').name
				)
				|| (
					// Datatype is specified as a function reference for instance
					// checks
					'Function' === getType(column.get('type'))
					&& value instanceof column.get('type')
				)
			);
		}

		return ret_val;
	}

	global.DatatableJs.lib.Schema = Schema;

}(this);


+function(global, undefined) {
	'use strict';

	/**
	 * Constructor
	 *
	 * @param  {Object} column_definition
	 * @return {DatatableJs.lib.Column}
	 */
	var Column = function(column_definition) {

		/**
		 * Default column definition
		 *
		 * All fields are optional
		 *
		 * @private
		 * @type {Object}
		 *     type:             String    // A data type.  Any type if undefined
		 *     nullable:         true      // Whether to allow 'undefined' or omitted values
		 *     sort_comparator:  undefined // A custom comparison function taking 3 arguments,
		 *                                 // value a, value b and sort direction (either 'asc' or 'desc')
		 *     sort_transformer: undefined // A custom data transformation function taking 1 argument
		 *                                 // that transforms value a and value b before the sort
		 *                                 // comparison
		 *     sort_direction:   'asc'     // The default sort direction for this column
		 */
		this._column_definition = {};

		this.init(column_definition);

		return this;
	};

	/**
	 * Initialize
	 *
	 * @param  {Object} column_definition
	 * @return {DatatableJs.lib.Column}
	 */
	Column.prototype.init = function(column_definition) {
		return this.setDefinition(column_definition);
	};

	/**
	 * Get a column property
	 *
	 * @param  {String} field
	 * @return {mixed}
	 */
	Column.prototype.get = function(field) {
		return this.getDefinition()[field];
	};

	/**
	 * Set a column property
	 *
	 * @param  {String} field
	 * @param  {mixed}  value
	 * @return {DatatableJs.lib.Column}
	 */
	Column.prototype.set = function(field, value) {
		this.getDefinition()[field] = value;
		return this;
	};

	/**
	 * Get the full definition object for this column
	 *
	 * @return {Object}
	 */
	Column.prototype.getDefinition = function() {
		return this._column_definition;
	};

	/**
	 * Extend the current column definition
	 *
	 * @param  {Object} column_definition
	 * @return {DatatableJs.lib.Column}
	 */
	Column.prototype.setDefinition = function(column_definition) {

		// Validate
		if (undefined === column_definition) {column_definition = {};}
		if ('object' !== typeof column_definition) {throw new global.DatatableJs.lib.Exception('Column definitions must be passed as an object');}

		// Store
		for (var property in column_definition) {if (column_definition.hasOwnProperty(property)) {
			this._column_definition[property] = column_definition[property];
		}}

		return this;
	};

	global.DatatableJs.lib.Column = Column;

}(this);


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
		if (undefined !== rows && (rows instanceof Array)) {
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

		if (0 === row_key)                              {global.console.info('DatatableJs - No data rows found');}
		if (0 === this.getRows().length && row_key > 0) {global.console.info('DatatableJs - No valid data rows found');}
		if (this.getRows().length < row_key)            {global.console.info('DatatableJs - '+(row_key - this.getRows().length)+' of '+row_key+' data rows were invalid');}

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
		if (0 === Object.keys(row).length) {global.console.warn('DatatableJs - An attempt to insert an empty data row rejected');}

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
			row.__pos__ = this._rows.length;
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
	 * Get the current DatatableJs.lib.Data instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	Filter.prototype.getData = function() {
		if (!(this._data instanceof global.DatatableJs.lib.Data)) {this._data = new global.DatatableJs.lib.Data();}
		return this._data;
	};

	/**
	 * Set the current DatatableJs.lib.Data reference
	 *
	 * @param  {DatatableJs.lib.Data}   data
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.setData = function(data) {
		if (!(data instanceof global.DatatableJs.lib.Data)) {throw new global.DatatableJs.lib.Exception('"data" must be an instance of DatatableJs.lib.Data');}
		this._data = data;
		return this;
	};

	/**
	 * Get the current set of data rows
	 *
	 * @return {Array}
	 */
	Filter.prototype.getRows = function() {
		return this.getData().getRows();
	};

	/**
	 * Replace the current data set with an array of data rows
	 *
	 * @param  {Array} rows
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.setRows = function(rows) {
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
	Filter.prototype.getSchema = function() {
		if (!(this._schema instanceof global.DatatableJs.lib.Schema)) {
			this._schema = new global.DatatableJs.lib.Schema();
		}
		return this._schema;
	};

	/**
	 * Set the current DatatableJs.lib.Schema instance
	 *
	 * @param  {DatatableJs.lib.Schema} schema
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.setSchema = function(schema) {
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
	Filter.prototype.addFilterRule = function(filter) {

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

		// Rule rejected
		} else {
			global.console.error('DatatableJs - An invalid filter definition was rejected', filter);
		}

		return this;
	};

	/**
	 * Add a sorting rule.  Supports a stable multi-sort.
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
			global.console.error('DatatableJs - An invalid sort definition was rejected', sort);
		}

		return this;
	};

	/**
	 * Clear all sort rules
	 *
	 * @param  {Array}                   sort
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.clearSortRules = function() {
		this._sorts = [];
		return this;
	};

	/**
	 * Set all sort rules at once
	 *
	 * @param  {Array}                   sort
	 * @return {DatatableJs.lib.Filter}
	 */
	Filter.prototype.setSortRules = function(sort_rules) {
		if (!(sort_rules instanceof Array)) {throw new global.DatatableJs.lib.Exception('Sort rules must be an array of valid rule definition objects');}

		this.clearSortRules();
		for (var a = 0; a < sort_rules.length; a++) {
			this.addSortRule(sort_rules[a]);
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
	Filter.prototype.rowMatches = function(row) {

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
