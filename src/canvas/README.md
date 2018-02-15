# Canvas
`src/canvas/` contains user-interface elements based on Canvas graphics API.
There are:
* multiple canvas DOM elements, drawn offscreen and composited.
* the src/canvas classes are organized into a "scenegraph" with parent-child
  relationships.
  
## Directory Contents
`/canvas` - Top level drawing entities that bind a canvas context
`/layout` - Grouped entities
`/geometry` - Individual constituent geometries of a layout

## Node Classes:
* `SceneGraphNodeBase` - base node that all others are based on.
* `SceneGraphNodeGeometry` - node that houses an element to be drawn.
  * `line`
  * `rectangle`
* `SceneGraphNodeTrack` - glorified group that allows for track types (Map, QTL &c)
  * `MapTrack` - replaces _layout of `BioMap`
* `SceneGraphNodeGroup` - node that contains sub-nodes that are handled as part
  of the same overall drawn geometry. SceneGraphNodeGroup could be extended to be a "track" style node setup for drawing complex groups of items, such as FeatureMap.
* `SceneGraphNodeCanvas` - top level node for a given canvas
  * `BioMap` - A Canvas that contains at minimum a 'MapTrack' (mapbackbone + markers)
  * `CorrespondenceMap` - A Canvas that contains only a Corresponence Map
* `SceneGraphNodeRoot` - NOT REIMPLEMENTED: SceneGraphNodeBase with explicit 0,0 top and left. Used for navigating rtrees between canvases.
* `SceneGraphNodeText` - NOT IMPLEMENTED: Like Geometry, but for text items.

## Notes about how canvas draws:
When canvas is drawing paths (ctx.path()/ctx.stroke(), ctx.strokeRect() and related) when you change the strokeWidth, the stroke width is split equally above and below the stroke points. Don't forget to set bounding boxes accordingly when drawing new geometries.
