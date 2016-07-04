var gulp = require('gulp'),
  runSequence = require('run-sequence');

require('git-guppy')(gulp);
require('require-dir')('build/tasks');

/**
 * Default
 */
gulp.task('default', function(cb) {
  runSequence(
    'build',
    cb
  );
});


/**
 * Build
 */
gulp.task('build', function(cb) {
  runSequence(
    'clean',
    'typings:install',
    'webpack:bundle',
    cb
  );
});
