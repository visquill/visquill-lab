# Polygon Slice

Extract an arc of a polygon boundary between two positions, with wrap-around when the start ratio exceeds the end ratio.

## What you see

A hexagonal polygon whose boundary is split into two complementary arcs: the selected slice from A → B (orange, thick) and the remainder from B → A (dimmed).  Two drag handles project onto the boundary via `closestPosition()` — drag them to move the slice endpoints.  Ratio labels on each handle show the current 0–1 position.  When the orange arc wraps past vertex 0, a "↺ wrap" indicator appears there.

## Key concepts

- **`Polygons.slice(polygon, startRatio, endRatio)`** — extracts the boundary arc from `startRatio` to `endRatio` travelling forward; when `startRatio > endRatio` the arc wraps around past vertex 0 rather than stopping — this is impossible with `Polylines.slice()`, which requires a non-decreasing range
- **`Polygons.closestPosition()`** — projects a point onto the boundary and returns its 0–1 ratio; used here to map each drag handle's free-space position to a boundary ratio that feeds into `slice()`
- **`Polygons.pointAt()`** — converts a ratio back to a 2-D coordinate for the boundary marker visuals
- **Complementary slices** — `slice(A, B)` and `slice(B, A)` together cover the full boundary; drawing both makes it immediately clear which portion is selected and which is not