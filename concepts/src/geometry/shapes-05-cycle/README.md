# Shapes — Cycle By

Shift the starting vertex of a shape using a slider, with the current vertex 0 highlighted throughout.

## What you see

An asymmetric arrow shape with small dots at every vertex.  A slider at the bottom of the canvas controls the cycle offset.  As the slider moves, an orange dot jumps to whichever vertex is now index 0, and a "0" label follows it.  The shape itself never moves or changes geometry — only the starting vertex changes.  The slider snaps to discrete integer positions, one per vertex.

## Key concepts

- **`Shapes.cycleBy()`** — shifts the vertex array by a given offset using modulo arithmetic; positive values move the starting vertex forward through the array; the geometry is completely unchanged — only the index assigned to each vertex differs
- **`canvas.shapes.polygon()`** — the base shape is created once outside the reactive block; `cycleBy()` is called on it each update without allocating a new canvas object
- **Discrete slider** — the thumb's continuous x position is mapped to an integer offset with `Math.round()` and then snapped back to the exact pixel position for that stop, giving crisp discrete steps rather than a smooth but meaningless continuous value