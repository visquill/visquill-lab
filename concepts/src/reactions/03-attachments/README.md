# Attachments

How `Attach.*` methods bind elements to a segment without manual `Reactive.do()` wiring.

## What you see

A draggable segment with four things pinned to it: a follower dot offset from one endpoint, a diamond at the midpoint, a diamond at position 0.25 along the segment, and a dot pushed perpendicularly to one side. A rectangle spans the full length of the segment, growing perpendicularly from it. Drag either endpoint and everything repositions automatically.

## Key concepts

- **`Attach.pointToSegment()`** — pins a point to a position along a segment defined by a ratio, with optional perpendicular offset and side; the binding is reactive with no extra code
- **`Attach.pointToPoint()`** — follows one point to another with an optional fixed offset; used here to keep labels next to their targets as the segment moves
- **`Attach.rectangleToSegment()`** — stretches a rectangle along the full length of a segment and grows it perpendicularly by a given height
- **`Attach.*` vs `Reactive.do()`** — `Attach` methods are declarative shortcuts for common geometric bindings; they set up the reactive wiring internally so you don't have to