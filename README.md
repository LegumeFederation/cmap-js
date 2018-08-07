# cmap-js
```
CMAP-JS IS SOFTWARE STILL IN DEVELOPMENT. FEATURES AND LAYOUT ARE SUBJECT
TO CHANGE WITHOUT NOTICE. PLEASE LEAVE FEEDBACK WITH THE PROJECT IF YOU
HAVE ANY REQUESTS FOR ADDED FEATURES OR INTERFACE CHANGES SO THAT THEY CAN
BE CONSIDERED.
```

Display and compare biological maps (genetic, physical, cytogenetic, genomic;
linkage groups, chromosomes, scaffolds).

```
Due to workflow, the master branch reflects the state of the most current tag.
If you find any issues, please check out the develop branch and see if the error
persists before opening an issue. 
```

## Setup

```
IMPORTANT NOTE:
The build process used to build cmap-js has been known to fail under node v9.x.x. It is reccomended that until
the problem is fixed, to use the current LTS branch, v8.11.3 when building the software. If you haven't already, a version manager such as nvm (https://github.com/creationix/nvm) or n (https://www.npmjs.com/package/n) is highly recommended when working with node.
```

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
### Potential Issues
There has been a report of node getting stuck during install on macOS. This is
not a cmap-js issue, but should be fixable following the directions found [here](http://osxdaily.com/2016/07/26/fix-stuck-pkg-verifying-installer-mac-os-x/).

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

Watch script has only been tested on macOS systems, and may not work on other
platforms.

## Configuration File

The `cmap.json` file has configuration parameters such as data sources, page
header, and data attribution, etc. The javascript app will fetch `cmap.json`
from the root of the server. The format of `cmap.json` is specified in
`cmap-schema.json`. You can test your config file versus the schema with:

```
npm run validate-config  # run ajv to validate cmap-schema.json with cmap.json
```

## Using CMAP-JS
Clicking on a marker or a QTL region will bring up a popup with more 
information about whatever is clicked on. This may have one-or-more features
if density is high enough.

Clicking on the aqua position bar and dragging will pan the current backbone
position if you are zoomed in at all.

If you click-and-drag, a box will appear. Ending the drag will have two
different behaviors, depending on the selected area.

If the position bar isn't included in the selected area, a popup will appear
with all the elements that occur in selected region.

If the position bar is included in the selected area, the view will zoom to
the selected region.

Zoom may also adjusted by using the mouse wheel, similar to Google Maps.

Using the white boxes with arrows at the top of a map swaps map position with
its neighbor. Maps may be added and removed from display using the as labeled
buttons.

## URL Control

You can override which maps are displayed initally using a query string of the
form:

```
cmaproot/?view=view1&view=view2&...
```
Having an empty query string, or not providing any views will cause cmap to 
display the default initial view, otherwise cmap will attempt to match the map 
by name, and then display matches in order. 

Any name that is duplicated will default to the first match. The displayed view
will match the configuration for that specific map, not the view defined in the
initialView section of the configuration.

More robust query string control of the view will be added as development continues. 

## Known Issues

+ Manhattan style plots can **not** be added through the configure/add track menu.
+ Configuration menu will not display configuration of current tracks, however tracks
may still be configured in the same way as in the `cmap.json`, overwriting existing tracks.

