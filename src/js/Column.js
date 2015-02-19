/*jshint evil: true */
/*jshint unused: true*/

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
