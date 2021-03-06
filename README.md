# [DatatableJs](https://github.com/mkenney/DatatableJs)

DatatableJs is a library for manipulating and filtering tabular data.  I use this
a lot in various UIs and have found many convenient ways to use this to manipulate
interface elements as well as tabular data.

This implements a stable sort hack to allow for multi-column sort operations using
the native sorting algorithm, I did not implement a sort in the code.  Instead, I
create a position flag on the row objects.  As a result, `__pos__` is a "reserved"
column name and any data stored there will be overwritten.

## Table of contents

- [Quick start](#quick-start)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Documentation](#documentation)
- [Examples](#examples)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Creator](#creator)
- [Copyright and license](#copyright-and-license)

## Quick start

- Clone the repo: `git clone https://github.com/mkenney/DatatableJs.git`.

### What's included

Within the repository you'll find a directory and file structure similar to this:
```
DatatableJs/
    │
    ├── src/
    │   └──js/
    │       ├── Column.js
    │       ├── Data.js
    │       ├── DatatableJs.js
    │       ├── Exception.js
    │       ├── Iterator.js
    │       └── Schema.js
    │
    └── assets/
        └──js/
            ├── DatatableJs.js
            ├── DatatableJs.map
            └── DatatableJs.min.js
```

The compiled file (`DatatableJs.js`) and [source map](https://developers.google.com/chrome-developer-tools/docs/css-preprocessors)
(`DatatableJs.map`) are located in the assets/ directory and are available for use
with certain browsers' developer tools.

## Bugs and feature requests

If you find a bug or have a feature request [please open a new issue](#contributing).


## Documentation

DatatableJs creates a new global object `DatatableJs`, all support objects are
located in the `DatatableJs.lib` namespace:

```javascript
var schema = new DatatableJs.lib.Schema();
```

### DatatableJs API:

```javascript
/**
 * Get the current DatatableJs.lib.Data instance
 *
 * If an instance doesn't exist or is invalid one will be created
 *
 * @return {DatatableJs.lib.Data}
 */
DatatableJs.prototype.getData

/**
 * Set the current DatatableJs.lib.Data instance
 *
 * @param  {DatatableJs.lib.Data} data
 * @return {DatatableJs}
 */
DatatableJs.prototype.setData

/**
 * Get the current set of data rows
 *
 * @return {Array}
 */
DatatableJs.prototype.getRows

/**
 * Replace the current data set with an array of data rows
 *
 * @param  {Array} rows
 * @return {DatatableJs}
 */
DatatableJs.prototype.setRows

/**
 * Get the current DatatableJs.lib.Schema instance
 *
 * If an instance doesn't exist or is invalid one will be created
 *
 * @return {DatatableJs.lib.Schema}
 */
DatatableJs.prototype.getSchema

/**
 * Set the current DatatableJs.lib.Schema instance
 *
 * @param  {DatatableJs.lib.Schema} schema
 * @return {DatatableJs}
 */
DatatableJs.prototype.setSchema

/**
 * Generate an iterator instance linked to the current schema and data references
 *
 * @return {DatatableJs.lib.Iterator}
 */
DatatableJs.prototype.createIterator
```

### DatatableJs.lib.Schema API:

```javascript
/**
 * Get current column definitions
 *
 * @return {Object}
 */
Schema.prototype.getColumns

/**
 * Set or extend current column definitions
 *
 * This does not replace the current column definitions, it only extends and
 * updates
 *
 * @param  {Array} columns An array of column definition objects
 * @return {DatatableJs.lib.Schema}
 */
Schema.prototype.setColumns

/**
 * Get a column definition by name
 *
 * @param  {String} column_name
 * @return {Object|undefined} The schema definition for the specified column, else undefined
 */
Schema.prototype.getColumn

/**
 * Delete a column definition by name
 *
 * @param  {String} column_name
 * @return {DatatableJs.lib.Schema}
 */
Schema.prototype.deleteColumn

/**
 * Update or add a named column definition
 *
 * @param {String} column_name
 * @param {Object} column_definition
 * @return {DatatableJs.lib.Schema}
 */
Schema.prototype.setColumn

/**
 * Test a row of data to see if it meets requirements for this schema definition
 *
 * @param  {Object}  row A single data row
 * @return {Boolean}
 */
Schema.prototype.isValidRow

/**
 * Test an individual piece of data to see if meets requirements for a specified
 * column
 *
 * @param  {String}  column
 * @param  {mixed}   value
 * @return {Boolean}
 */
Schema.prototype.isValidData
```

### DatatableJs.lib.Column API:

```javascript
/**
 * Get a column property
 *
 * @param  {String} field
 * @return {mixed}
 */
Column.prototype.get

/**
 * Set a column property
 *
 * @param  {String} field
 * @param  {mixed}  value
 * @return {DatatableJs.lib.Column}
 */
Column.prototype.set

/**
 * Get the full definition object for this column
 *
 * @return {Object}
 */
Column.prototype.getDefinition

/**
 * Extend the current column definition
 *
 * @param  {Object} column_definition
 * @return {DatatableJs.lib.Column}
 */
Column.prototype.setDefinition
```

### DatatableJs.lib.Data API:

```javascript
/**
 * Get the current set of data rows
 *
 * @return  {Array}
 */
Data.prototype.getRows

/**
 * Replace the current data set with an array of data rows
 *
 * @param  {Array} rows
 * @return {DatatableJs.lib.Data}
 */
Data.prototype.setRows

/**
 * Add a row to the current dataset
 *
 * If a schema is available, validate the row data.  Add support properties for
 * the stable sort implementation.
 *
 * @param  {Object} row
 * @return {DatatableJs.lib.Data}
 */
Data.prototype.addRow

/**
 * Get the current DatatableJs.lib.Schema instance
 *
 * If an instance doesn't exist or is invalid one will be created
 *
 * @return {DatatableJs.lib.Schema}
 */
Data.prototype.getSchema

/**
 * Set the current DatatableJs.lib.Schema instance
 *
 * @param  {DatatableJs.lib.Schema} schema
 * @return {DatatableJs.lib.Data}
 */
Data.prototype.setSchema

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
Data.prototype.sort

/**
 * Empty the data set by setting the data rows to an empty array and unsetting sort flags
 *
 * @return {DatatableJs.lib.Data}
 */
Data.prototype.truncate
```

### DatatableJs.lib.Iterator API:

```javascript
/**
 * Get the current DatatableJs.lib.Data instance
 *
 * If an instance doesn't exist or is invalid one will be created
 *
 * @return {DatatableJs.lib.Data}
 */
Iterator.prototype.getData

/**
 * Set the current DatatableJs.lib.Data reference
 *
 * @param  {DatatableJs.lib.Data}   data
 * @return {DatatableJs.lib.Iterator}
 */
Iterator.prototype.setData

/**
 * Get the current set of data rows
 *
 * @return {Array}
 */
Iterator.prototype.getRows

/**
 * Replace the current data set with an array of data rows
 *
 * @param  {Array} rows
 * @return {DatatableJs.lib.Iterator}
 */
Iterator.prototype.setRows

/**
 * Get the current DatatableJs.lib.Schema instance
 *
 * If an instance doesn't exist or is invalid one will be created
 *
 * @return {DatatableJs.lib.Schema}
 */
Iterator.prototype.getSchema

/**
 * Set the current DatatableJs.lib.Schema instance
 *
 * @param  {DatatableJs.lib.Schema} schema
 * @return {DatatableJs.lib.Iterator}
 */
Iterator.prototype.setSchema
```

## Examples

The following examples will reference this schema and data set:

```javascript
// The schema defines requirements and default options for a data property.  When
// a schema us used, the datatable will reject any object that has a property that
// doesn't conform to the requirements it defines.
//
// A schema can be applied at any time, even after data has been imported.
// Non-conforming rows will be removed from the data set when it is applied
var sample_schema = {

    // The key identifies a property expected in the data set
    id: {

        // Optional
        //
        // Strings or function references for native types:
        //     'Number' or Number to require numbers for example.  Does smart
        //     type checking so in this case 1 or Number(1) or new Number(1) would
        //     qualify but NaN would not
        //
        // Functions or even instances for custom objects
        //     DatatableJs for example
        type: Number

        // Optional, Boolean, default true.
        //
        // If true or omitted allow null, undefined and omitted values. If false,
        // reject rows containing null, undefined or omitted values for this
        // property.
        , nullable: false

        // Optional, default custom comparator function to use when sorting this
        // column.  This value is not used if a comparitor function is defined
        // when calling addSortRule() on an iterator instance.
        , sort_comparator: undefined

        // Optional, default data transformer function to use when before sorting
        // the data in this column.  This value is not used if a transformer
        // function is defined when calling addSortRule() on an iterator instance.
        , sort_transformer: undefined

        // Optional, default sort direction for this column.  This value is not
        // used if a sort_direction defined when calling addSortRule() on an
        // iterator instance.
        , sort_direction:   'desc'
    }
    , col1: {
        sort_direction: 'asc'
    }
    , col2: {
        nullable: true
        , sort_direction: 'asc'
    }
}


// Data can be any array of objects
var sample_data = [
    { id: undefined,  col1: 0,   col2: 0 },
    { id: null,       col1: 1,   col2: 1 },
    { id: '3',        col1: 2,   col2: 0 },
    { id: 4,          col1: 0,   col2: undefined },
    { id: 5,          col1: 1,   col2: null },
    { id: 6,          col1: 2,   col2: 1 },
    { id: 7,          col1: '0', col2: 0 },
    { id: 8,          col1: '1', col2: 1 },
    { id: 9,          col1: '2', col2: 0 },

    { id: 11,         col1: 0,   col2: 0 },
    { id: 12,         col1: 1,   col2: 1 },
    { id: 13,         col1: 2,   col2: 0 },
    { id: 14,         col1: 0,   col2: 1 },
    { id: 15,         col1: 1,   col2: 0 },
    { id: 16,         col1: 2,   col2: 1 },
    { id: 17,         col1: 0,   col2: 0 },
    { id: 18,         col1: 1,   col2: 1 },
    { id: 19,         col1: 2,   col2: 0 },

    { id: 21,         col1: 0,   col2: 0 },
    { id: 22,         col1: 1,   col2: 1 },
    { id: 23,         col1: 2,   col2: 0 },
    { id: 24,         col1: 0,   col2: 1 },
    { id: 25,         col1: 1,   col2: 0 },
    { id: 26,         col1: 2,   col2: 1 },
    { id: 27,         col1: 0,   col2: 0 },
    { id: 28,         col1: 1,   col2: 1 },
    { id: 29,         col1: 2,   col2: 0 }
];
```

### Example 1

Loop through the data

```javascript
var datatable = new DatatableJs({data: sample_data});
var iterator = datatable.createIterator();
var row;
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT:
// undefined 0 0
// null 1 1
// 3 2 0
// 4 0 undefined
// 5 1 null
// 6 2 1
// 7 "0" 0
// 8 "1" 1
// 9 "2" 0
// 11 0 0
// 12 1 1
// 13 2 0
// 14 0 1
// 15 1 0
// 16 2 1
// 17 0 0
// 18 1 1
// 19 2 0
// 21 0 0
// 22 1 1
// 23 2 0
// 24 0 1
// 25 1 0
// 26 2 1
// 27 0 0
// 28 1 1
// 29 2 0
```

### Example 2

Apply a data schema

```javascript
var datatable = new DatatableJs({
    schema: sample_schema,
    data: sample_data
});
var iterator = datatable.createIterator();
var row;
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT:
// DatatableJs - Could not import row: "id" value is invalid undefined Object {type: function, nullable: false, sort_comparator: undefined, sort_transformer: undefined, sort_direction: "desc"}
// DatatableJs - Could not import row: "id" value is invalid null Object {type: function, nullable: false, sort_comparator: undefined, sort_transformer: undefined, sort_direction: "desc"}
// DatatableJs - Could not import row: "id" value is invalid 3 Object {type: function, nullable: false, sort_comparator: undefined, sort_transformer: undefined, sort_direction: "desc"}
// DatatableJs - 3 of 27 data rows were invalid
// 4 0 undefined
// 5 1 null
// 6 2 1
// 7 "0" 0
// 8 "1" 1
// 9 "2" 0
// 11 0 0
// 12 1 1
// 13 2 0
// 14 0 1
// 15 1 0
// 16 2 1
// 17 0 0
// 18 1 1
// 19 2 0
// 21 0 0
// 22 1 1
// 23 2 0
// 24 0 1
// 25 1 0
// 26 2 1
// 27 0 0
// 28 1 1
// 29 2 0
```

### Example 3

Filter the data

```javascript
var datatable = new DatatableJs({data: sample_data});
var iterator = datatable.createIterator();
iterator.addFilterRule({
    fields: 'id',
    comparators: '>',
    values: 10
});
var row;
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT:
// 11 0 0
// 12 1 1
// 13 2 0
// 14 0 1
// 15 1 0
// 16 2 1
// 17 0 0
// 18 1 1
// 19 2 0
// 21 0 0
// 22 1 1
// 23 2 0
// 24 0 1
// 25 1 0
// 26 2 1
// 27 0 0
// 28 1 1
// 29 2 0
```

### Example 4

Sort the data

```javascript
var datatable = new DatatableJs({data: sample_data});
var iterator = datatable.createIterator();
iterator.addSortRule({
    column: 'col1',
    direction: 'desc',
    comparator: function(a, b) {
        if (a == b) {return 0;}
        if (a > b) {return 1;}
        return -1;
    },
    transformer: function(a) {return Number(a);}
});
iterator.addSortRule({
    column: 'col2'
});
var row;
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT: - Note, null and undefined are automatically sorted to the bottom by default.
// 29 2 0
// 9 "2" 0
// 23 2 0
// 19 2 0
// 13 2 0
// 3 2 0
// 25 1 0
// 15 1 0
// 27 0 0
// 21 0 0
// 7 "0" 0
// 17 0 0
// 11 0 0
// undefined 0 0
// 26 2 1
// 16 2 1
// 6 2 1
// 28 1 1
// 22 1 1
// 18 1 1
// 8 "1" 1
// 12 1 1
// null 1 1
// 24 0 1
// 14 0 1
// 4 0 undefined
// 5 1 null
```

### Example 5

Paginate the data

```javascript
var datatable = new DatatableJs({data: sample_data});
var iterator = datatable.createIterator();
iterator.setPaginationRule({
    enabled: true
    , rows_per_page: 10
    , current_page: 2
});
var row;
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT:
// 12 1 1
// 13 2 0
// 14 0 1
// 15 1 0
// 16 2 1
// 17 0 0
// 18 1 1
// 19 2 0
// 21 0 0
// 22 1 1
```

To iterate through the next (or any) page re-execute the iterator with a page option:
```javascript
iterator.execute({page: 3})
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT:
// 23 2 0
// 24 0 1
// 25 1 0
// 26 2 1
// 27 0 0
// 28 1 1
// 29 2 0
```

### Example 6

All of the filter rules can be combined in any way

```javascript
var datatable = new DatatableJs({
    data: sample_data
    , schema: sample_schema
});
var iterator = datatable.createIterator();

iterator

    // Individual filter rules perform an 'AND' match between each other, so each
    // row must match all of the filter rules that have been defined
    .addFilterRule({

        // A single field containing the data to filter on
        fields: 'id'

        // One or more comparison functions. May be any of:
        //     '>'
        //     '>='
        //     '<'
        //     '<='
        //     '=='
        //     '==='
        //     '!='
        //     '!=='
        //     function(data, value) {} // a custom function comparing the data
        //                              // from the table to the values defined
        //                              // below. Return false to reject rows
        //                              // with the `data` value in them
        , comparators: '>'

        // A single value to compare the data with
        , values: 10
    })

    // Multiple matching combinations can be defined in a single filter rule by
    // listing them in an array.  Every filter option will accept an array and
    // check for all possible matches, performing an 'OR' search
    .addFilterRule({

        // A list of fields containing the data to filter on
        fields: ['col1', 'col2']

        // A list of comparison methods.  Each one will be tested against the data
        // in all listed fields to see if it matches any listed value.
        , comparators: [
            '='

            // The first argument is a value from one of the listed fields and
            // the second is a value from the list of values
            , function(data, values) {   // By ignoring the values argument, I can make
                return (1 === data % 2); // this match all odd values as well as 2
            }
        ]

        // A list of values to compare the data with
        , values: [2]
    })

    // Sorting accepts four parameters but only the column name is required
    .addSortRule({

        // The name of the column to sort by
        column: 'col1'

        // Optional, either 'asc' or 'desc.  If omitted:
        //     - if a schema has been defined for this column and that schema has
        //       a sort_direction defined, sort in that direction and toggle sort
        //       directions on the same column after that
        //     - if a schema has not been defined or does not have a sort_direction
        //       value, sort ascending and toggle sort directions on the same column
        //       after that
        , direction: 'desc'

        // Optional, a custom function to use for sort comparisons.  Accepts 2 values
        // to compare and returns either -1, 0 or 1.
        //     -1 if a is less than b
        //     0 if a is equal to b
        //     1 if a is greater than b
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        , comparator: function(a, b) {
            if (a == b) {return 0;}
            if (a > b) {return 1;}
            return -1;
        }

        // Optional, a custom function to transform values prior to comparison.
        , transformer: function(a) {
            return Number(a); // typecast to catch rows 7 - 9 before they're compared with any of the other values
        }
    })

    // Any number of sort rules can be added but remember, each one sorts the entire
    // data set which can be noticeably slow with large data sets in a web browser.
    // This will perform a stable multi-column sort of the data.
    .addSortRule({
        column: 'col2'
    })

    // Only one pagination rule can be used at a time, calling this method again will
    // overwrite the current rule value
    //
    // All parameters are optional and only specified parameters are updated.
    .setPaginationRule({

        // Boolean, enable or disable pagination
        enabled: true

        // Number, the page number to return data for
        , current_page: 2

        // Number, number of filtered rows next() will run through before stopping
        , rows_per_page: 5
    });

var row;
while (row = iterator.next()) {
    console.log(row.id, row.col1, row.col2);
}

// OUTPUT:
// DatatableJs - Could not import row: "id" value is invalid undefined Object {type: function, nullable: false, sort_comparator: undefined, sort_transformer: undefined, sort_direction: "desc"}
// DatatableJs - Could not import row: "id" value is invalid null Object {type: function, nullable: false, sort_comparator: undefined, sort_transformer: undefined, sort_direction: "desc"}
// DatatableJs - Could not import row: "id" value is invalid 3 Object {type: function, nullable: false, sort_comparator: undefined, sort_transformer: undefined, sort_direction: "desc"}
// DatatableJs - 3 of 27 data rows were invalid
// 22 1 1
// 18 1 1
// 12 1 1
// 24 0 1
// 14 0 1
```

### More iterator examples

Iterate through a specific page

```javascript
iterator.setPage(2); // Also supports getPage();
iterator.execute();
while (var data = iterator.next()) {...}
```

Update the number of rows per page.

_This always resets the current page to 1_.

```javascript
iterator.setRowsPerPage(25); // Also supports getRowsPerPage();
iterator.execute();
while (var data = iterator.next()) {...}
```

Enable or disable pagination.

If disabled, the iterator will always loop through the entire data set.

```javascript
iterator.setPaginationEnabled(false); // Also supports getPaginationEnabled();
iterator.execute();
while (var data = iterator.next()) {...}
```

Iterators now also have a length property that returns the number of iteratable
rows.  This takes all filter definitions into account.

```javascript
iterator.length;
```

## Contributing

### Using the issue tracker

The [issue tracker](https://github.com/mkenney/DatatableJs/issues) is the preferred
channel for bug reports, features requests and submitting pull requests, but
please respect the following restrictions:

* Please **do not** use the issue tracker for personal support requests.

* Please **do not** derail or troll issues. Keep the discussion on topic and
    respect the opinions of others.

#### Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful!

Guidelines for bug reports:

0. **Validate and lint your code** - [lint your JS code](http://jshint.com/)
     to ensure your problem isn't caused by an error in your own code.

1. **[Use the GitHub issue search](https://github.com/mkenney/DatatableJs/issues)**  check if the issue has already been
     reported.

2. **Check if the issue has been fixed** - try to reproduce it using the
     latest `master` branch in the repository

3. **Isolate the problem** - ideally create a [reduced test case](http://css-tricks.com/6263-reduced-test-cases/)
     and a [live example](http://jsfiddle.net/).


Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case or live example
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).

## Versioning

For transparency and in striving to maintain backward compatibility, DatatableJs is
maintained under [the Semantic Versioning guidelines](http://semver.org/).  I'll
adhere to those rules whenever possible.

## Creator

**Michael Kenney**

- <https://github.com/mkenney>
- <https://www.linkedin.com/in/michaelkenney>


## Copyright and license

Code and documentation copyright 2014-2015 Michael Kenney. Released under
[the MIT license](https://github.com/mkenney/DatatableJs/blob/master/LICENSE).
