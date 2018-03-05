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
  ],
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    jest: true,
  },
  rules: {
    'flowtype-errors/show-errors': 2,
    "flowtype-errors/enforce-min-coverage": [2, 90],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};
