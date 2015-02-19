
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
	 * @param  {DatatableJs.lib.Schema} schema Optional
	 * @param  {DatatableJs.lib.Data}   data   Optional
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.init = function(args) {
		if (undefined !== args.schema) {this.setSchema(args.schema);}
		if (undefined !== args.data)   {this.setData(args.data);}
		return this;
	};

	/**
	 * Get the current data object
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Data}
	 */
	DatatableJs.prototype.getData = function() {
		if (!this._data instanceof this.lib.Data) {this._data = new this.lib.Data();}
		return this._data;
	};

	/**
	 * Store a data object or import a set of data rows
	 *
	 * @param  {DatatableJs.lib.Data|Array} data
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.setData = function(data) {
		if (undefined !== data) {
			var data_obj = new this.lib.Data();

			if (data instanceof this.lib.Data) {
				data_obj = data;
				data = data_obj.getData();

			} else if (!data instanceof Array) {
				throw new DatatableJs.lib.Exception('The data definition must be an instance of DatatableJs.lib.Data or an array of data rows');
			}

			data_obj.setSchema(this.getSchema());
			data_obj.setData(data);
			this._data = data_obj;
		}
		return this;
	};

	/**
	 * Get the current schema object
	 *
	 * If an instance doesn't exist or is invalid one will be created
	 *
	 * @return {DatatableJs.lib.Schema}
	 */
	DatatableJs.prototype.getSchema = function() {
		if (false === (this._schema instanceof this.lib.Schema)) {
			this._schema = new this.lib.Schema();
		}
		return this._schema;
	};

	/**
	 * Store a schema object
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
			if (this._data instanceof DatatableJs.lib.Data) {
				this._data.setSchema(schema);
			}
		}
		return this;
	};

	/**
	 * Generate a filter instance linked to the current schema and data references
	 *
	 * @param {[type]} schema [description]
	 */
	DatatableJs.prototype.createFilter = function() {
		return new this.lib.Filter(this._data, this._schema);
	};

	global.DatatableJs = DatatableJs;

}(this);
