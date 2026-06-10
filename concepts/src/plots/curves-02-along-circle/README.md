# Curve Along Circle

A polar (radar) chart plotted against a circular baseline.

## What you see

A fixed circle in grey serves as the baseline. A light-blue filled area shows the data plotted radially outward from the circle. A darker outline sits on top of it. A single handle on the circle perimeter controls the angle offset — dragging it rotates the entire chart, showing the same dataset at different angular orientations.

## Key concepts

- **`Curves.filledAlongCircle(circle, values, angleOffset, left, result)`** — produces the closed filled polygon stitched between the circle and its radially offset curve
- **`Curves.alongCircleUniform(circle, values, angleOffset, left, result)`** — produces the offset curve itself with values distributed uniformly around the full circle; drawn on top of the filled area as the outline