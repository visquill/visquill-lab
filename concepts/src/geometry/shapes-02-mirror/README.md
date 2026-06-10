
# Shapes — Mirror

Reflect a shape across a draggable two-point axis and watch the mirrored copy update in real time.

## What you see

An asymmetric arrow shape on the left side of the canvas.  Two orange handles define a reflection axis — the infinite line passing through both points.  A teal mirrored copy appears on the other side.  Dragging either handle rotates or shifts the axis; both shapes update instantly.  The axis line extends well beyond the handles to make clear it represents an infinite line, not just the segment between the two points.

## Key concepts

- **`Shapes.mirror()`** — reflects every vertex of a shape across the infinite line defined by two points; the line has no length limit — only its direction and position matter
- **`Shapes.centroid()`** — used here to place the shape labels at a stable central position that tracks each shape as it moves
- **Axis extension** — the visible axis line is extended far beyond the handle positions by projecting along the normalised direction vector; this makes the infinite-line semantics of `mirror()` visually explicit