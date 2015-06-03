/** Regular npm dependendencies */
var gulp = require('gulp');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var nw = require('nw');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var del = require('del');
var stylish = require('jshint-stylish');

/** Gulp dependencies */
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');

/** Grab-bag of build configuration. */
var config = {};

/** Reusable functions */

/** Gulp tasks */

gulp.task('default', ['test']);

gulp.task('test', ['jshint']);

gulp.task('jshint', function () {
  gulp.src('./<%= clientFolder %>/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('nw', function (cb) {
  var nwProcess = spawn(nw.findpath(), ['<%= clientFolder %>']);

  nwProcess.on('error', cb);
  nwProcess.on('close', function (code) {
    if (code) {
      cb(new Error('child process exited with code ' + code))
    }

    cb();

    // Close gulp
    process.exit(1);
  });
});

gulp.task('serve', function (cb) {
  runSequence(
    'clean:tmp',
    'less',
    'inject:css',
    'inject:js',
    'wiredep',
    'livereload',
    ['nw',
    'watch'],
    cb);
});

gulp.task('wiredep', function () {
  gulp.src('<%= clientFolder %>/index.html')
    .pipe(wiredep({
      ignorePath: '<%= clientFolder %>/',
      exclude: [/font-awesome.css/]
    }))
    .pipe(gulp.dest('<%= clientFolder %>'));
});

gulp.task('less', ['inject:less'], function () {
  return gulp.src('<%= clientFolder %>/app/app.less')
    .pipe(less({
      paths: [
        '<%= clientFolder %>/bower_components',
        '<%= clientFolder %>/app',
        '<%= clientFolder %>/components'
      ]
    }))
    .pipe(gulp.dest('<%= clientFolder %>/.tmp/app'));
});

gulp.task('inject:less', function () {
  return gulp.src('<%= clientFolder %>/app/app.less')
    .pipe(inject(gulp.src([
      '<%= clientFolder %>/{app,components}/**/*.less',
      '!<%= clientFolder %>/app/app.less'
    ], {read: false}), {
      transform: function (filePath) {
        filePath = filePath.replace('/<%= clientFolder %>/app/', '');
        filePath = filePath.replace('/<%= clientFolder %>/components/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector'
    }))
    .pipe(gulp.dest('<%= clientFolder %>/app'));
});

gulp.task('inject:css', function () {
  return gulp.src('<%= clientFolder %>/index.html')
    .pipe(inject(gulp.src([
      '<%= clientFolder %>/{app,components}/**/*.css'
    ], {read: false}), {
      transform: function (filePath) {
        filePath = filePath.replace('/<%= clientFolder %>/', '');
        filePath = filePath.replace('/.tmp/', '');
        return '<link rel="stylesheet" href="' + filePath + '">';
      },
      starttag: '<!-- injector:css -->',
      endtag: '<!-- endinjector -->'
    }))
    .pipe(gulp.dest('<%= clientFolder %>'));
});

gulp.task('inject:js', function () {
  return gulp.src('<%= clientFolder %>/index.html')
    .pipe(inject(gulp.src([
      '<%= clientFolder %>/{app,components}/**/*.js',
      '!<%= clientFolder %>/app/app.js',
      '!<%= clientFolder %>/{app,components}/**/*.spec.js',
      '!<%= clientFolder %>/{app,components}/**/*.mock.js'
    ], {read: false}), {
      transform: function (filePath) {
        filePath = filePath.replace('/<%= clientFolder %>/', '');
        return '<script src="' + filePath + '"></script>';
      },
      starttag: '<!-- injector:js -->',
      endtag: '<!-- endinjector -->'
    }))
    .pipe(gulp.dest('<%= clientFolder %>'));
});

gulp.task('watch', function () {
  gulp.watch('<%= clientFolder %>/{app,components}/**/*.less', ['less']);
  gulp.watch('<%= clientFolder %>/{app,components}/**/*.css', ['inject:css']);
  gulp.watch(['<%= clientFolder %>/{app,components}/**/*.js',
    '!<%= clientFolder %>/{app,components}/**/*.spec.js',
    '!<%= clientFolder %>/{app,components}/**/*.mock.js'
  ], ['inject:js']);

  gulp.watch([
      '{.tmp,<%= clientFolder %>}/{app,components}/**/*.css',
      '<%= clientFolder %>/{app,components}/**/*.html',
      '<%= clientFolder %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
      '<%= clientFolder %>/{app,components}/**/*.js',
      '!<%= clientFolder %>/{app,components}/**/*.spec.js',
      '!<%= clientFolder %>/{app,components}/**/*.mock.js'
    ],
    function (event) {
      livereload.changed(event.path);
    });
});

gulp.task('livereload', function () {
  livereload.listen();
});

gulp.task('clean', ['clean:tmp', 'clean:dist']);

gulp.task('clean:tmp', function (cb) {
  del(['.tmp'], cb);
});

gulp.task('clean:dist', function (cb) {
  del(['dist'], cb);
});
