
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
		if (!column_name)                    {throw new global.DatatableJs.lib.Exception('Invalid column name: "'+column_name+'"');}
		if ('string' !== typeof column_name) {throw new global.DatatableJs.lib.Exception('The column name must be a string')}
		if (!(column_definition instanceof global.DatatableJs.lib.Column)) {
			column_definition = new global.DatatableJs.lib.Column(column_definition);
		}

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
				global.DatatableJs.console.error('DatatableJs.lib.Schema: "'+column+'" value is invalid', row[column], columns[column].getDefinition());
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
	}

	global.DatatableJs.lib.Schema = Schema;

}(this);
