var pjson = require('./package.json');

module.exports = {
  output: { filename: pjson.name + '-' + pjson.version + '.js' },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    modulesDirectories: ['bower_components', 'node_modules']
  },
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
    ],
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
      { test: /\.tag$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};
