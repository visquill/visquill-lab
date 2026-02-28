# Single Data Type Lens

A draggable lens that counts scattered data points by category and displays the counts as a hedgehog bar chart around its perimeter.

## What you see

Colored dots scattered across the canvas — red, green, blue, orange. A circular lens with bars growing outward from its rim, one bar per color. Drag the lens to move it across the canvas and watch the bars grow and shrink reactively as points fall inside or outside the boundary. Use the buttons to animate the radius, arc span, rotation, and bar offset.

## Key concepts

- **Hedgehog path** — a polyline that follows the circle's perimeter acts as the baseline; bars grow perpendicularly outward from it, one per data category
- **`Reactive.do([lens.anchor, radius], ...)`** — the count recomputes whenever the lens moves or its radius changes; `Points.distanceToPoint()` is called for every data point to test membership
- **`Animate.follow(height, target)`** — smoothly interpolates the bar height to the new count rather than snapping instantly, giving the chart a fluid feel
- **Animated lens properties** — `radius`, `barOffset`, `startAngle`, and `radialSpan` are all reactive `Real`s; the control buttons animate them with `Animate.eased()`, and the geometry reacts automatically