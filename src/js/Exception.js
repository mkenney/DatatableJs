
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
