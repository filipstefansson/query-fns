module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:flowtype/recommended',
  ],
  plugins: [
    'flowtype',
    'flowtype-errors',
    'compat',
  ],
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    jest: true,
    browser: true,
  },
  rules: {
    'flowtype-errors/show-errors': 2,
    'flowtype-errors/enforce-min-coverage': [2, 90],
    'compat/compat': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};
