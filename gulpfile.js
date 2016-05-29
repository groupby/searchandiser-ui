var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  merge = require('merge-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  git = require('gulp-git'),
  bump = require('gulp-bump'),
  tag_version = require('gulp-tag-version'),
  filter = require('gulp-filter'),
  mocha = require('gulp-mocha'),
  del = require('del'),
  runSequence = require('run-sequence'),
  typings = require('gulp-typings'),
  nodemon = require('gulp-nodemon'),
  shell = require('gulp-shell'),
  istanbul = require('gulp-istanbul'),
  minify = require('gulp-minify'),
  concat = require('gulp-concat'),
  pjson = require('./package.json');

require('git-guppy')(gulp);

var PATHS = {
  src: 'lib',
  build: 'build',
  test: 'test',
  typings: 'typings',
  dist: 'dist'
};

var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

/**
 * Git Hooks
 */
gulp.task('pre-commit', ['add']);

gulp.task('add', ['default'], function() {
  return gulp.src('.')
    .pipe(git.add({ options: '-A' }));
});

/**
 * Defintions files
 */
gulp.task('definitions', shell.task([
  'node scripts/dts-bundle.js'
]));

/**
 * Dev tasks
 */
gulp.task('typings:install', function(callback) {
  gulp.src('./typings.json')
    .pipe(typings())
    .on('finish', callback);
});
gulp.task('typings', ['typings:install']);

gulp.task('clean:typings', function(cb) {
  del([
    PATHS.typings
  ], cb);
});

gulp.task('scripts:dev', function() {
  var tsResult = gulp.src([
      PATHS.src + '/**/*.ts',
      PATHS.test + '/**/*.ts'
    ], { base: "./" })
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return merge([
    tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
  ]);
});
gulp.task('scripts:dev:watch', ['scripts:dev'], function() {
  gulp.watch([
    PATHS.src + '/**/*.ts',
    PATHS.test + '/**/*.ts',
    PATHS.examples + '/**/*.ts'
  ], ['scripts:dev']);
});

gulp.task('clean:dev', function(cb) {
  del([
    PATHS.src + '/**/*.js',
    PATHS.test + '/**/*.js',
    PATHS.dist + '/**/*.js'
  ], cb);
});

/**
 * Tests tasks
 */
gulp.task('test', ['scripts:dev'], function(cb) {
  gulp.src([
      PATHS.src + '/**/*.js',
      '!' + PATHS.src + '/polyfills/*'
    ])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(PATHS.test + '/**/*.js')
        .pipe(mocha({
          reporter: 'spec'
        }))
        .pipe(istanbul.writeReports()) // Creating the reports after tests ran
        .on('end', cb);
    });
});

gulp.task('test:watch', ['test'], function() {
  gulp.watch([
    PATHS.src + '/**/*.ts',
    PATHS.test + '/**/*.ts'
  ], ['test']);
});

/**
 * Prod
 */
gulp.task('scripts:prod', function() {
  var tsResult = gulp.src([
      PATHS.src + '/**/*.ts'
    ])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest(PATHS.build)),
    tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.build))
  ]);
});

gulp.task('clean:prod', function(cb) {
  del([
    PATHS.build
  ], cb);
});

/**
 * Cleaning
 */
gulp.task('clean', ['clean:dev', 'clean:prod', 'clean:typings']);

/**
 * Default
 */
gulp.task('default', function(cb) {
  runSequence(
    'ci',
    'scripts:prod',
    'definitions',
    cb
  );
});


/**
 * Build
 */
gulp.task('build', function(cb) {
  runSequence(
    'clean',
    'typings',
    'scripts:prod',
    'definitions',
    'compress',
    cb
  );
});

gulp.task('concat', function() {
  return gulp.src('build/**/*.js')
    .pipe(concat('api-javascript-' + pjson.version + '.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('compress', ['concat'], function() {
  gulp.src('build/api-javascript-' + pjson.version + '.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '.min.js']
    }))
    .pipe(gulp.dest('dist'))
});

/**
 * CI
 */
gulp.task('ci', function(cb) {
  runSequence(
    'clean',
    'typings',
    'test',
    cb
  );
});

/**
 * Bumping version
 */
function inc(importance) {
  return gulp.src(['./package.json'])
    .pipe(bump({ type: importance }))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('Bumps for new ' + importance + ' release.'))
    .pipe(filter('package.json'))
    .pipe(tag_version());
}

gulp.task('patch', function() {
  return inc('patch'); });
gulp.task('feature', function() {
  return inc('minor'); });
gulp.task('release', function() {
  return inc('major'); });
