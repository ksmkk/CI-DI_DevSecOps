module.exports = [
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'scripts/**/*.js'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',

        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },

    rules: {
      'no-console': 'off',
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
];