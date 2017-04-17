// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import nodePackageResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

export default {
  entry: 'src/main.js',
  dest: 'build/cmap.min.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    // bundle css
    postcss({
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false, }),
        cssnano(),
      ],
      extensions: [ '.css' ],
    }),
    // linter (see .eslintrc.json)
    eslint({
      exclude: [
        'src/**/*.css',
        'mixwith.js/**/*'
      ]
    }),
    // transpile es6
    babel({
      exclude: 'node_modules/**',
      presets: [ 'es2015-rollup' ],
      babelrc: false,
      plugins: [
        "external-helpers"
      ]
    }),
    // find node_modules
    nodePackageResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    // import node_modules
    commonjs(),
    // include the ENV so it can be evaluated at runtime
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    // uglify/minify only in production
    (process.env.NODE_ENV === 'production' && uglify())
  ],
};
