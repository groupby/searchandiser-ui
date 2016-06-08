var webpack = require('webpack');
var pjson = require('./package.json');

module.exports = {
  output: { filename: pjson.name + '-' + pjson.version + '.js' },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    modulesDirectories: ['bower_components', 'node_modules']
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader' }
    ],
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
      { test: /\.tag$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['es2015'] } }
    ]
  }
};
