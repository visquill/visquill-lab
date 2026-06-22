# Data Layers

Rendering dense point data with MapLibre circle layers while keeping interactive UI in the SVG overlay.

## What you see

A map of Europe with two sets of points: capitals (indigo, visible from zoom 4) and major cities (blue, appearing at zoom 6). A zoom readout in the top-left corner shows the current zoom level and whether the cities layer is visible. Zooming in causes the city points to appear without any JavaScript toggle — MapLibre handles it via `minZoom`.

## Key concepts

- **SVG for UI, WebGL for data** — the zoom label is a VisQuill SVG element; the point markers are MapLibre circle layers rendered on the WebGL canvas. The two coexist in the same container with no conflict. This is the right split for dense data: SVG overhead per element is too high for hundreds of points, but MapLibre renders them cheaply as a batch.

- **`addGroup` + `setGroupPoints`** — `addGroup` creates an empty, updatable circle layer with style options (color, radius, opacity, minZoom). `setGroupPoints` populates it. Separating creation from population means the data can be swapped later (on filter changes, zoom events, async loads) without removing and re-adding the layer.

- **`minZoom` as the visibility threshold** — both layers receive their data upfront. MapLibre itself suppresses the cities layer below zoom 6 via `minZoom`. No JavaScript visibility logic is needed; the threshold is declared once at layer creation.

- **`map.map!.once("load")`** — MapLibre requires the style to be fully loaded before sources and layers can be added. `once("load")` is the correct hook; adding layers before it fires throws an error. `map.map` is the public MapLibre instance exposed by `MapAdapter`.

- **`onMove` for the zoom label** — the label reads `map.getZoom()` and updates on every pan and zoom frame via `map.onMove`. The SVG label and the WebGL layers respond to the same map events independently.