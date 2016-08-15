var webpack = require('webpack');
var pjson = require('./package.json');

module.exports = {
  entry: './src/index.ts',
  output: { filename: pjson.name + '-' + pjson.version + '.js' },
  resolve: {
    alias: {
      riot: 'riot/riot+compiler'
    },
    extensions: ['', '.ts', '.js'],
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
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
      { test: /\.tag$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['es2015'] } }
    ]
  }
};
