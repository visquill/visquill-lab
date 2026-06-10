# Extremes

Find the most extreme point in a cloud — by direction or by distance from a reference.

## What you see

A shared cloud of draggable points split into two panels. **Left** — four coloured rings highlight the topmost, bottommost, leftmost, and rightmost points simultaneously. **Right** — a dark reference handle; the green ring marks the closest point to it, the red ring marks the farthest, with dashed connectors and pixel distances. Drag any cloud point or the reference handle to see the results update.

## Key concepts

- **`Extremes.topMost()` / `bottomMost()` / `leftMost()` / `rightMost()`** — scan a point sequence for the extremal coordinate; uses screen-space convention (Y increases downward, so `bottomMost` returns the largest Y)
- **`Extremes.closestTo(points, reference)`** — returns the point in the sequence nearest to `reference`
- **`Extremes.farthestFrom(points, reference)`** — the opposite; useful for bounding-circle estimates or visibility culling