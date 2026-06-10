# Positioned Segments

Two advanced construction methods that place a segment relative to existing geometry.

## What you see

Two panels stacked vertically. **Top** — `alongSegment`: a grey base segment between two draggable endpoints; the indigo result segment runs parallel to it, offset by `distance`, trimmed by `paddingStart` and `paddingEnd`. **Bottom** — `segmentAtPoint`: an orange reference point with a direction handle; the result segment is placed at `distance` from the point, oriented along the direction, with `ratio` controlling where along the result the reference point projects. A dashed line shows the perpendicular offset.  Drag the cyan toggle handle above or below the base line to flip the side.

## Key concepts

- **`Segments.alongSegment(p1, p2, side, distance, paddingStart, paddingEnd)`** — places a segment parallel to the base, offset perpendicularly by `distance`; `paddingStart` and `paddingEnd` trim the result from each end; useful for dimension lines, annotations, and parallel rails
- **`Segments.segmentAtPoint(point, distance, dir, ratio, side)`** — constructs a segment whose closest point to `point` (at the given `ratio` along the result) is exactly `distance` away; the `ratio` parameter lets you control whether the reference anchors to the start (0), middle (0.5), or end (1) of the result