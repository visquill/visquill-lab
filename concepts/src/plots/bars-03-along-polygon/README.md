# Bars Along Polygon

One bar per edge of a closed polygon, including the closing edge.

## What you see

A regular hexagon with six draggable vertices. A bar grows from every edge, including the closing edge from the last vertex back to the first. Drag any vertex to reshape its two adjacent edges and see both bars update. The key difference from the polyline variant: every edge always has a bar — there is no open end.

## Key concepts

- **`Bars.fromSegment(p1, p2, value, left, result)`** — same call as the polyline variant; the closing edge is handled by wrapping the index with `(i + 1) % vertexCount`