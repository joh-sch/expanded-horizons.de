import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import inject from '@rollup/plugin-inject';
import terser from '@rollup/plugin-terser';
import eslint from '@rollup/plugin-eslint';
import { fileURLToPath } from 'url';
import { dirname, resolve as pathResolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────

// Mirrors CodeKit setup:
//   - Transpile with Babel
//   - Bundle as IIFE (for <script> tags in browsers)
//   - Minify with Terser: always
//   - Source map: in development only

const isDev = process.env.NODE_ENV !== 'production';

const SITE = 'development-site';

// ─── Export ───────────────────────────────────────────────────────────────────

export default {
  input: `${SITE}/app/app.js`,

  output: {
    file: `${SITE}/app/app.min.js`,
    format: 'iife',
    name: 'BareboneKirbyApp', // global variable name exposed by the IIFE
    sourcemap: isDev, // sourcemaps only in dev / watch mode
  },

  // Aggressive tree-shaking
  treeshake: {
    propertyReadSideEffects: false,
    moduleSideEffects: (id) => !id.includes("node_modules"),
  },

  plugins: [
    eslint({
      include: [`${SITE}/app/**/*.js`, `${SITE}/site/snippets/**/*.js`],
      exclude: [`${SITE}/app/app.min.js`],
      throwOnError: true, // fail the build on lint errors
    }),
    resolve({
      browser: true,
      mainFields: ['module', 'browser', 'main'],
      exportConditions: ['import', 'module', 'browser', 'default'],
      modulePaths: [pathResolve(__dirname, "node_modules")],
    }),
    commonjs(),
    // gia/Component.js uses bare `regeneratorRuntime` as a global.
    // Inject replaces those references with a proper import from regenerator-runtime,
    // scoped to gia only to avoid illegal self-reassignment in regenerator-runtime itself.
    inject({
      include: /[/\\]gia[/\\]/,
      regeneratorRuntime: ['regenerator-runtime', 'default'],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
    }),
    terser(), // minify — always
  ],
};
