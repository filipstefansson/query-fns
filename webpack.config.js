const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    parse: './src/parse.js',
    stringify: './src/stringify.js',
    'formatters/index': './src/formatters/index',
    'formatters/jsonapi': './src/formatters/jsonapi',
    'formatters/brackets': './src/formatters/brackets',
    'utils/encode': './src/utils/encode',
  },
  output: {
    library: 'query-fns',
    libraryTarget: 'umd',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [new CopyWebpackPlugin(['package.json'])],
};
