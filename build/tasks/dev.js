var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  paths = require('../paths.js');

gulp.task('dev', function(cb) {
  runSequence(
    'clean:dist',
    'webpack:bundle',
    cb
  );
});

gulp.task('dev:watch', ['dev'], function() {
  gulp.watch([
    paths.src + '/**/*.ts',
    paths.src + '/**/*.tag',
    paths.test + '/**/*.ts'
  ], ['dev']);
});
