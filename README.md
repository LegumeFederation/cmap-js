# cmap-js
Display and compare biological maps (genetic, physical, cytogenetic, genomic; linkage groups, chromosomes, scaffolds).

## Setup

* Prerequisite: `npm` is required so install https://nodejs.org if you do not have it.

* Install the required javascript packages listed in `package.json`
```
cd cmap-js/
npm install
```

## Build and Tests

* ES6 code is transpiled with Babel and bundled with Rollup, and the results are written into the `build/` directory. Here are some of the available scripts
```
npm run lint     # runs linter only
npm run build    # linter and rollup, babel
npm run test     # mocha test runner
npm run coverage # mocha and istanbul coverage report
npm run watch    # build, watch and livereload
```
