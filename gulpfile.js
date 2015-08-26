var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulpconfig')();
var del = require('del');
var wiredep = require('wiredep').stream;
var port = process.env.PORT || config.defaultPort;

var g = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function() {
  log('checking source files for errors');
  return gulp.src(config.dir.js)
    .pipe(g.if(args.verbose, g.print()))
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(g.jshint.reporter('fail'));
});

gulp.task('css', ['clean-css'], function() {
  log('compiling less to css');

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

// task to update post bowerinstall
gulp.task('wiredep', function() {
  log('wire up bower css, js, and app.js into html');
  var options = config.getWiredepDefaultOptions();
  return gulp.src(config.dir.index)
    .pipe(wiredep(options))
    .pipe(g.inject(gulp.src(config.dir.js)))
    .pipe(gulp.dest(config.dir.client));
});

gulp.task('inject', ['wiredep', 'css'], function() {
  log('inject custom css into html and call wiredep');
  return gulp.src(config.dir.index)
    .pipe(g.inject(gulp.src(config.dir.css)))
    .pipe(gulp.dest(config.dir.client));
});

gulp.task('serve-dev', ['inject'], function() {

  var isDev = true;

  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.dir.server]
  };

  return g.nodemon(nodeOptions)
    .on('restart', ['vet'], function(e) {
      log('**** nodemon restart');
      log('change on restart: \n' + e);
    })
    .on('start', function() {
      log('**** nodemon started');

    })
    .on('crash', function() {
      log('**** nodemon crash!');

    })
    .on('exit', function() {
      log('**** nodemon exit clean');

    });
});






function clean(path, cb) {
  log('cleaning: ' + g.util.colors.blue(path));
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
