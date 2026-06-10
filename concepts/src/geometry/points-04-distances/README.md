# Distance Types

Three distance measurements that look similar but behave differently.

## What you see

Three panels. **distanceToSegment** — drag the blue point near or past the segment ends; the connector always snaps to the nearest endpoint when the point is beyond the segment. **distanceToLine** — same segment, but treated as an infinite line; drag past the ends and the connector follows the line's extension. **horizontalDistance & verticalDistance** — two handles with indigo (horizontal) and green (vertical) legs forming a right-angle triangle; the diagonal label shows `distanceToPoint` for comparison.

## Key concepts

- **`distanceToSegment(p, segment)`** — shortest distance to a finite segment; clamps to the nearest endpoint when `p` is outside the segment's extent
- **`distanceToLine(p, line)`** — perpendicular distance to an infinite line through the segment's endpoints; the connector can land beyond the endpoints
- **`horizontalDistance(p1, p2)`** — the absolute difference in X coordinates; always ≤ `distanceToPoint`
- **`verticalDistance(p1, p2)`** — the absolute difference in Y coordinates; always ≤ `distanceToPoint`