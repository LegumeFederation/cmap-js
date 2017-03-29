// this gulpfile is based on the recipe:
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/rollup-with-rollup-stream.md

var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps')
    rename = require('gulp-rename'),
    minify = require('gulp-minify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rollup = require('rollup-stream'),
    babel = require('rollup-plugin-babel'),
    json = require('rollup-plugin-json'),
    postcss = require('rollup-plugin-postcss'),
    nodeResolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    replace = require('rollup-plugin-replace'),
    string = require('rollup-plugin-string'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    isparta = require('isparta'),
    connect = require('gulp-connect'),
    del = require('del');

function onError (err){
    console.log(err.toString());
    //for integrating into watch
    this.emit('end');
    //for exiting process
    // process.exit(1);

}


gulp.task('set-dev-env', function(){
    return process.env.BABEL_ENV = 'development';
});

gulp.task('set-test-env', function(){
    return process.env.BABEL_ENV = 'test';
});

gulp.task('set-prod-env', function(){
    return process.env.BABEL_ENV = 'production'
});



gulp.task('default',['set-dev-env'], function() {
    return rollup({
      entry: 'src/main.js',
      format: 'iife',
      plugins: [
        json(),
        string({ include: ['**/*.svg']}),
        postcss({ extensions: ['.css','.css-min'] }),
        // nnode_modules import resolver
        nodeResolve(),
        // enable import of commonjs (node) modules
        commonjs(),
        // for interop with babel ES6 transpiler
        babel({ exclude: 'node_modules/**' })
      ],
      sourceMap: true
    })
    .pipe(source('main.js', './src'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename('cmap.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(minify())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
});

gulp.task('watch', ['webserver'], function() {
  gulp.watch([
    './src/**/*.js',
    './src/**/*.css',
    './src/**/*.svg'
  ], ['default']);

});

//gulp.task('test', ['set-test-env','istan'], function(){
gulp.task('test', ['set-test-env'], function(){
    return gulp.src(['test/**/*.test.js'], {read:false})
            .pipe(mocha({
                reporter: 'spec',
                compilers:'js:babel-register',
                require:['ignore-styles'] //avoids breaking on css styles
                
            }))
            .on("error",onError)
            //.pipe(istanbul.writeReports({
            //    dir: './coverage',
            //    reporterOpts:{dir:'./coverage'}
            //}))
});
//
//gulp.task('istan', function() {
//   return gulp.src(['./src/**/*.js'])
//        .pipe(istanbul({
//          instrumenter: isparta.Instrumenter,
//          includeUntested: true
//          }))
//          .pipe(istanbul.hookRequire())
//
//});

var coverageEnforcer = require('gulp-istanbul-enforcer');

var paths = {
    server: {
        scripts:  ['server/src/**/*.js'],
        tests:    ['server/test/**/*.spec.js'],
        coverage: 'coverage/server'
    }
};


gulp.task('test-coverage-server', function() {
    var coverageDir = paths.server.coverage;
    gulp.src(paths.server.scripts)
        .pipe(istanbul({ // Covering files
            instrumenter: isparta.Instrumenter,
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(paths.server.tests, {read: false})
            .pipe(mocha({
                reporter: 'spec',
                compilers:'js:babel-register',
                require:['ignore-styles'] //avoids breaking on css styles
                
            }))
                .pipe(istanbul.writeReports({
                    dir: coverageDir,
                    reportOpts: {dir: coverageDir},
                    reporters: ['text', 'text-summary', 'json', 'html']
                }))
                .pipe(coverageEnforcer({
                    thresholds: {
                        statements: 80,
                        branches: 50,
                        lines: 80,
                        functions: 50
                    },
                    coverageDirectory: coverageDir,
                    rootDirectory : ''
                }))
        });
});



gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});
