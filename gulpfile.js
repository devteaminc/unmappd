/**
 * Boilerplate Gulp File
 * =====================
 */
'use strict';


/**
 * Dependencies
 * =====================
 * Load our dependencies
 */

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');
var uglify       = require('gulp-uglifyjs');
var notify       = require('gulp-notify');
var concat       = require('gulp-concat');


/**
* Project Configuration
* =====================
*/

var config = {

	path : {

		build : {
			root : 'build',
			css  : 'build/css',
			img  : 'build/images',
			js   : 'build/js',
		},

		dev : {
			root : 'development',
			css  : 'development/css',
			sass : 'development/sass',
			img  : 'development/images',
			js   : 'development/js'
		}

	},

	message : {
		sassCompilationComplete : '😻 Compiled Sass to CSS',
		sassCompilationError    : '🙀 Sass Error: ',
		cssMinificationComplete : '😻 Minified CSS',
		cssPrefixComplete       : '😻 Added CSS Prefixes'
	}

};


gulp.task( 'copyAssets', function () {

	/**
	 * Gulp Task
	 * =========
	 * Copy font files needed by twitter bootstrap
	 */

	return gulp.src( config.path.dev.root + '/vendor/bootstrap/fonts/*.*' )
		.pipe( gulp.dest( config.path.build.root + '/fonts' ));

});

gulp.task( 'compileSass', function () {

	/**
	 * Gulp Task
	 * =========
	 * Compiles Sass to CSS in development directory
	 */

	return gulp.src( './' + config.path.dev.sass + '/*.scss' )
	.pipe( sass({
		onError: function( error ) {
			return notify().write(  config.message.sassCompilationError + error );
		}
	}))
	.pipe( gulp.dest( './' + config.path.dev.css ));
});

gulp.task('uglifyCss', function() {

	/**
	 * Gulp Task
	 * =========
	 * Combines and minifies CSS and outputs to build directory
	 */
	
	return gulp.src([
		'development/vendor/bootstrap/dist/css/bootstrap.css',
		'development/css/main.css'
	])
	.pipe(concat('app.css'))
	.pipe(autoprefixer( 'last 2 version', 'ie 7', 'ie 8', 'ie 9' ))
	.pipe(minifyCss())
	.pipe( gulp.dest( config.path.build.css));
});

gulp.task('uglifyJs', function() {
	
	/**
	 * Gulp Task
	 * =========
	 * Combines and minifies JS and outputs to build directory
	 */
	
	return gulp.src([
		'development/vendor/jquery/dist/jquery.js',
		'development/vendor/moment/min/moment.min.js',
		'development/vendor/livestamp/livestamp.min.js',
		'development/vendor/tweet-formatter/tweet-formatter.js',
		'development/vendor/jsviews/jsviews.js',
		'development/js/main.js'
	])
	.pipe(uglify('app.js'))
	.pipe(gulp.dest(config.path.build.js));
});

gulp.task( 'watch', function () {

	/**
	 * Gulp Task
	 * =========
	 * File Watcher
	 */

	gulp.watch( config.path.dev.sass + '/**/*', [ 'compileSass' ] );
	gulp.watch( config.path.dev.css + '/**/*', [ 'uglifyCss' ] );
	gulp.watch( config.path.dev.js + '/**/*', [ 'uglifyJs' ] );

});


/**
 * Gulp Task
 * =========
 * Default Task
 */

gulp.task( 'default', [ 'watch', 'copyAssets' ] );