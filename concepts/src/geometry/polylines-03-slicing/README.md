# Polyline Slicing

Two slider handles A and B carve the curve into three live segments: prefix, slice, and suffix.

## What you see

The same smooth curve as the other Polylines demos.  Two handles sit on a track below — drag them to reposition A and B.  The curve is immediately redrawn in three colours: grey from start → A (prefix), orange from A → B (slice), grey from B → end (suffix).  Three info labels in the top-left corner show the current A and B values and the slice length as a percentage of the full curve.

## Key concepts

- **`Polylines.slicePrefix(polyline, position, result)`** — returns the portion of the polyline from the start up to `position`
- **`Polylines.sliceSuffix(polyline, position, result)`** — returns the portion from `position` to the end
- **`Polylines.slice(polyline, startRatio, endRatio, result)`** — extracts the sub-polyline between two normalised positions; combining all three gives a complete, non-overlapping partition of the curve
- **Two handles, one track** — both handles share the same track segment and use the same `closestPointOnSegment` / `relativePositionOnSegment` pattern; the reactive block clamps A ≤ B so the slice is always valid even when the handles cross