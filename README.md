# cmap-js
Display and compare biological maps (genetic, physical, cytogenetic, genomic; linkage groups, chromosomes, scaffolds).

## Setup

* Prerequisite: `npm` is required so install https://nodejs.org/en/ if you do not have it.

* Install gulp command. If you do not have the `gulp` task runner already:
```
npm install -g gulp
```

* Install the required javascript packages listed in `package.json`
```
cd cmap-js/
npm install
```

## Build and Tests

* ES6 code is transpiled with Babel and bundled with Rollup, and the results are written into the `dist/` directory.
```
gulp                  # outputs files to dist/
gulp && gulp watch    # starts a development web server w/ auto-reload
npm test              # runs unit tests and coverage report
```
