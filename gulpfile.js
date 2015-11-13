/**
 * Gulp build script for DatatableJs
 * The default task does a full build and starts the watchers for
 * development.  The 'release' task just does a full build.
 */

// System utils
var fs = require('fs');
var yamlReader = require('read-yaml');

// Gulp
var gulp = require('gulp');

// Configs
var _conf_ = yamlReader.sync('gulpfile.yml');
var _pkg_ = JSON.parse(fs.readFileSync('./package.json'));


////////////////////////////////////////////////////////////////////////////////
// Primary tasks
////////////////////////////////////////////////////////////////////////////////

// Default task performs a full build and starts the watchers
gulp.task('default', function(done) {
    console.log("\nCompiling DatatableJs...\n");
    gulp.start('release', function() {
        console.log("\nDone.\n");
        gulp.start('watch');
    });
    return done();
});

// Watch task with console.log feedback betwen builds so it's easier to see
// the actions it's taken in the console output.
gulp.task('watch', function(done) {
    console.log("\nStarting development watchers...\n");
    gulp.start('start-watchers', function() {
        console.log("\nReady...\n");
    });
    return done();
});

// Release build, this should be used by Jenkins
// The 'fonts' task executes the 'css' task as a dependency
gulp.task('release', ['js']);

gulp.task('js', ['min-js']);

////////////////////////////////////////////////////////////////////////////////
// Compile JS files
////////////////////////////////////////////////////////////////////////////////

// JS Code style
gulp.task('codestyle-js', function() {
    var jscs = require('gulp-jscs');
    return gulp.src(_conf_.src.js)
//        .pipe(jscs(_conf_.src.js.root+'/.jscsrc'))
        .pipe(jscs('./'+_conf_.path.src.js+'/.jscsrc'))
        .on('error', function(e) {
            console.error(e.toString()+"\n");
        });
});

// Lint RP JS files, ignore BS files
gulp.task('lint-js', function() {
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');
    return gulp.src(_conf_.src.js)
        .pipe(jshint('./'+_conf_.path.src.js+'/.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .on('error', function(e) {
            console.error(e.toString()+"\n");
        });
});

// Build JS file
gulp.task('concat-js', ['codestyle-js', 'lint-js'], function() {
    var concat = require('gulp-concat');
    return gulp.src(_conf_.src.js)
        .pipe(concat(_conf_.path.dist.basename+'.js'))
        .pipe(gulp.dest('./'+_conf_.path.dist.js+'/'+_pkg_.version))
        .on('error', function(e) {
            console.error(e.toString()+"\n");
        });
});

// Minify JS file
gulp.task('min-js', ['concat-js'], function() {
    var rename = require("gulp-rename");
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    return gulp.src('./'+_conf_.path.dist.js+'/'+_pkg_.version+'/'+_conf_.path.dist.basename+'.js')
        .pipe(rename(_conf_.path.dist.basename+'.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'+_conf_.path.dist.js+'/'+_pkg_.version))
        .on('error', function(e) {
            console.error(e.toString()+"\n");
        });
});


////////////////////////////////////////////////////////////////////////////////
// Watcher tasks
////////////////////////////////////////////////////////////////////////////////

// This is the slowest watcher (it takes ~5 seconds to compile all the css).
// I don't know if it can be optimized (the linting and minification tasks are
// super fast and the less task is asynchronous). All the other tasks are
// sub-second.
gulp.task('watch-js', function () {
    gulp.watch(_conf_.path.src.js+'/**/*.js', ['js']);
});

gulp.task('start-watchers', ['watch-js']);
