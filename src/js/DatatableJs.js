
+function(global, undefined) {
	'use strict';

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

	// This library uses console messages to provide non-fatal error feedback, make
	// sure those methods exist in all environments.
	DatatableJs.console = global.console;
	if (!DatatableJs.console)                {DatatableJs.console = {};}
	if (!DatatableJs.console.assert)         {DatatableJs.console.assert         = function() {};}
	if (!DatatableJs.console.count)          {DatatableJs.console.count          = function() {};}
	if (!DatatableJs.console.dir)            {DatatableJs.console.dir            = function() {};}
	if (!DatatableJs.console.error)          {DatatableJs.console.error          = function() {};}
	if (!DatatableJs.console.group)          {DatatableJs.console.group          = function() {};}
	if (!DatatableJs.console.groupCollapsed) {DatatableJs.console.groupCollapsed = function() {};}
	if (!DatatableJs.console.groupEnd)       {DatatableJs.console.groupEnd       = function() {};}
	if (!DatatableJs.console.info)           {DatatableJs.console.info           = function() {};}
	if (!DatatableJs.console.log)            {DatatableJs.console.log            = function() {};}
	if (!DatatableJs.console.time)           {DatatableJs.console.time           = function() {};}
	if (!DatatableJs.console.timeEnd)        {DatatableJs.console.timeEnd        = function() {};}
	if (!DatatableJs.console.trace)          {DatatableJs.console.trace          = function() {};}
	if (!DatatableJs.console.warn)           {DatatableJs.console.warn           = function() {};}


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
		if (args) {
			if (undefined !== args.schema) {this.setSchema(args.schema);}
			if (undefined !== args.data)   {this.setData(args.data);}
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
		var data_copy = JSON.parse(JSON.stringify(this.getRows()));
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

}(this);
