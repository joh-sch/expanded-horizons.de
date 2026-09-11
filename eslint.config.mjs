// ESLint flat config (ESLint 9+)
// Lints all JS inside the app entry folder and component snippet folders.

const APP = 'development-site/app';
const SNIPPETS = 'development-site/site/snippets';

export default [
  {
    files: [`${APP}/**/*.js`, `${SNIPPETS}/**/*.js`],
    ignores: [`${APP}/app.min.js`],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
];
