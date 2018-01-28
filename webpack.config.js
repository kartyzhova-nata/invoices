var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './public/src/index.js',
  output: { path: __dirname + '/public/js', filename: 'client.js' },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};