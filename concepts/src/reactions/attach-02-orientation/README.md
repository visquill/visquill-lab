# Orientation Modes

Two rectangles travelling the same path — one rotates with it, one doesn't.

## What you see

Two panels sharing the same curved path. Drag the slider in either panel to move a rectangle along the path. **Left (relative)** — the rectangle rotates to align with the path's tangent at each position. **Right (absolute)** — the rectangle keeps its initial orientation regardless of the path direction.

## Key concepts

- **`Attach.rectangleToPoint(rect, pin, { orientation })`** — when the target is a pin (which carries a direction), `"relative"` rotates the shape to match that direction; `"absolute"` ignores it
- **`Polylines.pinAt(polyline, ratio)`** — samples a pin whose direction is the path tangent at that position; this is what feeds the orientation
- The same distinction applies to `shapeToPoint`, `segmentToPoint`, and `pointToSegment` — any method that accepts a pin target and an `orientation` option follows this pattern