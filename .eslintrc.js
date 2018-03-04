module.exports = {
  parser: 'babel-eslint',
  extends: [
    'plugin:prettier/recommended',
  ],
  plugins: [
    'flowtype-errors',
  ],
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    'flowtype-errors/show-errors': 2,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};
