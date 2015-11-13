
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
	}

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
	}

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
