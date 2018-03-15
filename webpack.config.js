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
    library: 'searchParams',
    libraryTarget: 'umd',
  },
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
};
