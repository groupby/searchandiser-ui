var webpackConfig = require('./webpack.config');

var isCi = process.env.NODE_ENV === 'ci';

function reporters() {
  var coverageReporters = [{
    type: 'json',
    subdir: '.',
    file: 'coverage.json'
  }];

  return isCi ? coverageReporters : coverageReporters.concat({
    type: 'text'
  });
}

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon', 'source-map-support'],
    files: ['./karma.entry.ts'],
    preprocessors: {
      './karma.entry.ts': ['webpack']
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true,
      stats: 'errors-only'
    },
    client: {
      captureConsole: true
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: reporters()
    },
    browsers: ['PhantomJS'],
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity
  });
};
