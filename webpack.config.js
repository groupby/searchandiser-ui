var webpack = require('webpack');
var pjson = require('./package.json');
var CleanPlugin = require('clean-webpack-plugin');
var UnminifiedPlugin = require('unminified-webpack-plugin');

var isProd = false;
var isCi = false;
var isTest = false;

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
    loader: 'riotjs'
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

        postLoaders: [{
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
        filename: pjson.name + '-' + pjson.version + (isProd ? '.min' : '') + '.js'
      },

      devtool: 'source-map',

      plugins: isProd ? [
        new CleanPlugin(['dist']),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ comments: false }),
        new UnminifiedPlugin()
      ] : [new CleanPlugin(['dist'])],

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
