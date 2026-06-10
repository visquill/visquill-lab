# Polyline Smoothing

Seven draggable handles define a coarse polyline. Five overlaid curves show what `Polylines.smooth()` produces at 0, 1, 2, 4, and 8 iterations.

## What you see

Dark handles connected by the raw (0-iteration) polyline. Four additional curves in different colours show the same polyline after progressively more Chaikin passes. A slider at the bottom highlights one curve at a time so you can inspect each level individually. Drag any handle and all five curves update instantly. The top-left labels show the highlighted iteration count and the approximate vertex count at that level.

## Key concepts

- **`Polylines.smooth(polyline, iterations, result)`** — applies Chaikin's corner-cutting algorithm: each pass replaces every edge with two new points at 25% and 75% along it, roughly doubling the vertex count. Start and end points are preserved. More iterations produce a rounder, smoother curve that converges toward a quadratic B-spline.
- **`Polylines.polyline(vertices)`** — constructs a polyline from an iterable of points; used here to assemble the raw polyline from the handle positions each time a handle moves.
- **Reactive with multiple dependencies** — `Reactive.do(handles, ...)` fires whenever *any* handle in the array moves, rebuilding all five curves in a single block.