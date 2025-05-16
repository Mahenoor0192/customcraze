const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // Define `process.env`
    }),
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // Define `process.env`
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js','.jsx'],
  },
  devtool: 'source-map',
  mode: 'development',
};