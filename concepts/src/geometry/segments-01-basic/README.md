# Segment Basics

Two ways to construct a segment, with live measurement annotations.

## What you see

Two panels. **Left** — a segment between two draggable endpoints; labels show total length, horizontal component, vertical component, and midpoint. A slider controls the `pointAt` ratio, sliding a green marker along the segment. **Right** — `directedSegment`: one handle sets the origin, the other defines the direction vector; the segment extends exactly that far and shows its normalised direction components.

## Key concepts

- **`Segments.segment(p1, p2)`** — the standard two-endpoint construction
- **`Segments.directedSegment(p, dir)`** — constructs from an origin and a direction vector whose magnitude sets the length; useful when you know direction and length rather than both endpoints
- **`Segments.len()`**, **`Segments.horizontalLength()`**, **`Segments.verticalLength()`** — geometric length and its axis projections
- **`Segments.midPoint()`** — the point equidistant from both endpoints
- **`Segments.pointAt(segment, ratio)`** — samples any point along the segment; `0` → start, `1` → end
- **`Segments.direction()`** — returns the unit direction vector from start to end