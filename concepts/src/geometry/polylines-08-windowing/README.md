# Polyline Windowing

Finding the portion of a polyline that passes through a rectangular region, expressed as a normalised [start, end] range.

## What you see

A smooth winding curve crosses a dashed rectangular window. The segment inside the window is highlighted in indigo; the portions outside are dimmed. Green and orange dots mark the exact entry and exit points on the window boundary. A label at the bottom shows the window range as percentages along the full curve. Drag either corner handle to resize or move the window — everything updates live.

## Key concepts

- **Walking vertices to find the window** — the algorithm iterates over polyline vertices and checks each one against the box using `Boxes.containsPoint`. The first and last vertices inside the box give the rough entry/exit indices. This is O(n) and sufficient for the typical case where the polyline crosses the box once.

- **Exact boundary crossing via segment intersection** — the vertex walk finds which segment crosses the boundary, but not where. `segmentBoxIntersection` tests the crossing segment against all four box edges using parametric segment–segment intersection, returning the point closest to the outside vertex. This gives sub-vertex precision for `closestPosition`.

- **`Polylines.closestPosition`** — converts a screen-space point (the boundary crossing) to a normalised position [0, 1] along the polyline. This is the bridge between the geometric intersection and the slicing API.

- **`Polylines.slice` / `slicePrefix` / `sliceSuffix`** — the three output segments are computed from the same normalised range. `slice(polyline, start, end)` extracts the windowed segment; the prefix and suffix paint the remainder in a dimmed style.

- **`Boxes.spannedBox`** — builds the smallest box containing both corner handles regardless of which handle is to the top-left. Either corner can be dragged past the other without breaking the box.
