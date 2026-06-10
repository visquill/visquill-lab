# Point Attachments

Four methods for attaching a point to a shape — it follows reactively when the shape moves or resizes.

## What you see

Four panels. In each, the orange dot is the attached point; its small direction indicator shows the pin's orientation. **pointToSegment** — sliders control position along the segment and perpendicular distance; drag the segment endpoints to move the whole thing. **pointToCircle** — sliders control angle and radial distance offset; drag the circle center. **pointToRectangleEdge** — slider controls the position along the top edge; drag the corner handle to resize the rectangle. **pointToPoint** — the orange follower stays at a fixed vector offset from the blue source; drag the source.

## Key concepts

- **`Attach.pointToSegment(pin, segment, { position, distance, side })`** — pins a point to a position along a segment with optional perpendicular offset; when `orientation: "relative"`, the pin's direction aligns with the segment
- **`Attach.pointToCircle(pin, circle, { angle, distance })`** — places a point on the circle's circumference at `angle` radians, offset radially by `distance`
- **`Attach.pointToRectangleEdge(pin, rect, { placement, anchorPosition })`** — attaches to a named edge (`"top"`, `"bottom"`, `"left"`, `"right"`) at a position along it
- **`Attach.pointToPoint(point, target, { offset })`** — follows the target with a fixed `[dx, dy]` offset; the simplest attachment