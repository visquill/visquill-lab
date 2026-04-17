# Changelog

All notable changes to this project will be documented here.

## [1.0.0-alpha.2] — 2026-04-17

### Concepts

**New animation demos:**
- `03-planets` — point animation using `Animate.moveTo` and `Animate.followPoint`; a courier token hops between draggable planets with a ghost trail showing the lag between eased and exponential interpolation
- `04-waveform` — one-shot shape morph using `Animate.morph`; a polyline cycles through flat, sine, square, and sawtooth waveforms with easing matched to each shape's character
- `05-breathing` — looping shape morph using `Animate.sequenceShape`; a polygon breathes between a relaxed near-circle and a sharp star with no state machine needed
- `07-radar-charts` — stacked radar charts as draggable nodes; three charts share a reactive data binding and animate geometry transitions with `Animate.eased`

**New maps category:**
- `01-basics` — combining a VisQuill SVG scene with a MapLibre GL JS map; demonstrates DOM layering, pointer-event routing, glass pane drag isolation, wheel forwarding, and live coordinate labels

**Renamed animation demos** to use numeric prefixes for consistent ordering:
- `easing` → `01-easing`
- `state-machine` → `02-state-machine`
- `text` → `06-text`

**Renamed lens demos** to use numeric prefixes:
- `masked-background` → `01-masked-background`
- `single-data-type` → `02-single-data-type`
- `two-data-types` → `03-two-data-types`

### Blueprints

- `Integers` options class added — cycles through integer values; useful for count, index, or discrete numeric controls
- `labelsAtRectangles` — `distance` option now accepts `Real[]` for per-label dynamic positioning
- `labeledHedgeHogBars` — `valueLabels.distance` now accepts `Real[]`; added `valueLabelDistance` field to the `Bar` interface
- `attachBarPlot` — new `reactiveDistance` flag on `valueLabels`; when enabled, creates individual reactive `Real` values per bar for dynamic label positioning
- `DataLens` — exposed `expandedRadius` as a reactive `Real` on the lens; `rimRadius` during collapse now interpolates from `expandedRadius` instead of the static scheme value
- `BarPlotScheme` — removed `maxHeight`, `maxValue`, `minValue` fields; value-to-height mapping is now the caller's responsibility. Added `distance` field to `gridLines`

### Explorer

- `VisQuill.disposeAll()` called before loading a new demo and on tab switch, preventing stale reactive networks from accumulating between demos
- Links in demo README files now open in a new tab (`target="_blank"`)
- Added `maplibre-gl` dependency

### Other

- Updated license note in `README.md` — clarified that the repo (demos, blueprints, explorer) is MIT licensed, while the GDK package itself is not
- `.gitignore` — added `visquill-visquill-gdk-*.tgz` to ignore local pack artifacts
- All sub-packages bumped to `1.0.0-alpha.2` and updated GDK dependency to `^1.0.0-alpha.2`

---

## [1.0.0-alpha.1] — 2026-02-27

First public release.

### Concepts
- Basics — Hello World, shapes and styles
- Reactions — reactive values, distances
- Animations — easing functions, text animation
- Geometry — convex hull

### Blueprints
- Controls — buttons, toggle buttons, options panels
- Decoration — labels along polylines, labels at rectangle edges
- Plots — hedgehog bar charts along paths
- Data Lens / Lens Kit — interactive data lens components

### Explorer
- Browser-based viewer with split canvas/source view
- Build-time manifest generation and per-demo ES module bundling
- Syntax highlighting via Prism
- Markdown rendering for demo descriptions using the package marked