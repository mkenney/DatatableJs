
+function(global, undefined) {
	'use strict';

	/**
	 * Privately scoped environment data
	 *
	 * @private
	 */
	var ENV = {};

	/**
	 * Define log levels
	 *
	 * @type {Array}
	 */
	ENV.log_levels = [
		'trace'   // 0
		, 'debug' // 1
		, 'info'  // 2
		, 'warn'  // 3
		, 'error' // 4
		, 'off'   // 5
	];

	/**
	 * Store the current log level
	 *
	 * @type {Number}
	 */
	ENV.log_level = ENV.log_levels.indexOf('info');

	/**
	 * This library uses console messages to provide non-fatal error feedback,
	 * make sure those methods exist in all environments.
	 *
	 * @type {Console}
	 */
	ENV.console = global.console;
	if (!ENV.console)                {ENV.console = {};}
	if (!ENV.console.assert)         {ENV.console.assert         = function() {};}
	if (!ENV.console.count)          {ENV.console.count          = function() {};}
	if (!ENV.console.dir)            {ENV.console.dir            = function() {};}
	if (!ENV.console.error)          {ENV.console.error          = function() {};}
	if (!ENV.console.group)          {ENV.console.group          = function() {};}
	if (!ENV.console.groupCollapsed) {ENV.console.groupCollapsed = function() {};}
	if (!ENV.console.groupEnd)       {ENV.console.groupEnd       = function() {};}
	if (!ENV.console.info)           {ENV.console.info           = function() {};}
	if (!ENV.console.log)            {ENV.console.log            = function() {};}
	if (!ENV.console.time)           {ENV.console.time           = function() {};}
	if (!ENV.console.timeEnd)        {ENV.console.timeEnd        = function() {};}
	if (!ENV.console.trace)          {ENV.console.trace          = function() {};}
	if (!ENV.console.warn)           {ENV.console.warn           = function() {};}

	/**
	 * Map of console methods to log level values
	 *
	 * @type {Object}
	 */
	ENV.console_levels = {};
	ENV.console_levels.assert         = 0;
	ENV.console_levels.count          = 0;
	ENV.console_levels.dir            = 0;
	ENV.console_levels.error          = 4;
	ENV.console_levels.group          = 2;
	ENV.console_levels.groupCollapsed = 2;
	ENV.console_levels.groupEnd       = 2;
	ENV.console_levels.info           = 2;
	ENV.console_levels.log            = 1;
	ENV.console_levels.time           = 1;
	ENV.console_levels.timeEnd        = 1;
	ENV.console_levels.trace          = 0;
	ENV.console_levels.warn           = 3;

	/**
	 * Get the logging level
	 *
	 * Default to 'info'
	 *
	 * @return {Number}
	 */
	ENV.getLogLevel = function() {
		if (undefined === ENV.log_levels[Number(ENV.log_level)]) {
			ENV.setLogLevel('info');
		}
		return ENV.log_levels[ENV.log_level];
	};

	/**
	 * Set the current DatatableJs.lib.Data instance
	 *
	 * @param  {String}      log_level
	 * @return {DatatableJs}
	 */
	ENV.setLogLevel = function(log_level) {
		if (-1 === ENV.log_levels.indexOf(log_level))   {
			throw new DatatableJs.lib.Exception('Invalid log level: '+log_level);
		}
		ENV.log_level = ENV.log_levels.indexOf(log_level);
		ENV.buildLogger();
	};

	/**
	 * Setup the logger
	 *
	 * @return {[type]} [description]
	 */
	ENV.buildLogger = function() {
		global.DatatableJs.console = {};
		for (var a in ENV.console_levels) if (ENV.console_levels.hasOwnProperty(a)) {
			/*jshint loopfunc:true */
			if (ENV.console_levels[a] >= ENV.log_levels.indexOf(this.getLogLevel())) {
				global.DatatableJs.console[a] = function() {
					return ENV.console[a].apply(ENV.console, arguments);
				};
			} else {
				global.DatatableJs.console[a] = function() {};
			}
			/*jshint loopfunc:false */
		}
		return global.DatatableJs.console;
	};

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
		, Iterator:    undefined
		, Exception: undefined
	};
	DatatableJs.prototype.lib = DatatableJs.lib;

	/**
	 * Default value for the is_shaow flag
	 * @type {Boolean}
	 */
	DatatableJs.prototype._is_shadow = false;

	/**
	 * Initialize
	 *
	 * @param  {DatatableJs.lib.Schema}     schema Optional
	 * @param  {DatatableJs.lib.Data|Array} data   Optional
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.init = function(args) {
		// Store
		if (args) {
			if (undefined !== args.schema)    {this.setSchema(args.schema);}
			if (undefined !== args.data)      {this.setData(args.data);}
			if (undefined !== args.log_level) {this.setLogLevel(args.log_level);}
		}

		return this;
	};

	/**
	 * Deep-copy the current instance and return the result.  Do this when you
	 * need to avoid conflicts when sharing a dataset among multiple independent
	 * processes.
	 *
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.clone = function() {
		var data_copy = global.JSON.parse(global.JSON.stringify(this.getRows()));
		return new DatatableJs({
			  data: data_copy
			, schema: this.getSchema()
		}).isShadow(this.isShadow());
	};

	/**
	 * Get the current DatatableJs.lib.Data instance
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	DatatableJs.prototype.getData = function() {
		if (!(this._data instanceof this.lib.Data)) {
			this._data = new this.lib.Data();
			this._data.setSchema(this.getSchema());
			this._data.isShadow(this.isShadow());
		}
		return this._data;
	};

	/**
	 * Set the current DatatableJs.lib.Data instance
	 *
	 * @param  {DatatableJs.lib.Data} data
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.setData = function(data) {
		if (undefined !== data)   {
			// Accept an array of data rows for convenience
			if ((data instanceof Array)) {
				var rows = data;
				data = new this.lib.Data();
				data.setSchema(this.getSchema());
				data.setRows(rows);
				data.isShadow(this.isShadow());
			} else if (!(data instanceof DatatableJs.lib.Data)) {
				throw new DatatableJs.lib.Exception('The data definition must be an array of data rows or an instance of DatatableJs.lib.Data');
			}
			this._data = data;
		}
		return this;
	};

	/**
	 * Get the logging level
	 *
	 * Default to 'info'
	 *
	 * @return {Number}
	 */
	DatatableJs.prototype.getLogLevel = function() {
		return ENV.getLogLevel();
	};

	/**
	 * Set the current DatatableJs.lib.Data instance
	 *
	 * @param  {String}      log_level
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.setLogLevel = function(log_level) {
		ENV.setLogLevel(log_level);
		return this;
	};

	/**
	 * Add a row to the current set
	 *
	 * @param {Array}
	 */
	DatatableJs.prototype.addRow = function(row) {
		return this.getData().addRow(row);
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
	 * Get a single (the first) data row that matches field values passed in options
	 *
	 * This is just a very simple iterator wrapper.
	 *
	 * @param  {Object} options Key => Value pairs
	 * @return {Array}
	 */
	DatatableJs.prototype.getRow = function(options) {
		var iterator = this.createIterator();
		for (var a in options) if (options.hasOwnProperty(a)) {
            if (options[a]) {
                iterator.addFilterRule({
                    fields: a
                    , comparators: '=='
                    , values: options[a]
                });
            }
		}
		return iterator.next();
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
	 * Generate an iterator instance linked to the current schema and data references
	 *
	 * @return {DatatableJs.lib.Iterator}
	 */
	DatatableJs.prototype.createIterator = function() {
		return new this.lib.Iterator(this);
	};

	/**
	 * Remove data rows based on an iterator definition
	 *
	 * @param  {DatatableJs.lib.Iterator} iterator
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.splice = function(iterator) {
		if (!(iterator instanceof this.lib.Iterator)) {throw new DatatableJs.lib.Exception('Splicing the data requires an Iterator for filtering');}
		iterator.execute();
		while (iterator.next()) {
			iterator.remove();
		}
		this.getData().indexRows();
		return this;
	};

	/**
	 * Get/Set a flag noting whether this is a shadow instance
	 *
	 * @param
	 * @return {DatatableJs.lib.Iterator}
	 */
	DatatableJs.prototype.isShadow = function(bool) {
		var ret_val;
		if ('undefined' !== typeof bool) {
			this._is_shadow = Boolean(bool);
			if (this._data instanceof this.lib.Data) {
				this._data.isShadow(this._is_shadow);
			}
			ret_val = this;
		} else {
			ret_val = this._is_shadow;
		}
		return ret_val;
	};

	global.DatatableJs = DatatableJs;
	ENV.buildLogger();

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
	};

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
	};

	/**
	 * Get current column definitions
	 *
	 * @return {Object}
	 */
	Schema.prototype.getColumns = function() {
		return this._columns;
	};

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
	};

	/**
	 * Get a column definition by name
	 *
	 * @param  {String} column_name
	 * @return {Object|undefined} The schema definition for the specified column, else undefined
	 */
	Schema.prototype.getColumn = function(column_name) {
		if (undefined !== this._columns[column_name] && !(this._columns[column_name] instanceof global.DatatableJs.lib.Column)) {throw new global.DatatableJs.lib.Exception('The column "'+column_name+'" has an invalid definition');}
		return this._columns[column_name];
	};

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
	};

	/**
	 * Update or add a named column definition
	 *
	 * @param {String} column_name
	 * @param {Object} column_definition
	 * @return {DatatableJs.lib.Schema}
	 */
	Schema.prototype.setColumn = function(column_name, column_definition) {

		// Validate
		if (!column_name)                    {throw new global.DatatableJs.lib.Exception('Invalid column name: "'+column_name+'"');}
		if ('string' !== typeof column_name) {throw new global.DatatableJs.lib.Exception('The column name must be a string');}
		if (!(column_definition instanceof global.DatatableJs.lib.Column)) {
			column_definition = new global.DatatableJs.lib.Column(column_definition);
		}

		// Store
		this._columns[column_name] = column_definition;

		return this;
	};

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
				global.DatatableJs.console.error('DatatableJs.lib.Schema: "'+column+'" value is invalid', row[column], columns[column].getDefinition());
				break;
			}
		}}

		return ret_val;
	};

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
		};

		var ret_val = true;
		var column = this.getColumn(col);

		// Null data check
		if (
			false === column.get('nullable')
			&& (
				'undefined' === typeof value
				|| null === value
				|| '' === value
			)
		) {
			ret_val = false;
		}

        // Datatype is defined, continue type checking
        if (
            ret_val
            && null !== value
            && undefined !== value
            && '' !== value
            && undefined !== column.get('type')) {

            ret_val = (
                    // Datatype is specified using a string in the schema
                    getType(value) === column.get('type')
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
                    && (value instanceof column.get('type'))
                )
            );
        }

		/*
			//ret_val = (
			//		// Datatype is not defined
			//		undefined === column.get('type')
			//	||	(
			//		// Datatype is specified using a string in the schema
			//		getType(value) === column.get('type')
			//	)
			//	|| (
			//		// Null data check
			//		column.get('nullable')
			//		&& ('Undefined' === getType(value))
			//	)
			//	|| (
			//		// Datatype is specified as a function reference but the
			//		// actual value is probably a primitive
			//		'Function' === getType(column.get('type'))
			//		&& getType(value) === column.get('type').name
			//	)
			//	|| (
			//		// Datatype is specified as a function reference for instance
			//		// checks
			//		'Function' === getType(column.get('type'))
			//		&& (value instanceof column.get('type'))
			//	)
			//);
		*/
		return ret_val;
	};

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
		 *
		 *     nullable:         true      // Whether to allow 'undefined' or omitted values
		 *
		 *     sort_direction:   'asc'     // The default sort direction for this column
		 *
		 *     sort_comparator:  undefined // A custom comparison function taking 3 arguments,
		 *                                 // value a, value b and sort direction (either 'asc' or 'desc')
		 *
		 *     sort_transformer: undefined // A custom data transformation function taking 1 argument
		 *                                 // that transforms value a and value b before the sort
		 *                                 // comparison
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

			// Update row position tracking for future sorts to allow multi-column
			// sorting
			this.indexRows();

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

					if (undefined === a || null === a) {ret_val = -1;}
					else if (undefined === b || null === b) {ret_val = 1;}
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

				// Perform any specified pre-comparison transformations
				if (undefined !== transformer) {
					a_val = transformer(a_val);
					b_val = transformer(b_val);
				}

				// Sort rows missing data to the "bottom"
				if ((undefined === a_val || null === a_val || '' === a_val) && a_val !== b_val) {
					ret_val = 1;

				} else if ((undefined === b_val || null === b_val || '' === b_val) && a_val !== b_val) {
					ret_val = -1;

				// Maintain relative position when values are equal to allow
				// multi-column sorting
				} else if (a_val === b_val) {
					if ('asc' === direction) {
						ret_val = a.__pos__ - b.__pos__;
					} else {
						ret_val = b.__pos__ - a.__pos__;
					}

				} else {
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
	};

	// Update row position tracking for future sorts to allow multi-column
	// sorting
	Data.prototype.indexRows = function() {
		for (var a = 0; a < this._rows.length; a++) {
			this._rows[a].__pos__ = a;
		}
		return this;
	};

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
	};

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
	};

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

		this.shadow_index = [];

		/**
		 * Reference to the last matched row
		 * @private
		 * @type {Object}
		 */
		this._cur_value = undefined;

		/**
		 * An array of Object instances defining filters
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
		this._sorts = [];
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
	 * Get the current set of filter rules
	 *
	 * @return {Array}
	 */
	Iterator.prototype.getFilterRules = function() {
		return this._filters;
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
	 * Get the current set of sorting rules
	 *
	 * @param  {Array}                   sort
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.getSortRules = function() {
		return this._sorts;
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
	};

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
	};

	/**
	 * Get the current number of rows per page
	 *
	 * @return {Number}
	 */
	Iterator.prototype.getRowsPerPage = function() {
		return this._pagination.rows_per_page;
	};

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
	};

	/**
	 * Get the current enablement flag for pagination limiters
	 *
	 * @param {Boolean}
	 */
	Iterator.prototype.getPaginationEnabled = function() {
		return (this._pagination.enabled === true);
	};

	/**
	 * Enable or disable pagination limiters
	 * @param  {Boolean} enabled
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype.setPaginationEnabled = function(enabled) {
		this._pagination.enabled = (true === enabled);
		return this;
	};

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
			this.shadow_index = [];
			for (var a = 0; a < this.datatable_instance.getRows().length; a++) {
				if (
					this.datatable_instance.getRows()[a]
					&& this.rowMatches(this.datatable_instance.getRows()[a])
				) {
					this.shadow_instance.addRow(this.datatable_instance.getRows()[a]);
					this.shadow_index.push(this.datatable_instance.getRows()[a].__pos__);
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
	};

	Iterator.prototype.sort = function() {
		if (!this._is_sorted) {
			this.applySortRules();
		} else {
			this.datatable_instance.getData().sort();
			this.shadow_instance.getData().sort();
		}
		return this;
	};

	Iterator.prototype.getMinRow = function() {
		var min_page_row = 0;
		if (this._pagination.enabled) {
			min_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - this._pagination.rows_per_page;
		}
		return min_page_row;
	};

	Iterator.prototype.getMaxRow = function() {
		var max_page_row = this.getRows().length;
		if (this._pagination.enabled) {
			max_page_row = (this._pagination.current_page * this._pagination.rows_per_page) - 1;
		}
		return max_page_row;
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
		this.datatable_instance.getRows().splice(this.shadow_index[this._iterator_key], 1);
		this.getRows().splice(this._iterator_key, 1);
		this.shadow_index.splice(this._iterator_key, 1);
		while (this._iterator_key > this.getRows().length) {this._iterator_key--;}

		this.datatable_instance.getData().indexRows();
		this._iterator_value = this.getRows()[this._iterator_key];
		this._cur_value      = this.getRows()[this._iterator_key];
		return this;
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
	};

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
	};

	/**
	 * Define the length property for the Iterator object
	 */
	Object.defineProperty(Iterator.prototype, 'length', {
		set: function() {
			throw new global.DatatableJs.lib.Exception('Cannot redefine property: length');
		}
		, get: function() {
			this.applyFilterRules();
			return this.shadow_instance.getRows().length;
		}
	});

	/**
	 * Download the data as a CSV or Tab-delimited text file
	 * A schema is required for exports in order to ensure proper column order.
	 * Also, in order to support automatic parsing of the data by Excel, for CSV
	 * exports commas in a data column are replaced with a semi-colon and tab
	 * characters are replaced with the string '\t'.
	 * @param  {String}   as       The file export format, accepts 'tdt', 'tsv' and
	 *                             'txt' for tab-delmited and 'csv' for comma-separated.
	 *                             This is also the default file extension.
	 * @param  {String}   filename The default file name, excluding the file extension
	 * @return {DatatableJs.lib.Iterator}
	 */
	Iterator.prototype['export'] = function(as, filename) {
		var self = this;
		var separator;
		var data = [];
		var row = [];
		var a;
		var b;
		var data_rows = self.applyFilterRules().getRows();
		var cell_data;
		var file_data = [];
		var file_blob;
		var file_url;
		var file_link;
		var mime_type;

		var columns = this.datatable_instance.getSchema().getColumns();
		if (!Object.keys(columns).length) {
			throw new global.DatatableJs.lib.Exception('A data schema is required for exports');
		}

		if (!filename) {
			filename = 'export';
		}

		switch (String(as).toLowerCase()) {
			default:
			case 'csv':
				as = 'csv';
				separator = ',';
				mime_type = 'text/csv';
			break;

			case 'tdt':
			case 'tsv':
			case 'txt':
				// jscs:disable validateQuoteMarks
				separator = "\t";
				// jscs:enable
				mime_type = 'text/tab-separated-values';
			break;
		}

		for (a in columns) if (columns.hasOwnProperty(a)) {
			row.push(a);
		}
		data.push(row);

		for (a = 0; a < data_rows.length; a++) {
			row = [];
			for (b in columns) if (columns.hasOwnProperty(b)) {
				if (data_rows[a][b] instanceof Array) {
					cell_data = data_rows[a][b].join(',');

				} else if (data_rows[a][b] && data_rows[a][b].prototype && Object === data_rows[a][b].prototype) {
					cell_data = global.JSON.stringify(data_rows[a][b]);

				} else {
					cell_data = data_rows[a][b];
				}

				if (cell_data) {
					if ('csv' === as) {
						cell_data = String(cell_data).replace(/,/g, ';');
					} else {
						cell_data = String(cell_data).replace(/\t/g, '\t');
					}
				}
				row.push(cell_data);
			}
			data.push(row);
		}

		for (a = 0; a < data.length; a++) {
			file_data.push('"'+data[a].join('"'+separator+'"')+'"');
		}

		file_blob = new Blob(
			[
				// jscs:disable validateQuoteMarks
				file_data.join("\n")
				// jscs:enable
			]
			, {
				type: mime_type
			}
		);

		file_url = window.URL.createObjectURL(file_blob);
		file_link = document.createElement('a');

		file_link.href = file_url;
		file_link.setAttribute('download', filename+'.'+as);

		// Append link because FireFox...
		document.body.appendChild(file_link);
		file_link.click();
		document.body.removeChild(file_link);

		return self;
	};

	global.DatatableJs.lib.Iterator = Iterator;

}(this);
