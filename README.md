# cmap-js

Display and compare biological maps (genetic, physical, cytogenetic, genomic;
linkage groups, chromosomes, scaffolds).

## Setup

Prerequisite: `npm` is required so install [NodeJs](https://nodejs.org) if you
do not have it. `npm` is used as javascript package manager and task runner
here.

- Clone the project and initialize git submodule(s):

  ```
git clone https://github.com/ncgr/cmap-js.git
cd cmap-js
git submodule init
git submodule update
  ```

- Install the required javascript packages listed in `package.json`

  ```
npm install
  ```

## Build and Tests

ES6 code is transpiled with Babel and bundled with Rollup, and the results are
written into the `build/` directory. Here are some of the available scripts:

```
npm run lint     # run linter only
npm run build    # linter and rollup, babel
npm run test     # mocha test runner
npm run coverage # mocha and istanbul coverage report
npm run watch    # build, watch and livereload
```

## Configuration File

The `cmap.json` file has configuration parameters such as data sources, page
header, and data attribution, etc. The javascript app will fetch `cmap.json`
from the root of the server. The format of `cmap.json` is specified in
`cmap-schema.json`. You can test your config file versus the schema with:

```
npm run validate-config  # run ajv to validate cmap-schema.json with cmap.json
```
