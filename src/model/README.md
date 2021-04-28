# model

---

Mobex Stores for managing UI and Data states.

## UIStore

Manages state for preact UI elements

### uiStoreComponents

#### BioMapStore

Manages a BioMap (Major canvas drawn component)

#### TrackStore

Manages sub-tracks in a BioMap

#### CorrespondenceStore

Manages drawn correspondence lines between two BioMaps

## DataStore

Manages data sources and their maps

### DataStoreComponents

#### SourceStore

Manages a collection of maps from a single source

#### MapStore

Manages a single map

#### FeatureStore

A single feature on a map, a simple object, as not
intended to change after loading except "isLandmark" flag

#### ConfigStore

Manages default, source, and map configuration options

    