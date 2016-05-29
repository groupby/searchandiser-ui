var gulp = require('gulp'),
  shell = require('gulp-shell'),
  typings = require('gulp-typings');

gulp.task('typings:install', function(cb) {
  gulp.src('typings.json')
    .pipe(typings())
    .on('finish', cb);
});
