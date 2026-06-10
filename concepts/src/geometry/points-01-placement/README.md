# Point Placement

Three methods for placing a point at a specific position on or beside a geometric shape.

## What you see

Three panels. In each, drag the slider to move the orange point. **placeOnCircle** — the point travels the full circumference; the angle is in radians from the positive X axis. **placeOnArc** — the point travels a partial arc defined by a start direction, end direction, and winding; ratio 0 and 1 correspond to the endpoints. **placeBesideSegment** — the point sits at a fixed perpendicular distance from the segment at a given ratio; the dashed line shows the perpendicular offset.

## Key concepts

- **`placeOnCircle(center, radius, angle)`** — places a point on the circumference at an absolute angle in radians
- **`placeOnArc(center, radius, startDir, endDir, ratio, clockwise)`** — places a point along a circular arc; the arc is defined by two direction vectors and a winding, not by angles
- **`placeBesideSegment(p1, p2, ratio, distance, left)`** — places a point perpendicular to a segment at a given ratio along it; `left` is relative to the A→B direction