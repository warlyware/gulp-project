var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulpconfig')();
var del = require('del');

var g = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function() {
  log('[1] checking source files for errors');
  return gulp.src(config.dir.js)
    .pipe(g.if(args.verbose, g.print()))
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(g.jshint.reporter('fail'));
});

gulp.task('css', ['clean-css'], function() {
  log('[2] compiling less to css');

  return gulp.src(config.dir.less)
    .pipe(g.plumber())
    .pipe(g.less())
    .pipe(g.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.dir.temp));
});

gulp.task('clean-css', function(cb) {
  var files = config.dir.temp + '/**/*.css';
  clean(files, cb);
});

gulp.task('less-watcher', function() {
  gulp.watch([config.dir.less], ['css']);
});


function clean(path, cb) {
  log('Cleaning: ' + g.util.colors.blue(path));
  del(path, cb);
}

function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        g.util.log(g.util.colors.blue(msg[item]));
      }
    }
  } else {
    g.util.log(g.util.colors.blue(msg));
  }
}
