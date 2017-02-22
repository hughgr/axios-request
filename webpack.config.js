var path = require('path');

var baseConfig = {
  entry: {
    index: './src/index',
    test: './src/test'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map'
}

module.exports = baseConfig;
