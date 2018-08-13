const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
      mode: 'development',
    entry: {
      app: './src/index.js',
    },
   //devtool: 'inline-source-map',
   devtool: 'nosources-source-map',
   devServer: {
     contentBase: './dist',
      clientLogLevel: 'none'
   },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Primary Dashboard'
      })
    ],
    output: {
      filename: '[name].bundle-[hash:6].js',
      path: path.resolve(__dirname, 'dist')
    },
   module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader'
         ]
       }
     ]
   }
  };
