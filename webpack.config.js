var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
console.log(process.env.NODE_ENV);
var baseConfig = {
  entry: {
    test: './src/test',
    index: './src/index',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    library: 'axios-request',
    publicPath: '../build/',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: ['syntax-dynamic-import']
          }
        }]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      }
    ]
  },
  //devtool: 'source-map',
  devtool: 'cheap-module-source-map',
  plugins: [
    new ExtractTextPlugin('style.css'),
    /*
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors'
    })
    */
    /*
    new webpack.optimize.UglifyJsPlugin({
      //compress: process.env.NODE_ENV === 'production',
    })
    */
  ] 
}
if (process.env.NODE_ENV === 'production') {
  baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }));
}


module.exports = baseConfig;
