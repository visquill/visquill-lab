# Circle Construction

Three ways to construct a circle, side by side.

## What you see

Three panels. **circleAt** — drag the centre or radius handle; the radius label updates. **circle2P** — drag either diameter endpoint; the circle passes through both. **circle3P** — drag any of the three vertices of the triangle; the circumscribed circle updates. Making the three points collinear causes the circle to degenerate.

## Key concepts

- **`circleAt(center, radius)`** — explicit centre + radius; the most direct construction
- **`circle2P(p1, p2)`** — the two points are diameter endpoints; the centre is their midpoint
- **`circle3P(p1, p2, p3)`** — the unique circle passing through all three points (circumscribed circle); `Circles.center()` and `Circles.radius()` read back the computed geometry