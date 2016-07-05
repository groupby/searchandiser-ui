var gulp = require('gulp'),
  wp = require('webpack'),
  webpack = require('webpack-stream'),
  pjson = require('../../package.json'),
  packConfig = require('../../webpack.conf'),
  paths = require('../paths.js'),
  assign = require('object-assign');

gulp.task('webpack:bundle', function() {
  return gulp.src(paths.src + '/index.ts')
    .pipe(webpack(packConfig))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('webpack:minify', function() {
  var minConfig = assign({}, packConfig, {
    output: { filename: pjson.name + '-' + pjson.version + '.min.js' },
    plugins: [new wp.optimize.UglifyJsPlugin()]
  });

  return gulp.src('')
    .pipe(webpack(minConfig))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('webpack:watch', function() {
  return gulp.src(paths.src + '/index.ts')
    .pipe(webpack(assign({}, packConfig, { watch: true })))
    .pipe(gulp.dest(paths.dist));
});
