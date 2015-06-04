'use strict';

var path = require('path'),
	gulp = require('gulp'),
	wrap = require('gulp-wrap'),
	del = require('del'),
	spawn = require('child_process').spawn,
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	nom = require('nomnom'),
	through = require('through2');

var opts = nom
	.option('outfile', {
		full: 'output-filename',
		abbr: 'o',
		default: 'webOS.js'
	})
	.option('outdir', {
		full: 'output-dirname',
		abbr: 'd',
		default: './dist'
	})
	.option('docdir', {
		full: 'docs-dirname',
		abbr: 'docs',
		default: './docs'
	})
	.option('debug', {
		full: 'debug',
		flag: true
	})
	.parse();

gulp.task('default', ['clean', 'build']);
gulp.task('clean', clean);
gulp.task('build', ['clean'], build);
gulp.task('clean-docs', cleanDocs);
gulp.task('docs', ['clean-docs'], jsdoc);

function clean(cb) {
	del([opts.outdir], cb);
}

function cleanDocs(cb) {
	del([opts.docdir], cb);
}

function build() {
	return gulp
		.src([
			'./src/core/foundation.js',
			'./src/core/device.js',
			'./src/core/platform.js',
			'./src/*.js'
		])
		.pipe(wrap('(function(){\n<%= contents %>\n})();'))
		.pipe(concat(opts.outfile))
		.pipe(uglify({
			mangle: !opts.debug,
			compress: !opts.debug,
			output: {
				beautify: opts.debug
			},
			preserveComments: function(comment) {
				if(opts.debug && comment && comment.start && comment.start.comments_before) {
					return comment.start.comments_before[0].value.charAt(0)=='*';
				} else {
					return false;
				}
			}
		}))
		.pipe(gulp.dest(opts.outdir));
}

function jsdoc(cb) {
	var cmd = process.execPath;
	var args = [
		path.join('./node_modules/.bin/', 'jsdoc'),
		'-d',
		path.resolve(opts.docdir),
		path.join("src/core/foundation.js"),
		path.join("src/core/device.js"),
		path.join("src/core/platform.js"),
		'src'
	]
	if(process.platform.indexOf('win')===0) {
		cmd = process.env.COMSPEC || 'cmd.exe';
		args[0] = path.join('./node_modules/.bin/', 'jsdoc.cmd');
		args.unshift('/c');		
	}
	var child = spawn(cmd, args, {stdio: 'inherit', cwd: process.cwd()});
	child.on('close', function(code) {
		del([path.join(opts.docdir, 'index.html')], cb);
	});
}
