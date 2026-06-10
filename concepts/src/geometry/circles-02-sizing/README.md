# Inflate & Scale

Two ways to resize a circle, side by side.

## What you see

A dashed base circle in the centre. The **delta** slider (left) controls `inflate` — the indigo circle grows or shrinks by that many pixels. The **factor** slider (right) controls `scale` — the orange circle's radius is multiplied by that factor. Labels above and below the base circle show the resulting radius as you drag.

## Key concepts

- **`Circles.inflate(circle, delta)`** — adds `delta` to the radius; negative values shrink the circle; the change is absolute and independent of the current size
- **`Circles.scale(circle, factor)`** — multiplies the radius by `factor`; the change is relative, so the same factor produces a larger absolute change on a bigger circle
- **`Circles.radius(circle)`** — reads back the radius of the result, used here to position the labels and display the value