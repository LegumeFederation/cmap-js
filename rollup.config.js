// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import nodePackageResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
//import babelrc from 'babelrc-rollup';

// PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

let pkg = require('./package.json');

export default {
  entry: 'src/main.js',
  dest: 'build/cmap.min.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    builtins(),
    globals(),
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
    //babel(babelrc()),
    babel({
      //ignore: /node_modules\/(?!ecma-proposal-math-extensions)/, //do it this way because this one node_module is in es6
      ignore: 'node_modules/**',
      presets: [ 'es2015-rollup' ],
      babelrc: false,
      plugins: [
        'external-helpers',
        ['transform-react-jsx', { 'pragma':'h' }],
        'array-includes'
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
    (process.env.WATCH === 'yes' && serve({
      open: true,
      verbose: true,
      contentBase: '',
      host: 'localhost',
      port: 8888
    })),
    (process.env.WATCH === 'yes' && livereload()),
    // uglify/minify only in production
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'rollupStarterProject',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};
