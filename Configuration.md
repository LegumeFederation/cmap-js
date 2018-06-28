#cmap-js Start Guide
## Table of Contents
+ [Setup](#Setup) 
+ [cmap.json](#cmap.json) 
+ [Configuration](#Configuration)

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
- cmap-js may be run locally using the command
	```
    npm run watch
    ```
    This starts the development server, and assuiming there are no issues
    with the build process, this should start a cmap-js server that can be
    reached at `localhost:8888`

##cmap.json
The cmap.json file is the core of configuring cmap.js an example file looks like: 
```
  "#": "cmap-js example configuration file (json format)",
  "header" : ": soybean and common bean genomes and genetic maps",
  "attribution" : "data attribution: soybase, LIS",
  "initialView" : [ {
     "source" : "pv_consensus",
     "map" : "Pv02",
     "tracks":[
       {
        "type: 'qtl',
        "position" : 1,
        "filters":["QTL_seed","QTL_other-seed"],
        "fillColor": "orange".
       }
     ]     
    }, {
      "source" : "pv_genome",
      "map" : "phavu.Chr02",
      "tracks" : [
       {
        "type": "manhattan",
        "dataId" : "manhattan_test",
        "displayWidth" : 50,
        "maxValue" : 6,
        "width" : 2,
        "rulerMajorMark" : 10,
        "rulerMinorMark" : 2,
        "posField" :"Pos",
        "targetField" : "Chr",
        "pField" : "p",
        "lines" : [
          {
            "value": 5,
            "lineWeight": 3,
            "lineColor": "red"
          },
          {
            "value": 2,
            "lineWeight": 3,
            "lineColor": "blue"
          }
        ]
       }
      ]
    }
  ],
  "sources" : [ {
      "id" : "pv_consensus",
      "method": "GET",
      "url": "data/PvConsensus_GaleanoFernandez2011_a.cmap",
      "filters" : [],
      "config": {
        "url" : "config/phavu_genes.json",
        "method":"GET",
        "data":{}
      },
      "linkouts" : [
        {
            "featuretypePattern" : "QTL",
            "url" : "https://legumeinfo.org/feature/Phaseolus/vulgaris/QTL/phavu.${item.id}",
            "text" : "View QTL info at LIS"
        },
        {
            "featuretypePattern" : "^(SSR|SNP|AFLP|STS|RAPD)$",
            "url" : "https://legumeinfo.org/feature/Phaseolus/vulgaris/genetic_marker/${item.id}",
            "text" : "View marker at LIS"
        }
      ]
    }, {
      "id" : "pv_genome",
      "method": "GET",
      "url": "data/phavu.collinearity+genes+markers.cmap",
      "filters" : [],
      "config": {
        "url" : "config/phavu_genes.json",
        "method":"GET",
        "data":{}
      },
      "linkouts" : [
        {
            "featuretype" : "gene",
            "url" : "https://legumeinfo.org/gene_links/${item.id}/json",
            "isLinkingService" : true
        }
      ]
    },
    {
      "id" : "manhattan_test",
      "method": "GET",
      "url" : "data/sample2.txt",
      "filters" : []
    }
  ]
}
```

The sub-components of the format are:
`#`: comment
`header` : Header line to display
`attribution` : Data attribution footer
`initialView` : One or more maps and their initial configuration to display as the starting view
`sources` : Array of data sources to grab map information from

##Initial View
Initial View has the following additional settings:

| Setting | Description |
|---------|-------------|
|`source` * | Which of the sources to usefor this view's data |
|`map`*| Which map to display from the data source above |
|`tracks`| An array of data tracks to display |
Settings marked with a \* are  **REQUIRED**

All `tracks` currently have the following shared options: 

|Setting  | Description |
|---------|-------------|
|`type` * | Track type: currently `qtl` or `manhattan` |
|`position`| Which side of the backbone to display map on `-1` LHS, `1` RHS |
|`title`| Title the for the track |

##### Qtl

`qtl` style tracks require the following options:

| Setting | Description |
|---------|-------------|
|`filters` \*\* | Array of tags to populate qtl track with |
|`fillColor` \*\* | Array of colors to draw filtered qtl elements |

The default title for a `qtl` track is the first entry in the filters array

##### Manhattan
`manhattan` style tracks require the following options:

| Setting | Description |
|---------|-------------|
|`dataId`  | Source file for gwas data |
|`posField` | field in source file to base starting position |
|`pField` | field in source file to get pvalue from |
|`targetField` | field in source file to get target map from |
|`lines` | array of line objects to draw reference lines |
|`lines.value` | -log10(p) value to draw constant value line |

The default title for a `manhattan` track is 'manhattan'

Both track types also may be passed in any of the configuration elements supported by the track style.


####Sources
---
Sources are the data models for displaying data. Currently only CMAP format data is officially supported

| Setting | Description |
|---------|-------------|
|`id` * | Tag to identify source when setting up a view |
|`method` *| REST Call to get data, should always be `GET` |
| `url` * | location of file, may be a local or remote URL |
|`filters`| Advanced filtering |
|`config`| File to find source's custom configuration settings, similar requriements for configuration|
|`linkouts`| Custom linkouts to attach to the data model for each map |

Settings marked with a \* are  **REQUIRED**

## Configuration
A configuration file has the following format:
```
{
  "default":{
    "ruler" : {
      "width" : 10,
      "fillColor" : "aqua"
    },
    "backbone":{
      "width":20
    }
  },
  "Pv02":{
    "backbone":{
      "width" : 60
    },
    "invert":true
  }
}
```
`default` is the fallback configuration to use for all maps of the associated data model, otherwise you can tweak the defaults on a per-map basis by the map name.

The default configuration object is:

```
{
  'backbone' : {
    'width' : 20,
    'fillColor' : '#fff6e8',
    'lineWeight' : 0,
    'lineColor' : 'black'
  },
  'ruler' : {
    'width' : 10,
    'padding' : 5,
    'fillColor' : 'aqua',
    'lineWeight' : 0,
    'lineColor' : 'black',
    'labelFace' : 'Nunito',
    'labelSize' : 12,
    'labelColor' : 'black',
    'innerLineWeight' : 1.0,
    'innerLineColor' : 'black',
    'precision' : 2,
    'steps' : 100
  },
  'track' : {
    'width' : 5,
    'padding' : 5,
    'fillColor' : '#636081',
    'lineWeight' : 0,
    'lineColor' : 'black',
    'labelFace' : 'Nunito',
    'labelSize' : 12,
    'labelColor' : 'black',
    'internalPadding' : '5'
  },
  'marker':{
    'lineWeight' : 1,
    'lineColor' : 'black',
    'labelFace' : 'Nunito',
    'labelSize' : 12,
    'labelColor' : 'black',
    'filter' : []
  },

  'manhattan' :{
    'width' : 2,
    'fillColor':'green',
    'lineWeight':1,
    'lineColor':'black',
    'labelFace' : 'Nunito',
    'labelSize' : 10,
    'labelColor' : 'black',
    'displayWidth' : 50,
    'featureLineWeight' : 3,
    'featureLineColor' : 'red',
    'rulerWeight' : 2,
    'rulerColor' : 'black',
    'rulerMajorMark':10,
    'rulerMinorMark':2,
    'position; : 1,
    'type': 'manhattan'
  },
  'qtl':{
    'width': 5,
    'fillColor': 'green',
    'labelSize': 12,
    'labelFace': 'Nunito',
    'labelColor': 'black',
    'labelPosition': 'feature',
    'trackMinWidth' : 50,
    'internalPadding': 5,
    'position' : 1,
    'type' : 'qtl'
  },
  'invert': false,
}
```

Options are defined as:

| Option | Modifies|
|--------|---------|
| width | Width of an individual feature of this type|
| fillColor | Fill color for track, same as canvas `fillStyle` |
| lineWeight | Width of border line in px |
| lineColor | `fillStyle` of border line |
| labelFace | Font to use for labels |
| labelColor | color of label |
| labelSize | fontsize of label |
| labelPosition | where to draw the label ['none' or 'feature'] |
| padding | left/right spacing of whole track |
| innerLineWeight | weight of the inner ruler line |
| innerLineColor | color of the inner ruler line |
| preision | number of decimal places to display on ruler position labels |
| steps | number of zoom steps ruler has when using mouse wheel zoom |
| featureLineWeight | weight of solid line for manhattan track |
| featureLineColor | color of mahnattan line |
| rulerWeight | weight of solid lines for manhattan ruler |
| rulerColor | color of solid lines for manhattan ruler |
| rulerMajorMark | interval which to add line with label |
| rulerMinorMark | interval which to add line |
| trackMinWidth | minimum width for QTL track |
| position | display on right (1) or left (-1 ) of backbone|
| internalPadding | spacing between elements within track |
| invert | flip upper and lower values of track for display |
| filter | array of strings to match tags |

`marker:filter` If no strings are passed, defaults to any feature that
has a length of < .00001.
This does occasionally populate map backbones
with unwanted markers.
