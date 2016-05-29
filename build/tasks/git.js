var gulp = require('gulp'),
  git = require('gulp-git');

gulp.task('pre-commit', ['git:add']);

gulp.task('git:add', ['default'], function() {
  return gulp.src('.')
    .pipe(git.add({ options: '-A' }));
});
