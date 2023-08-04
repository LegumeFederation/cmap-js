// Rollup plugins
import eslint from 'rollup-plugin-eslint';
import nodePackageResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

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
    // https://github.com/rollup/rollup/issues/1782#issuecomment-403465311
    commonjs(),
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
    // find node_modules
    nodePackageResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    // include the ENV so it can be evaluated at runtime
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (process.env.WATCH === 'yes' && serve({
      open: true,
      verbose: true,
      contentBase: '',
      host: '0.0.0.0',
      port: 8888
    })),
    (process.env.WATCH === 'yes' && livereload()),
    // uglify/minify only in production
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
