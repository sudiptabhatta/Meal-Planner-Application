import eslintPluginImport from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.js', './db/*.js'], // Apply to all JavaScript files
    languageOptions: {
      ecmaVersion: 2021, // ECMAScript 2021
      sourceType: 'module', // ES modules (or 'script' for CommonJS)
      globals: {
        process: 'readonly', // Add Node.js global variables if needed
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly'
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true, // Report unused ESLint disable comments
    },
    plugins: {
      import: eslintPluginImport, // Import ESLint plugins
    },
    rules: {
      'no-console': 'off', // Allow console logging (useful in Node.js)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused variables, except for `_` prefixed
      'no-undef': 'error', // Disallow the use of undeclared variables
      'import/order': ['error', { 'newlines-between': 'always' }], // Ensure consistent import order
      'no-process-exit': 'error', // Disallow `process.exit()`
      'prefer-const': 'error', // Enforce using `const` for variables never reassigned
      'no-var': 'error', // Disallow `var`, enforce `let` or `const`
      'no-mixed-spaces-and-tabs': 'error', // Disallow mixing spaces and tabs
      'semi': ['error', 'always'],
    },
    env: {
      node: true, // Tells ESLint that the code is running in a Node.js environment
    },
  },
];