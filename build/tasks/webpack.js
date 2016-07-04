var gulp = require('gulp'),
  webpack = require('webpack-stream'),
  pjson = require('../../package.json'),
  paths = require('../paths.js');

gulp.task('webpack:bundle', function() {
  return gulp.src(paths.src + '/index.ts')
    .pipe(webpack(require('../../webpack.conf')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('webpack:watch', function() {
  return gulp.src(paths.src + '/index.ts')
    .pipe(webpack({
      watch: true,
      output: { filename: pjson.name + '-' + pjson.version + '.js' },
      resolve: { extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'] },
      module: {
        loaders: [{ test: /\.ts$/, loader: 'ts-loader' }]
      }
    }))
    .pipe(gulp.dest('dist/'));
});
