var webpack = require('webpack');
var pjson = require('./package.json');
var TypedocPlugin = require('typedoc-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var UnminifiedPlugin = require('unminified-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';
var isTest = process.env.NODE_ENV === 'test';
var isDocs = process.env.NODE_ENV === 'docs';

function getPlugins() {
  var plugins = [new CleanPlugin(['dist'])];

  if (isProd) {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ comments: false }),
      new UnminifiedPlugin()
    );
  }

  if (isDocs) {
    plugins.push(new TypedocPlugin({
      name: 'searchandiser-ui',
      mode: 'file',

      includeDeclarations: true,
      ignoreCompilerErrors: true,
      version: true
    }));
  }

  return plugins;
}

function getLoaders() {
  var loaders = [{
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  }, {
    test: /\.png$/,
    loader: 'url-loader'
  }, {
    test: /\.ts$/,
    exclude: /node_modules/,
    loader: 'ts-loader'
  }, {
    test: /\.tag(\.html)?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
      presets: ['es2015']
    }
  }, {
    test: /src\/index.ts$/,
    loaders: ['expose?searchandiser', 'ts-loader']
  }];

  if (!isTest) {
    loaders.push({
      test: require.resolve('riot/riot+compiler'),
      loader: 'expose?riot'
    });
  }

  return loaders;
}

module.exports = {
  entry: './src/index.ts',

  output: {
    path: './dist',
    filename: pjson.name + '-' + pjson.version + (isProd ? '.min' : '') + '.js'
  },

  devtool: 'source-map',

  resolve: {
    alias: {
      riot: 'riot/riot+compiler'
    },
    extensions: ['', '.ts', '.js'],
    modulesDirectories: ['bower_components', 'node_modules']
  },

  plugins: getPlugins(),

  module: {

    preLoaders: [{
      test: /\.tag(\.html)?$/,
      exclude: /node_modules/,
      loader: 'riotjs-loader'
    }, {
      test: /\.js$/,
      loader: 'source-map-loader'
    }],

    loaders: getLoaders()
  }
};
