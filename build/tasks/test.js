var gulp = require('gulp'),
  // mocha = require('gulp-mocha'),
  // istanbul = require('gulp-istanbul'),
  runSequence = require('run-sequence'),
  paths = require('../paths.js');
//
// /**
//  * Tests tasks
//  */
// gulp.task('test', ['dev:build'], function(cb) {
//   gulp.src(paths.src + '/**/*.js')
//     .pipe(istanbul())
//     .pipe(istanbul.hookRequire())
//     .on('finish', function() {
//       gulp.src(paths.test + '/**/*.js')
//         .pipe(mocha({ reporter: 'spec' }))
//         .pipe(istanbul.writeReports()) // Creating the reports after tests ran
//         .on('end', cb);
//     });
// });
//
// gulp.task('test:watch', ['test'], function() {
//   gulp.watch([
//     paths.src + '/**/*.ts',
//     paths.test + '/**/*.ts'
//   ], ['test']);
// });

gulp.task('ci', function(cb) {
  runSequence(
    'clean',
    'typings:install',
    // 'test',
    cb
  );
});
