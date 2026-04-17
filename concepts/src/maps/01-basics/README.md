# MapLibre + VisQuill

Combining a VisQuill SVG scene with a MapLibre map using a pointer-event routing strategy.

## What you see

A MapLibre map with a draggable handle floating over it in screen space. The handle is not reprojected when the map pans or zooms — it stays where it is. Two labels follow the handle and update reactively: one shows its pixel position on screen, the other shows the corresponding geographic coordinates. The world label also updates when the map moves, since the same screen position maps to a different lat/lng after a pan or zoom.

## Key concepts

- **DOM layering** — `mapDiv` (z-index 1) and `sceneDiv` (z-index 2) share the same footprint inside `container`; the SVG floats visually on top but is invisible to pointer events by default
- **Three-layer pointer routing** — `sceneDiv`, the SVG root, and all purely visual SVG elements are `pointer-events:none`; only interactive elements (handles, buttons) opt in with `pointer-events:all` in CSS; this lets the map receive all input by default
- **Glass pane** — a transparent `RvgBox` covering the full frame; normally `pointer-events:none`, it switches to `all` while a handle drag is active so the map cannot pan underneath; released immediately on drag end
- **Wheel forwarding** — wheel events landing on SVG elements with `pointer-events:all` are re-dispatched onto the MapLibre canvas element so scroll-to-zoom always works
- **Two update sources for the world label** — the screen label only needs to update when the handle moves; the world label must also update when the map moves, because the same pixel position corresponds to a different lat/lng after a pan or zoom; `updateWorldLabel` is therefore called from both `Reactive.do([markerHandle], ...)` and `map.onMove()`