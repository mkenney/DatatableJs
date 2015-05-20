
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
		, Iterator:    undefined
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
	 * Delete a set of rows defined by an iterator
	 *
	 * @param  {DatatableJs.lib.Iterator} iterator
	 * @return {DatatableJs}
	 */
	DatatableJs.prototype.removeRows = function(iterator) {
		if (!(iterator instanceof DatatableJs.lib.Iterator)) {throw new DatatableJs.lib.Exception('Deleteing rows requires a valid DatatableJs.lib.Iterator instance');}
		iterator.execute();
		while (iterator.next()) {
			iterator.remove();
		}
	}

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

	global.DatatableJs = DatatableJs;

}(this);
