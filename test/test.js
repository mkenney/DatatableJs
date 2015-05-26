+function(global, undefined) {

////////////////////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////////////////////

	module('Initialize');

	test('Source code loaded and available', function() {
		ok('function' === typeof global.DatatableJs,               'DatatableJs exists and is a function');
		ok('function' === typeof global.DatatableJs.lib.Exception, 'DatatableJs.lib.Exception exists and is a function');
		ok('function' === typeof global.DatatableJs.lib.Schema,    'DatatableJs.lib.Schema exists and is a function');
		ok('function' === typeof global.DatatableJs.lib.Column,    'DatatableJs.lib.Column exists and is a function');
		ok('function' === typeof global.DatatableJs.lib.Data,      'DatatableJs.lib.Data exists and is a function');
		ok('function' === typeof global.DatatableJs.lib.Iterator,  'DatatableJs.lib.Iterator exists and is a function');
	});

////////////////////////////////////////////////////////////////////////
// Column API
////////////////////////////////////////////////////////////////////////

	module('Architecture: DatatableJs.lib.Column');

	test('Column object initialization, no definition', function() {
		var column = new global.DatatableJs.lib.Column();
		ok(column instanceof global.DatatableJs.lib.Column, 'Instanceof check passed, no definition');
		ok('object' === typeof column.getDefinition(), 'Column definition store exists and is accessible');

		column = new global.DatatableJs.lib.Column({});
		ok(column instanceof global.DatatableJs.lib.Column, 'Instanceof check passed, empty definition');
		ok('object' === typeof column.getDefinition(), 'Column definition store exists and is accessible');
	});

	test('Column object initialization, complete definition', function() {
		var column = new global.DatatableJs.lib.Column(global.mock.column.architecture);
		ok(column instanceof global.DatatableJs.lib.Column, 'Instanceof check passed');
		ok('object' === typeof column.getDefinition(), 'Column definition store exists');
		ok(String === column.getDefinition().type, '"type" value stored properly');
		ok(true === column.getDefinition().nullable, '"nullable" value stored properly');
		ok('asc' === column.getDefinition().sort_direction, '"sort_direction" value stored properly');
		ok('function' === typeof column.getDefinition().sort_comparator, '"sort_comparator" value stored properly');
		ok('function' === typeof column.getDefinition().sort_transformer, '"sort_transformer" value stored properly');
	});

	test('Column object api', function() {
		var column = new global.DatatableJs.lib.Column();

		ok(
			column.init(global.mock.column.architecture) instanceof global.DatatableJs.lib.Column
			&& global.mock.column.architecture.type === column._column_definition.type
			&& global.mock.column.architecture.nullable === column._column_definition.nullable
			&& global.mock.column.architecture.sort_direction === column._column_definition.sort_direction
			&& global.mock.column.architecture.sort_comparator === column._column_definition.sort_comparator
			&& global.mock.column.architecture.sort_transformer === column._column_definition.sort_transformer
			, 'Column::init(Object \'definition\')'
		);
		ok(
			global.mock.column.architecture.type === column.getDefinition().type
			&& global.mock.column.architecture.nullable === column.getDefinition().nullable
			&& global.mock.column.architecture.sort_direction === column.getDefinition().sort_direction
			&& global.mock.column.architecture.sort_comparator === column.getDefinition().sort_comparator
			&& global.mock.column.architecture.sort_transformer === column.getDefinition().sort_transformer
			, 'Column::getDefinition()'
		);
		ok(
			global.mock.column.architecture.type === column.get('type')
			&& global.mock.column.architecture.nullable === column.get('nullable')
			&& global.mock.column.architecture.sort_direction === column.get('sort_direction')
			&& global.mock.column.architecture.sort_comparator === column.get('sort_comparator')
			&& global.mock.column.architecture.sort_transformer === column.get('sort_transformer')
			, 'Column::get(String \'field name\')'
		);

		var f1 = function(a, b) {return 1;};
		var f2 = function(a) {return a;};
		ok(
			column.set('type', Number) instanceof global.DatatableJs.lib.Column
			&& Number === column.get('type')
			&& column.set('nullable', false) && false === column.get('nullable')
			&& column.set('sort_direction', 'desc') && 'desc' === column.get('sort_direction')
			&& column.set('sort_comparator', f1) && f1 === column.get('sort_comparator')
			&& column.set('sort_transformer', f2) && f2 === column.get('sort_transformer')
			, 'Column::set(String \'field name\', mixed \'value\')'
		);
	});


////////////////////////////////////////////////////////////////////////
// Schema API
////////////////////////////////////////////////////////////////////////

	module('Architecture: DatatableJs.lib.Schema');

	test('Schema object initialization, no columns', function() {
		var schema = new global.DatatableJs.lib.Schema();
		ok(
			schema instanceof global.DatatableJs.lib.Schema
			, 'Instanceof check passed, no columns'
		);
		ok(
			'object' === typeof schema.getColumns()
			, 'Schema column store exists and is accessible'
		);

		schema = new global.DatatableJs.lib.Schema({});
		ok(
			schema instanceof global.DatatableJs.lib.Schema
			, 'Instanceof check passed, empty columns'
		);
		ok(
			'object' === typeof schema.getColumns()
			, 'Schema column store exists and is accessible'
		);
	});

	test('Schema object initialization, complete column set', function() {
		var schema = new global.DatatableJs.lib.Schema(global.mock.schema.architecture);
		ok(
			schema instanceof global.DatatableJs.lib.Schema
			, 'Instanceof check passed'
		);
		ok(
			'object' === typeof schema.getColumns()
			, 'Schema definition store exists'
		);
		ok(
			String === schema.getColumns().col1.get('type')
			, '"type" value stored properly'
		);
		ok(
			false === schema.getColumns().col1.get('nullable')
			, '"nullable" value stored properly'
		);
		ok(
			'asc' === schema.getColumns().col1.get('sort_direction')
			, '"sort_direction" value stored properly'
		);
		ok(
			'function' === typeof schema.getColumns().col1.get('sort_comparator')
			, '"sort_comparator" value stored properly'
		);
		ok(
			'function' === typeof schema.getColumns().col1.get('sort_transformer')
			, '"sort_transformer" value stored properly'
		);
	});

	test('Schema object api', function() {
		var schema = new global.DatatableJs.lib.Schema();

		ok(
			schema.init(global.mock.schema.architecture) instanceof global.DatatableJs.lib.Schema
			&& schema._columns['col1'] instanceof global.DatatableJs.lib.Column
			&& schema._columns.col1.get('type') === global.mock.schema.architecture.col1.type
			&& schema._columns.col1.get('nullable') === global.mock.schema.architecture.col1.nullable
			&& schema._columns.col1.get('sort_direction') === global.mock.schema.architecture.col1.sort_direction
			&& schema._columns.col1.get('sort_comparator') === global.mock.schema.architecture.col1.sort_comparator
			&& schema._columns.col1.get('sort_transformer') === global.mock.schema.architecture.col1.sort_transformer
			, 'Schema::init(Object {column definitions})'
		);

		ok(
			schema.getColumns().col1 instanceof global.DatatableJs.lib.Column
			&& schema.getColumns().col1.get('type') === global.mock.schema.architecture.col1.type
			&& schema.getColumns().col1.get('nullable') === global.mock.schema.architecture.col1.nullable
			&& schema.getColumns().col1.get('sort_direction') === global.mock.schema.architecture.col1.sort_direction
			&& schema.getColumns().col1.get('sort_comparator') === global.mock.schema.architecture.col1.sort_comparator
			&& schema.getColumns().col1.get('sort_transformer') === global.mock.schema.architecture.col1.sort_transformer
			, 'Schema::getColumns()'
		);

		var schema = new global.DatatableJs.lib.Schema();
		ok(
			schema.setColumns(global.mock.schema.architecture)
			&& schema.getColumns().col1 instanceof global.DatatableJs.lib.Column
			&& schema.getColumns().col1.get('type') === global.mock.schema.architecture.col1.type
			&& schema.getColumns().col1.get('nullable') === global.mock.schema.architecture.col1.nullable
			&& schema.getColumns().col1.get('sort_direction') === global.mock.schema.architecture.col1.sort_direction
			&& schema.getColumns().col1.get('sort_comparator') === global.mock.schema.architecture.col1.sort_comparator
			&& schema.getColumns().col1.get('sort_transformer') === global.mock.schema.architecture.col1.sort_transformer
			, 'Schema::setColumns(Object {column definitions})'
		);

		ok(
			schema.getColumn('col1') instanceof global.DatatableJs.lib.Column
			&& schema.getColumn('col1').get('type') === global.mock.schema.architecture.col1.type
			&& schema.getColumn('col1').get('nullable') === global.mock.schema.architecture.col1.nullable
			&& schema.getColumn('col1').get('sort_direction') === global.mock.schema.architecture.col1.sort_direction
			&& schema.getColumn('col1').get('sort_comparator') === global.mock.schema.architecture.col1.sort_comparator
			&& schema.getColumn('col1').get('sort_transformer') === global.mock.schema.architecture.col1.sort_transformer
			, 'Schema::getColumn(String \'column name\')'
		);

		ok(
			schema.deleteColumn('col1') instanceof global.DatatableJs.lib.Schema
			&& 'undefined' === typeof schema.getColumn('col1')
			, 'Schema::deleteColumn(String \'column name\')'
		);

		ok(
			schema.setColumn('col1', global.mock.schema.architecture.col1) instanceof global.DatatableJs.lib.Schema
			&& schema.getColumn('col1').get('type') === global.mock.schema.architecture.col1.type
			&& schema.getColumn('col1').get('nullable') === global.mock.schema.architecture.col1.nullable
			&& schema.getColumn('col1').get('sort_direction') === global.mock.schema.architecture.col1.sort_direction
			&& schema.getColumn('col1').get('sort_comparator') === global.mock.schema.architecture.col1.sort_comparator
			&& schema.getColumn('col1').get('sort_transformer') === global.mock.schema.architecture.col1.sort_transformer
			, 'Schema::setColumn(String \'column name\', Object {column definition})'
		);

		ok(
			schema.isValidRow(global.mock.data.architecture[0])
			, 'Schema::isValidRow(Object {data row})'
		)

		ok(
			!schema.isValidRow(global.mock.data.architecture[2])
			, 'Schema::isValidRow(Object {data row}) // Invalid Row'
		);
		console.log('Previous test should output a console.error()');

		ok(
			schema.isValidData('col1', 'a')
			&& schema.isValidData('col2', 1)
			&& schema.isValidData('col3', {a: 'a'})
			&& schema.isValidData('col4', [1, 2])
			&& schema.isValidData('col5', true)
			, 'Schema::isValidData(String \'column name\', mixed data) // Valid Rows'
		)

		ok(
			   !schema.isValidData('col1', 1)
			&& !schema.isValidData('col2', 'a')
			&& schema.isValidData('col3', [1, 2]) // Array IS an instance of Object
			&& !schema.isValidData('col3', 1)
			&& !schema.isValidData('col4', {a: 'a'})
			&& !schema.isValidData('col5', 'true')
			, 'Schema::isValidData(String \'column name\', mixed data) // Invalid Rows'
		)
	});

////////////////////////////////////////////////////////////////////////
// Data API
////////////////////////////////////////////////////////////////////////

	module('Architecture: DatatableJs.lib.Data');

	test('Data object initialization, no data', function() {
		var data = new global.DatatableJs.lib.Data();
		ok(data instanceof global.DatatableJs.lib.Data, 'Instanceof check');
		ok(data._rows instanceof Array, 'Data storage exists');
		notStrictEqual(undefined, data.length, '"length" property exists');
		strictEqual(0, data.length, '"length" property is equal to 0');
	});

	test('Data object initialization, with data', function() {
		throws(
			function() {new global.DatatableJs.lib.Data('string');}
			, global.DatatableJs.lib.Exception
			, 'Constructor requires an array'
		);

		var data = new global.DatatableJs.lib.Data(global.mock.data.architecture);
		ok(
			data instanceof global.DatatableJs.lib.Data
			, 'Instanceof check passed'
		);
		ok(
			data._rows instanceof Array
			, 'Data storage exists'
		);
		notStrictEqual(
			undefined
			, data.length
			, '"length" property exists'
		);
		strictEqual(
			3
			, data.length
			, '"length" property is equal to the number of data rows'
		);
	});

	test('Data object api', function() {
		var data = new global.DatatableJs.lib.Data();
		ok(
			data.init(global.mock.data.architecture) instanceof global.DatatableJs.lib.Data
			&& 3 === data._rows.length
			, 'Data::init(Array \'rows\')'
		);
		ok(
			data.getRows() instanceof Array
			, 'Data::getRows()'
		);
		ok(
			data.setRows(global.mock.data.architecture) instanceof global.DatatableJs.lib.Data
			&& 3 === data._rows.length
			, 'Data::setRows(Array \'rows\')'
		);
		ok(
			data.addRow(global.mock.data.architecture[0]) instanceof global.DatatableJs.lib.Data
			&& 4 === data._rows.length
			, 'Data::addRow(Object \'row\')'
		);

		ok(
			data.getSchema() instanceof global.DatatableJs.lib.Schema
			, 'Data::getSchema()'
		);

		var schema = new global.DatatableJs.lib.Schema();
		ok(
			data.setSchema(schema) instanceof global.DatatableJs.lib.Data
			, 'Data::setSchema(Schema \'schema\')'
		);

		data.setRows(global.mock.data.architecture);
		global.mock.data.architecture[0].__pos__ = 100;
		ok(
			data.indexRows() instanceof global.DatatableJs.lib.Data
			&& 0 === data.getRows()[0].__pos__
			, 'Data::indexRows()'
		);
		data.sort('col1');
		ok(
			'a' === data.getRows()[0].col1
			&& 'b' === data.getRows()[1].col1 // Row 3 gets left in place because
			                                  // comparing it to a string is always
			                                  // false
			, 'Data::sort(String \'column\') // Default "asc" direction'
		);

		data.sort('col1');
		ok(
			1 === data.getRows()[0].col1
			&& 'b' === data.getRows()[1].col1 // Toggling simpling calls array.reverse()
			, 'Data::sort(String \'column\') // Toggle direction'
		);

		data.sort('col1', 'desc');
		ok(
			'b' === data.getRows()[0].col1
			&& 'a' === data.getRows()[1].col1
			, 'Data::sort(String \'column\', "desc") // Specify direction'
		);

		data.sort('col1', 'desc', function(a, b) { // This is the reverse of the
			if (a == b) {return 0;}                // normal sorting behavior, so
			if (a > b) {return -1;}                // 'desc' behaves like 'asc'
			if (a < b) {return 1;}
		});
		ok(
			1 === data.getRows()[0].col1
			&& 'a' === data.getRows()[1].col1
			, 'Data::sort(String \'column\', String \'direction\' "desc", Function \'comparator\') // Custom comparison function'
		);

		data.sort(
			'col1'
			, 'desc'
			, function(a, b) {          // This is the reverse of the normal
				if (a == b) {return 0;} // sorting behavior, so 'desc' behaves
				if (a > b) {return -1;} // like 'asc'
				if (a < b) {return 1;}
			}
			, function(a) {                // Transform the values to reverse the
				if ('1' === a) {return 2;} // sort order again, correcting the
				if ('3' === a) {return 1;} // behavior
				return 0;
			}
		);
		ok(
			'b' === data.getRows()[0].col1
			&& 'a' === data.getRows()[1].col1
			, 'Data::sort(String \'column\', String \'direction\' "desc", Function \'comparator\', Function \'transformer\') // Custom comparison function and custom pre-comparison data transformation'
		);

		ok(
			data.truncate()
			&& 0 === data.getRows().length
			&& undefined === data._current_sort_column
			&& undefined === data._current_sort_direction
			, 'Data::truncate()'
		);
	});

////////////////////////////////////////////////////////////////////////
// DatatableJs API
////////////////////////////////////////////////////////////////////////

	module('Architecture: DatatableJs');

	test('DatatableJs object initialization, no options', function() {
		var datatable = new global.DatatableJs();
		ok(
			datatable instanceof global.DatatableJs
			, 'Instanceof check passed'
		);
		ok(
			datatable.getData() instanceof global.DatatableJs.lib.Data
			, 'Data store exists and is accessible'
		);
		ok(
			datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			, 'Schema store exists and is accessible'
		);
	});

	test('DatatableJs object initialization, data only', function() {
		var datatable = new global.DatatableJs({
			data: global.mock.data.architecture
		});
		ok(
			datatable instanceof global.DatatableJs
			, 'Instanceof check passed'
		);
		ok(
			datatable.getData() instanceof global.DatatableJs.lib.Data
			, 'Data store exists and is accessible'
		);
		ok(
			datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			, 'Schema store exists and is accessible'
		);
	});

	test('DatatableJs object initialization, schema only', function() {
		var datatable = new global.DatatableJs({
			schema: global.mock.schema.architecture
		});
		ok(
			datatable instanceof global.DatatableJs
			, 'Instanceof check passed'
		);
		ok(
			datatable.getData() instanceof global.DatatableJs.lib.Data
			, 'Data store exists and is accessible'
		);
		ok(
			datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			, 'Schema store exists and is accessible'
		);
	});

	test('DatatableJs object initialization, both schema and data', function() {
		var datatable = new global.DatatableJs({
			schema: global.mock.schema.architecture
			, data: global.mock.data.architecture
		});
		console.log('Previous object initialization should output a console.error() and a console.info()');

		ok(
			datatable instanceof global.DatatableJs
			, 'Instanceof check passed'
		);
		ok(
			datatable.getData() instanceof global.DatatableJs.lib.Data
			, 'Data store exists and is accessible'
		);
		ok(
			datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			, 'Schema store exists and is accessible'
		);
	});

	test('DatatableJs object API', function() {

		var datatable = new global.DatatableJs();
		ok(
			datatable.init({data: global.mock.data.architecture}) instanceof global.DatatableJs
			&& datatable.getData() instanceof global.DatatableJs.lib.Data
			&& datatable.getData().getRows().length === global.mock.data.architecture.length
			&& datatable.getData().getRows()[0].col1 === global.mock.data.architecture[0].col1
			, 'DatatableJs::init(Object {data: Array})'
		);

		var datatable = new global.DatatableJs();
		ok(
			datatable.init({schema: global.mock.schema.architecture}) instanceof global.DatatableJs
			&& datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			&& String === datatable.getSchema().getColumns().col1.get('type')
			&& true === datatable.getSchema().getColumns().col2.get('nullable')
			&& 'desc' === datatable.getSchema().getColumns().col3.get('sort_direction')
			&& 'function' === typeof datatable.getSchema().getColumns().col4.get('sort_comparator')
			&& 'function' === typeof datatable.getSchema().getColumns().col5.get('sort_transformer')
			, 'DatatableJs::init(Object {schema: Object})'
		);

		var datatable = new global.DatatableJs();
		ok(
			datatable.init({schema: global.mock.schema.architecture, data: global.mock.data.architecture}) instanceof global.DatatableJs
			&& datatable.getData() instanceof global.DatatableJs.lib.Data
			&& datatable.getData().getRows().length === (global.mock.data.architecture.length - 1) // Using schema, 1 row should be rejected
			&& datatable.getData().getRows()[0].col1 === global.mock.data.architecture[0].col1
			&& datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			&& String === datatable.getSchema().getColumns().col1.get('type')
			&& true === datatable.getSchema().getColumns().col2.get('nullable')
			&& 'desc' === datatable.getSchema().getColumns().col3.get('sort_direction')
			&& 'function' === typeof datatable.getSchema().getColumns().col4.get('sort_comparator')
			&& 'function' === typeof datatable.getSchema().getColumns().col5.get('sort_transformer')
			, 'DatatableJs::init(Object {schema: Object, data: Array})'
		);
		console.log('Previous object initialization should output a console.error() and a console.info()');

		// Use this instance for remaining tests?
		var datatable = new global.DatatableJs({
			schema: global.mock.schema.architecture
			, data: global.mock.data.architecture
		});
		console.log('Previous object initialization should output a console.error() and a console.info()');

		ok(
			datatable.addRow(global.mock.data.additional_rows[0])
			&& 3 === datatable.getData().getRows().length
			, 'DatatableJs::addRow(Object {data row}) // Valid data'
		);

		ok(
			datatable.addRow(global.mock.data.additional_rows[1])
			&& 3 === datatable.getData().getRows().length
			, 'DatatableJs::addRow(Object {data row}) // Incorrect col1 data type'
		);
		console.log('Previous test should output a console.error()');

		ok(
			datatable.addRow(global.mock.data.additional_rows[2])
			&& 3 === datatable.getData().getRows().length
			, 'DatatableJs::addRow(Object {data row}) // Incorrect col2 data type'
		);
		console.log('Previous test should output a console.error()');

		ok(
			datatable.addRow(global.mock.data.additional_rows[3])
			&& 3 === datatable.getData().getRows().length
			, 'DatatableJs::addRow(Object {data row}) // Missing non-nullable col1 data'
		);
		console.log('Previous test should output a console.error()');

		ok(
			datatable.getRows() === datatable.getData().getRows()
			&& datatable.getRows() instanceof Array
			&& 3 === datatable.getRows().length
			, 'DatatableJs::getRows()'
		);

		ok(
			datatable.setRows(global.mock.data.architecture) instanceof global.DatatableJs
			&& 2 === datatable.getRows().length
			, 'DatatableJs::setRows(Array [data row objects])'
		);
		console.log('Previous test should output a console.error() and a console.info()');

		ok(
			datatable.getSchema() instanceof global.DatatableJs.lib.Schema
			, 'DatatableJs::getSchema()'
		);

		ok(
			datatable.setSchema(new global.DatatableJs.lib.Schema()) instanceof global.DatatableJs
			, 'DatatableJs::setSchema(Schema schema)'
		);

		/////////////////////////////////////////
		// Execute Iterator related tests last //
		/////////////////////////////////////////

		var datatable = new global.DatatableJs({
			schema: global.mock.schema.architecture
			, data: global.mock.data.architecture
		});

		ok(
			datatable.createIterator() instanceof global.DatatableJs.lib.Iterator
			, 'DatatableJs::createIterator()'
		);

		ok(
			datatable.getRow({col1: 'b'}) === datatable.getData().getRows()[1]
			&& datatable.getRow({col1: 'b'}) instanceof Object
			&& !(datatable.getRow({col1: 'b'}) instanceof Array)
			, 'DatatableJs::getRow(Object {filter}) // Matching 1 row'
		);

		ok(
			datatable.addRow(global.mock.data.additional_rows[0])
			&& datatable.getRow({col1: 'a'}) === datatable.getData().getRows()[0]
			&& datatable.getRow({col1: 'a'}) instanceof Object
			&& !(datatable.getRow({col1: 'a'}) instanceof Array)
			, 'DatatableJs::getRow(Object {filter}) // Matching multiple rows, only the first one is returned'
		);

		ok(
			undefined === datatable.getRow({col1: 'c'})
			, 'DatatableJs::getRow(Object {filter}) // Matching 0 rows'
		);


		var iterator = datatable.createIterator();
		iterator.addFilterRule({
			fields: 'col1'
			, comparators: '=='
			, values: 'a'
		});
		ok(
			(datatable.removeRows(iterator) instanceof DatatableJs)
			&& 1 === datatable.getRows().length
			, 'DatatableJs::removeRows(Iterator iterator)'
		);

	});

////////////////////////////////////////////////////////////////////////
// Iterator API
////////////////////////////////////////////////////////////////////////

	module('Architecture: DatatableJs.lib.Iterator');

	test('Iterator object initialization', function() {
		throws(
			function() {var iterator = new global.DatatableJs.lib.Iterator();}
			, global.DatatableJs.lib.Exception
			, 'Iterator constructor requires an argument'
		);

		var iterator = new global.DatatableJs.lib.Iterator(new global.DatatableJs());
		ok(
			iterator instanceof global.DatatableJs.lib.Iterator
			, 'Instanceof check passed'
		);
	});

}(this);
