const path = require('path');
const webpack = require('webpack');
const pjson = require('./package.json');
const CleanPlugin = require('clean-webpack-plugin');
const UnminifiedPlugin = require('unminified-webpack-plugin');

const definePlugin = new webpack.DefinePlugin({ VERSION: `"${pjson.version}"` });
let isProd = false;
let isCi = false;
let isTest = false;

function resolve() {
  return {
    alias: {
      riot: 'riot/riot+compiler'
    },
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ]
  };
}

function preLoaders() {
  return [{
    test: /\.tag\.html$/,
    exclude: path.resolve(__dirname, 'node_modules'),
    enforce: 'pre',
    loader: 'riot-tag-loader',
    options: { type: 'none' }
  }];
}

function loaders() {
  return [{
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }, {
    test: /\.png$/,
    loader: 'url-loader'
  }, {
    test: /\.json$/,
    loader: 'json-loader'
  }, {
    test: /\.ts$/,
    exclude: path.resolve(__dirname, 'node_modules'),
    loader: 'awesome-typescript-loader',
    options: {
      inlineSourceMap: isTest,
      sourceMap: !isTest,
      declaration: !isTest
    }
  }, {
    test: /\.tag\.html$/,
    loader: 'babel-loader'
  }, {
    test: /\.js$/,
    loader: 'babel-loader'
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

      plugins: [definePlugin],

      module: {
        rules: [
          ...preLoaders(),
          ...(isCi ? [] : [{
            test: /\.ts$/,
            loader: 'tslint-loader',
            enforce: 'pre'
          }]),
          ...loaders(),
          ...(isCi ? [] : [{
            test: /\.ts$/,
            loader: 'sourcemap-istanbul-instrumenter-loader',
            exclude: [
              path.resolve(__dirname, 'node_modules'),
              path.resolve(__dirname, 'test'),
              path.resolve(__dirname, 'karma.entry.ts')
            ]
          }])
        ]
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
        path: path.resolve(__dirname, 'dist'),
        filename: `${pjson.name}-${pjson.version}${isProd ? '.min' : ''}.js`
      },

      devtool: 'source-map',

      plugins: [definePlugin, new CleanPlugin(['dist'])]
        .concat(isProd ? [
          new webpack.optimize.UglifyJsPlugin({ comments: false }),
          new UnminifiedPlugin()
        ] : []),

      module: {
        rules: [
          ...preLoaders(),
          {
            test: /\.ts$/,
            loader: 'source-map-loader',
            enforce: 'pre'
          },
          {
            test: /src\/index.ts$/,
            loader: 'expose-loader',
            options: 'searchandiser'
          }, {
            test: require.resolve('riot/riot+compiler'),
            loader: 'expose-loader',
            options: 'riot'
          },
          ...loaders()
        ]
      }
    };
}
/* eslint-enable no-fallthrough */
