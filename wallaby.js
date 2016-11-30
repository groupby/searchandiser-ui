const wallabyWebpack = require('wallaby-webpack');

process.env.NODE_ENV = 'wallaby'; // eslint-disable-line no-process-env
const webpackPostprocessor = wallabyWebpack(require('./webpack.config'));

module.exports = function (wallaby) {

  return {
    files: [
      { pattern: 'node_modules/karma-sinon-chai/node_modules/chai/chai.js', instrument: false },
      { pattern: 'node_modules/karma-sinon-chai/node_modules/sinon/pkg/sinon.js', instrument: false },
      { pattern: 'node_modules/karma-sinon-chai/node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
      { pattern: 'node_modules/groupby-api/**.*.d.ts', instrument: false },
      { pattern: 'src/**/*.ts', load: false }
    ],

    tests: [
      // { pattern: 'test/bootstrap.ts', load: false },
      { pattern: 'test/utils/**/*.ts', load: false },
      { pattern: 'test/unit/**/*.ts', load: false }
    ],

    postprocessor: webpackPostprocessor,

    bootstrap: function () {
      window.__moduleBundler.loadTests(); // eslint-disable-line no-undef
    }
  };
};
