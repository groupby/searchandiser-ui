var gulp = require('gulp'),
  del = require('del'),
  paths = require('../paths.js');

gulp.task('clean:typings', function(cb) {
  del([
    paths.typings
  ], cb);
});

gulp.task('clean:dist', function(cb) {
  del([
    paths.dist
  ], cb);
});

gulp.task('clean:tags', function(cb) {
  del([
    paths.tagBuild
  ], cb);
});

gulp.task('clean', ['clean:dist', 'clean:typings', 'clean:tags']);
