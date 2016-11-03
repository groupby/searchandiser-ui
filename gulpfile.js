const gulp = require('gulp');

gulp.task('copy:images', () => gulp
  .src('src/**/*.png')
  .pipe(gulp.dest('dist/src')));

gulp.task('default', ['copy:images']);
