/*!
 * ExtendJs Gruntfile (https://github.com/mkenney/ExtendJs)
 *
 * Copyright 2014 Michael Kenney
 *
 * Licensed under MIT (https://github.com/mkenney/ExtendJs/blob/master/LICENSE)
 */

module.exports = function (grunt) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	// Project configuration.
	grunt.initConfig({

		// Metadata
		  pkg: grunt.file.readJSON('package.json')
		, banner: '/*!\n'
			+ ' * ExtendJs v<%= pkg.version %> (<%= pkg.homepage %>)\n'
			+ ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n'
			+ ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n'
			+ ' */\n'

		// Task configuration
		, clean: {
			dist: 'assets'
		}

		, jshint: {
			options: {
				jshintrc: 'src/js/.jshintrc'
			}
			, grunt: {
				options: {
					jshintrc: '.jshintrc'
				}
				, src: ['Gruntfile.js', 'grunt/*.js']
			}
			, core: {
				src: 'src/js/*.js'
			}
		}

		, jscs: {
			options: {
				config: 'src/js/.jscsrc'
			}
			, grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			}
			, core: {
				src: 'src/js/*.js'
			}
		}

		, concat: {
			options: {
				  banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>'
				, stripBanners: false
			}
			, bootstrap: {
				// Order matters
				src: [
					  'src/js/DatatableJs.js'
					, 'src/js/Exception.js'
					, 'src/js/Schema.js'
					, 'src/js/Column.js'
					, 'src/js/Data.js'
					, 'src/js/Filter.js'
				]
				, dest: 'assets/js/<%= pkg.name %>.js'
			}
		}

		, uglify: {
			options: {
				  preserveComments: 'some'
				, sourceMap: true
				, sourceMapName: 'assets/js/<%= pkg.name %>.map'
				, compress: {
					drop_console: true
				}
			}
			, core: {
				  src: '<%= concat.bootstrap.dest %>'
				, dest: 'assets/js/<%= pkg.name %>.min.js'
			}
		}

		, watch: {
			src: {
				  files: 'src/js/*.js'
				, tasks: ['concat', 'uglify']
			}
		}
	});

	// Load dependencies
	require('load-grunt-tasks')(
		  grunt
		, {
			scope: 'devDependencies'
		}
	);

	// Lint and code style checks
	grunt.registerTask('lint', ['jshint:grunt', 'jscs:grunt', 'jshint:core', 'jscs:core']);

	// Full distribution task.
	grunt.registerTask('dist', ['lint', 'clean', 'concat', 'uglify']);

	// Default task.
	grunt.registerTask('default', ['dist']);
};
