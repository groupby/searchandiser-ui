var gulp = require('gulp'),
  typedoc = require('gulp-typedoc');

gulp.task('docs', () => {
  return gulp.src(['src/**/*.ts'])
    .pipe(typedoc({
      module: 'commonjs',
      target: 'es5',
      includeDeclarations: true,
      exclude: 'node_modules',

      out: './docs',
      mode: 'file',

      name: 'searchandiser-ui',
      ignoreCompilerErrors: true,
      excludeExternals: true,
      version: true
    }));
});
