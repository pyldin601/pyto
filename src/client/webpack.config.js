const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const entriesPath = path.resolve('./src/client/entries');
const entries = fs
  .readdirSync(entriesPath)
  .filter(filename => /tsx?$/.test(filename));

module.exports = {
  entry: entries.reduce((acc, file) => ({
    ...acc,
    [path.basename(file, path.extname(file))]: path.resolve(entriesPath, file),
  }), {}),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./public/assets'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader?configFile=tsconfig.json',
      },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({resource}) => /node_modules/.test(resource),
    }),
  ],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
};
