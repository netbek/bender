var _ = require('lodash');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('livereload');
var open = require('open');
var os = require('os');
var Promise = require('bluebird');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var webserver = require('gulp-webserver');

Promise.promisifyAll(fs);

/* -----------------------------------------------------------------------------
Config
----------------------------------------------------------------------------- */

var gulpConfig = require('./gulp.config.js');
var gulpUserConfig = fs.existsSync('./gulp.user.config.js')
  ? require('./gulp.user.config.js')
  : {};

// Override config with per-user config.
_.merge(gulpConfig, gulpUserConfig);

var webpackConfig = require('./webpack.config.js');

var livereloadOpen =
  (gulpConfig.webserver.https ? 'https' : 'http') +
  '://' +
  gulpConfig.webserver.host +
  ':' +
  gulpConfig.webserver.port +
  (gulpConfig.webserver.open ? gulpConfig.webserver.open : '/');

/* -----------------------------------------------------------------------------
Misc
----------------------------------------------------------------------------- */

var flags = {
  livereloadInit: false // Whether `livereload-init` task has been run
};
var server;

// Choose browser for node-open
var browser = gulpConfig.webserver.browsers.default;
var platform = os.platform();
if (_.has(gulpConfig.webserver.browsers, platform)) {
  browser = gulpConfig.webserver.browsers[platform];
}

/* -----------------------------------------------------------------------------
Functions
----------------------------------------------------------------------------- */

/**
 * Start a watcher.
 *
 * @param {Array} files
 * @param {Array} tasks
 * @param {boolean} livereload - Set to TRUE to force LiveReload to refresh the page.
 */
function startWatch(files, tasks, livereload) {
  if (livereload) {
    tasks.push('livereload-reload');
  }

  gulp.watch(files, function() {
    runSequence.apply(null, tasks);
  });
}

/* -----------------------------------------------------------------------------
LiveReload tasks
----------------------------------------------------------------------------- */

// Start webserver
gulp.task('webserver-init', function(cb) {
  var conf = _.clone(gulpConfig.webserver);
  conf.open = false;

  gulp
    .src('./')
    .pipe(webserver(conf))
    .on('end', cb);
});

// Start livereload server
gulp.task('livereload-init', function(cb) {
  if (!flags.livereloadInit) {
    flags.livereloadInit = true;
    server = livereload.createServer();
    open(livereloadOpen, browser);
  }

  cb();
});

// Refresh page
gulp.task('livereload-reload', function(cb) {
  server.refresh(livereloadOpen);
  cb();
});

/* -----------------------------------------------------------------------------
Build tasks
----------------------------------------------------------------------------- */

gulp.task('clean', function() {
  return del([gulpConfig.dist.css, gulpConfig.dist.js]);
});

gulp.task('css', function(cb) {
  gulp
    .src([gulpConfig.src.css + '**/*.scss'])
    .pipe(sass(gulpConfig.css.params).on('error', sass.logError))
    .pipe(autoprefixer(gulpConfig.autoprefixer))
    .pipe(gulp.dest(gulpConfig.dist.css))
    .pipe(
      cssmin({
        advanced: false
      })
    )
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest(gulpConfig.dist.css))
    .on('end', cb);
});

gulp.task('js', function(cb) {
  runSequence('js-webpack', 'js-minify', cb);
});

gulp.task('js-webpack', function(cb) {
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      gutil.log('[webpack]', err);
    }

    gutil.log(
      '[webpack]',
      stats.toString({
        colors: gutil.colors.supportsColor,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
      })
    );

    cb();
  });
});

gulp.task('js-minify', function(cb) {
  gulp
    .src([gulpConfig.dist.js + '**/*.js'])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest(gulpConfig.dist.js))
    .on('end', cb);
});

gulp.task('build', function(cb) {
  runSequence('clean', 'css', 'js', cb);
});

gulp.task('livereload', function() {
  runSequence('build', 'webserver-init', 'livereload-init', 'watch:livereload');
});

/* -----------------------------------------------------------------------------
Watch tasks
----------------------------------------------------------------------------- */

// Watch with livereload
gulp.task('watch:livereload', function(cb) {
  var livereloadTask = 'livereload-reload';

  _.forEach(gulpConfig.watchTasks, function(watchConfig) {
    var tasks = _.clone(watchConfig.tasks);
    tasks.push(livereloadTask);
    startWatch(watchConfig.files, tasks);
  });
});

/* -----------------------------------------------------------------------------
Default task
----------------------------------------------------------------------------- */

gulp.task('default', ['build']);
