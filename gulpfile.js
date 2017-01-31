// this gulpfile is based on the recipe:
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/rollup-with-rollup-stream.md

var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    rollup = require('rollup-stream'),
    sourcemaps = require('gulp-sourcemaps')
    rename = require('gulp-rename'),
    minify = require('gulp-minify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babel = require('rollup-plugin-babel'),
    json = require('rollup-plugin-json'),
    nodeResolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    replace = require('rollup-plugin-replace'),
    string = require('rollup-plugin-string');

gulp.task('minify-css', function() {
  // minify css and write back into same directory.
  // (infernojs components will load them from the same dir.)
  return gulp.src('./src/ui/css/*.css')
    .pipe(cleanCSS())
    .pipe(rename(function (path) {
      path.extname = ".css-min";
    }))
    .pipe(gulp.dest("./src/ui/css"));
});

gulp.task('default', ['minify-css'], function() {
    return rollup({
      entry: 'src/main.js',
      format: 'iife',
      plugins: [
        // json parser
        json(),
        // nnode_modules import resolver
        nodeResolve(),
        // enable import of commonjs (node) modules
        commonjs(),
        // inline css and svg icons directly into component templates
        // https://github.com/blog/2112-delivering-octicons-with-svg
        string({ include: ['**/*.css-min', '**/*.svg']}),
        // for interop with babel ES6 transpiler
        babel({
          exclude: 'node_modules/**'
        }),
        // workaround for infernojs to not fail at runtime
        replace({'process.env.NODE_ENV': JSON.stringify('production')}),
      ],
      sourceMap: true
    })
    .pipe(source('main.js', './src'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename('cmap.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(minify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch([
    './src/**/*.js',
    './src/**/*.css',
    './src/**/*.svg'
  ], ['default']);
//  gulp.watch(, ['default']);
//  gulp.watch(, ['default']);

});
