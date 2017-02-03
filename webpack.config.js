const webpack = require('webpack');
const pjson = require('./package.json');
const CleanPlugin = require('clean-webpack-plugin');
const UnminifiedPlugin = require('unminified-webpack-plugin');

let isProd = false;
let isCi = false;
let isTest = false;

function resolve() {
  return {
    alias: {
      riot: 'riot/riot+compiler'
    },
    extensions: ['', '.ts', '.js'],
    modulesDirectories: ['node_modules', 'src']
  };
}

function preLoaders() {
  return [{
    test: /\.tag(\.html)?$/,
    exclude: /node_modules/,
    loader: 'riot-tag',
    query: { type: 'none' }
  }];
}

function loaders() {
  return [{
    test: /\.css$/,
    loaders: ['style', 'css']
  }, {
    test: /\.png$/,
    loader: 'url'
  }, {
    test: /\.json$/,
    loader: 'json'
  }, {
    test: /\.ts$/,
    exclude: /node_modules/,
    loader: 'awesome-typescript',
    query: {
      inlineSourceMap: isTest,
      sourceMap: !isTest
    }
  }, {
    test: /\.tag(\.html)?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      presets: ['es2015']
    }
  }];
}

/* eslint-disable no-fallthrough */
// eslint-disable-next-line no-process-env
switch (process.env.NODE_ENV) {
  case 'ci':
  case 'continuous':
    isCi = true;
  case 'test':
  case 'testing':
    isTest = true;

    return module.exports = {
      resolve: resolve(),

      devtool: 'inline-source-map',

      module: {
        preLoaders: isCi ? preLoaders() : preLoaders().concat({
          test: /\.ts$/,
          loader: 'tslint'
        }),

        postLoaders: isCi ? [] : [{
          test: /\.ts$/,
          loader: 'sourcemap-istanbul-instrumenter',
          exclude: [
            /node_modules/,
            /test/,
            /karma\.entry\.ts$/
          ]
        }],

        loaders: loaders()
      }
    };
  case 'prod':
  case 'production':
    isProd = true;
  default:
    return module.exports = {
      resolve: resolve(),

      entry: './src/index.ts',

      output: {
        path: './dist',
        filename: `${pjson.name}-${pjson.version}${isProd ? '.min' : ''}.js`
      },

      devtool: 'source-map',

      plugins: [new CleanPlugin(['dist'])]
        .concat(isProd ? [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin({ comments: false }),
          new UnminifiedPlugin()
        ] : []),

      module: {
        preLoaders: preLoaders().concat({
          test: /\.ts$/,
          loader: 'source-map'
        }),

        loaders: [{
          test: /src\/index.ts$/,
          loader: 'expose?searchandiser'
        }, {
          test: require.resolve('riot/riot+compiler'),
          loader: 'expose?riot'
        }].concat(...loaders())
      }
    };
}
/* eslint-enable no-fallthrough */
