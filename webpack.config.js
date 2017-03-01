var path = require('path');
console.log(process.env.NODE_ENV);
var baseConfig = {
  entry: {
    index: './src/index',
    test: './src/test'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    library: 'axios-request',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
