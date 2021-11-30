// Rollup plugins
import { babel } from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import alias from '@rollup/plugin-alias';
import commonjs  from '@rollup/plugin-commonjs';
import dev from 'rollup-plugin-dev';
import  nodeResolve from '@rollup/plugin-node-resolve';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
//PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import postcssEnv from 'postcss-preset-env';
//import cssnano from 'cssnano';

const name = 'cmapjs';

const infile = 'src/main.js';

const postcssOptions = () => {
    return {
        plugins: [
            simplevars,
            nested(),
            postcssEnv({ warnForDuplicates: false, }),
           // cssnano(),
        ],
        extensions: [ '.css' ],
    };
};

const aliasOptions = () => {
    return {
        entries: [
            { find: 'react', replacement: 'preact/compat' },
            { find: 'react-dom', replacement: 'preact/compat' }
        ]
    };
};

const resolveOptions = () => {
    return {
        browser: true,
        preferBuiltins: true,
        modulesOnly: false
    };
};

const babelOptions = () => {
    return {
        ignore:[ 'node_modules/**'], //do it this way because this one node_module is in es6
        babelrc: false,
        presets: [
            ['@babel/preset-env',{ 'modules':false}],
            //["@babel/preset-react",{"pragma":"h"}]
        ],
        plugins: [
            'array-includes',
            '@babel/plugin-proposal-class-properties',
            [
                '@babel/plugin-transform-react-jsx',
                {'pragma':'h'}
            ]
        ],
        babelHelpers: 'bundled'
    };
};

const cjsOptions = () => {
    return{
        include: [
          'node_modules/**',
       ],
       extensions: ['.js','.ts','.tsx'],
       requireReturnsDefault: 'auto',
       ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
//        namedExports: {
//            'papaparse' : ['Papa'],
//            'preact' : ['preact'],
//        },
    };
};

export default [
    {
        input: infile,
        output: {
            name,
            file: pkg.module,
            format: 'esm',
            globals: {
                preact: 'preact',
            },
            //   sourcemap: true
        },
        plugins: [
            builtins(),
            // bundle css
            postcss(postcssOptions()),
            alias(aliasOptions()),
            dev(),
            nodeResolve(resolveOptions()),
            // transpile es6
            commonjs(cjsOptions()),
            babel(babelOptions()),
            injectProcessEnv({
                NODE_ENV: process.env.NODE_ENV,
                UNUSED: null
            }),
            terser(),
            process.env.WATCH === 'yes' && (
              serve({
                  historyApiFallback: true,
              })
            )
        ]
    },
    {
        input: infile,
        output: {
            name,
            file: 'build/cmap.js',
            format: 'iife',
            globals: {
                preact: 'preact',
            },
            //   sourcemap: true
        },
        plugins: [
            //     alias({
            //	    paper: 'paper/dist/paper-core'
            //  }),
            builtins(),
            // bundle css
            postcss(postcssOptions()),
            alias(aliasOptions()),
            nodeResolve(resolveOptions()),
            // transpile es6
            commonjs(cjsOptions()),
            babel(babelOptions()),
            injectProcessEnv({
                NODE_ENV: process.env.NODE_ENV,
                UNUSED: null
            }),
        ]
    },
    {
        input: infile,
        output: {
            name,
            file: 'build/cmap.min.js',
            format: 'iife',
            globals: {
                preact: 'preact',
            },
            //   sourcemap: true
        },
        plugins: [
            builtins(),
            // bundle css
            postcss(postcssOptions()),
            alias(aliasOptions()),
            nodeResolve(resolveOptions()),
            // transpile es6
            commonjs(cjsOptions()),
            babel(babelOptions()),
            injectProcessEnv({
                NODE_ENV: process.env.NODE_ENV,
                UNUSED: null
            }),
            terser(),
        ]
    },
];
