module.exports = {
  root: true,

  env: {
    // this section will be used to determine which APIs are available to us
    // (i.e are we running in a browser environment or a node.js env)
    node: true,
    browser: true,
    mocha: true,
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    project: './tsconfig.json',
    extraFileExtensions: ['.vue'],
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    '@vue/typescript'
  ],

  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'no-console': 'off',
    'curly': 'warn',
    'dot-location': ['warn', 'property'],
    'max-classes-per-file': ['error', 1],
    'no-empty-function': 'error',
    'no-implicit-coercion': 'warn',
    'no-multi-spaces': 'warn',
    'indent': ['warn', 2],
    'quotes': ['warn', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always'],
    'space-before-blocks': ['warn', 'always'],
    'space-before-function-paren': ['warn', 'never'],
    'space-in-parens': ['warn', 'never'],
    'space-infix-ops': 'warn',
    'arrow-parens': ['warn', 'always']
  },
}
