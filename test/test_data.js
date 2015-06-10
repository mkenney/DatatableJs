
+function(global, undefined) {
	global.mock = {
		column: {
			architecture: {
				type: String
				, nullable: true
				, sort_direction: 'asc'
				, sort_comparator: function() {}
				, sort_transformer: function() {}
			}
		}
		, schema: {
			architecture: {
				  col1: {type: String,  nullable: false, sort_direction: 'asc',  sort_comparator: function(){return 0;}, sort_transformer: function(a){return a;} }
				, col2: {type: Number,  nullable: true,  sort_direction: 'asc',  sort_comparator: function(){return 0;}, sort_transformer: function(a){return a;} }
				, col3: {type: Object,  nullable: false, sort_direction: 'desc', sort_comparator: function(){return 0;}, sort_transformer: function(a){return a;} }
				, col4: {type: Array,   nullable: true,  sort_direction: 'desc', sort_comparator: function(){return 0;}, sort_transformer: function(a){return a;} }
				, col5: {type: Boolean, nullable: false, sort_direction: 'asc',  sort_comparator: function(){return 0;}, sort_transformer: function(a){return a;} }
			}
			, nullable: {
				  nullable_true:  {nullable: true}
				, nullable_false: {nullable: false}
				, nullable_undef: {}
			}

			, type: {
				  string_fnc:     {type: String}
				, string_prm:     {type: '1'}
				, string_cast:    {type: String(1)}
				, string_obj:     {type: new String('1')}

				, number_fnc:     {type: Number}
				, number_prm:     {type: 1}
				, number_cast:    {type: Number('1')}
				, number_obj:     {type: new Number(1)}

				, object_fnc:     {type: Object}
				, object_prm:     {type: {a:1}}
				, object_cast:    {type: Object('1')}
				, object_obj:     {type: new Object('1')}

				, array_fnc:      {type: Array}
				, array_prm:      {type: [1]}
				, array_cast:     {type: Array(1, 2)}
				, array_obj:      {type: new Array()}

				, boolean_fnc:    {type: Boolean}
				, boolean_prm:    {type: true}
				, boolean_cast:   {type: Boolean(1)}
				, boolean_obj:    {type: new Boolean(1)}

				, mixed_prm1:     {}
				, mixed_prm2:     {type: undefined}
				, mixed_prm3:     {type: null}
				// mixed_prim4:   completely undefined
			}
		}

		, data: {
			data_access_api_test: [
				  {id: 0, col1: 1,  col2: 'a'}
				, {id: 1, col1: 2,  col2: 'b'}
				, {id: 2, col1: 3,  col2: 'c'}
				, {id: 3, col1: 5,  col2: 'd'}
				, {id: 4, col1: 8,  col2: 'e'}
//				, {id: 5, col1: 13, col2: 'f'}
//				, {id: 6, col1: 21, col2: 'g'}
//				, {id: 7, col1: 34, col2: 'h'}
//				, {id: 8, col1: 55, col2: 'i'}
//				, {id: 9, col1: 89, col2: 'j'}
			]
			, architecture: [
				  {col1: 'a', col2: 1, col3: {a: '1'}, col4: [1, 2], col5: true }
				, {col1: 'b', col2: 2, col3: {a:  2 }, col4: [2, 3], col5: false}
				, {col1:  1 , col2: 3, col3: {a: 'a'}, col4: [3, 4], col5: true }
			]
			, additional_architecture: [
				  {col1: 'c', col2: 1, col3: {a: '1'}, col4: [1, 2], col5: true } // Valid row
				, {col1: 0,   col2: 1, col3: {a: '1'}, col4: [1, 2], col5: true } // Bad col1 data
				, {col1: 0, col2: 'a', col3: {a: '1'}, col4: [1, 2], col5: true } // Bad col2 data
				, {col2: 1, col3: {a: '1'}, col4: [1, 2], col5: true } // Missing non-nullable col1 column
			]
			, nullable: [
				{
					__row_description__: 'non-null values'
					, nullable_true:  1
					, nullable_false: 1
					, nullable_undef: 1
				}
				, {
					__row_description__: 'null values where valid'
					, nullable_false: 1
				}
				, {
					__row_description__: 'invalid null value'
					, nullable_true:  1
					, nullable_undef: 1
				}
			]
			, type: [
				{
					__row_description__: 'valid fnc values'
					, string_fnc:   String('2')
					, string_prm:   String('2')
					, string_cast:  String('2')
					, string_obj:   String('2')

					, number_fnc:   Number(2)
					, number_prm:   Number(2)
					, number_cast:  Number(2)
					, number_obj:   Number(2)

					, object_fnc:   Object({'b': 'c'})
					, object_prm:   Object({'b': 'c'})
					, object_cast:  Object({'b': 'c'})
					, object_obj:   Object({'b': 'c'})

					, array_fnc:    Array(2, 3)
					, array_prm:    Array(2, 3)
					, array_cast:   Array(2, 3)
					, array_obj:    Array(2, 3)

					, boolean_fnc:  Boolean()
					, boolean_prm:  Boolean()
					, boolean_cast: Boolean()
					, boolean_obj:  Boolean()

					, mixed_prm1:   String('2')
					, mixed_prm2:   Number(2)
					, mixed_prm3:   Array(2, 3)
					, mixed_prm4:   Object({'b': 'c'})
				}

				, {
					__row_description__: 'valid prm values'
					, string_fnc:   '2'
					, string_prm:   '2'
					, string_cast:  '2'
					, string_obj:   '2'

					, number_fnc:   2
					, number_prm:   2
					, number_cast:  2
					, number_obj:   2

					, object_fnc:   {'b': 'c'}
					, object_prm:   {'b': 'c'}
					, object_cast:  {'b': 'c'}
					, object_obj:   {'b': 'c'}

					, array_fnc:    [2]
					, array_prm:    [2]
					, array_cast:   [2]
					, array_obj:    [2]

					, boolean_fnc:  false
					, boolean_prm:  false
					, boolean_cast: false
					, boolean_obj:  false

					, mixed_prm1:   '2'
					, mixed_prm2:   2
					, mixed_prm3:   {'b': 'c'}
					, mixed_prm4:   [2]
				}

				, {
					__row_description__: 'valid cast values'
					, string_fnc:   String(2)
					, string_prm:   String(2)
					, string_cast:  String(2)
					, string_obj:   String(2)

					, number_fnc:   Number('2')
					, number_prm:   Number('2')
					, number_cast:  Number('2')
					, number_obj:   Number('2')

					, object_fnc:   Object({'b': 'c'})
					, object_prm:   Object({'b': 'c'})
					, object_cast:  Object({'b': 'c'})
					, object_obj:   Object({'b': 'c'})

					, array_fnc:    Array(2)
					, array_prm:    Array(2)
					, array_cast:   Array(2)
					, array_obj:    Array(2)

					, boolean_fnc:  Boolean(false)
					, boolean_prm:  Boolean(false)
					, boolean_cast: Boolean(false)
					, boolean_obj:  Boolean(false)

					, mixed_prm1:   String(2)
					, mixed_prm2:   Number('2')
					, mixed_prm3:   Object({'b': 'c'})
					, mixed_prm4:   Array(2)
				}

				, {
					__row_description__: 'valid obj values'
					, string_fnc:   new String(2)
					, string_prm:   new String(2)
					, string_cast:  new String(2)
					, string_obj:   new String(2)

					, number_fnc:   new Number('2')
					, number_prm:   new Number('2')
					, number_cast:  new Number('2')
					, number_obj:   new Number('2')

					, object_fnc:   new Object({'b': 'c'})
					, object_prm:   new Object({'b': 'c'})
					, object_cast:  new Object({'b': 'c'})
					, object_obj:   new Object({'b': 'c'})

					, array_fnc:    new Array(2)
					, array_prm:    new Array(2)
					, array_cast:   new Array(2)
					, array_obj:    new Array(2)

					, boolean_fnc:  new Boolean(false)
					, boolean_prm:  new Boolean(false)
					, boolean_cast: new Boolean(false)
					, boolean_obj:  new Boolean(false)

					, mixed_prm1:   new String(2)
					, mixed_prm2:   new Number('2')
					, mixed_prm3:   new Object({'b': 'c'})
					, mixed_prm4:   new Array(2)
				}
			]
		}
	};
}(this);
