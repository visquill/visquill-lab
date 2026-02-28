# Polygon Offset

`Offsets.polygon()` expands a convex polygon outward by a fixed distance, keeping all edges parallel to the original.

## What you see

Twenty draggable points whose convex hull is outlined in blue. A dashed polygon surrounds it at a constant clearance. A slider at the top controls the offset distance. Drag any point or the slider and both polygons update instantly.

## Key concepts

- **`Offsets.polygon(source, distance, outward, precision, result)`** — computes the offset in-place into `result`; the third argument switches between outward (`true`) and inward (`false`) expansion
- **Reactive `Real` as a geometry parameter** — the offset distance is stored in a `canvas.values.real()`, which can be listed as a dependency in `Reactive.do()` alongside the handles; dragging the slider writes to it and triggers the same recompute
- **Slider as a constrained handle** — the slider is a regular drag handle whose x position is clamped inside the reactive block and mapped to the distance value; no special slider API needed