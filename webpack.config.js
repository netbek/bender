var path = require('path');
var webpack = require('webpack');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: ['./app.js'],
  output: {
    filename: 'Bender.js',
    path: path.resolve(__dirname, 'js')
  },
  context: path.resolve(__dirname, 'src/js'),
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules/', 'src/js/']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new LodashModuleReplacementPlugin()
  ]
};
