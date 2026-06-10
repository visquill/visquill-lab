# Polygon Properties

Drag the vertices of a hexagon and watch area, perimeter, winding direction, and convexity update live.

## What you see

A six-vertex polygon with draggable handles.  Vertex 0 is highlighted in orange — the boundary is traversed from there in vertex order, which determines winding.  A green dot marks the centroid.  A metrics panel on the right shows five live readouts.

## Things to try

- **Make it concave** — drag a vertex inward past the centre.  Watch convexity toggle from "Convex" to "Concave".
- **Cross two edges** — drag a vertex far enough to self-intersect the polygon.  The oriented area changes sign even though the absolute area keeps growing.
- **Reverse winding** — rearrange vertices so the boundary travels the other way.  The winding label flips; the absolute area stays the same but oriented area flips sign.

## Key concepts

- **`Polygons.area()`** — always positive; does not reflect winding direction
- **`Polygons.orientedArea()`** — positive when counter-clockwise, negative when clockwise; sign flips when the boundary self-intersects or the winding reverses; this is what distinguishes it from `area()`
- **`Polygons.perimeter()`** — total length of all edges, including the closing edge from the last vertex back to vertex 0
- **`Polygons.centroid()`** — the geometric centre of mass of the enclosed area; stays inside a convex polygon but can approach a "waist" in a concave one
- **`Polygons.isClockwise()` / `isConvex()`** — reactive boolean properties that toggle as the shape is reshaped; winding is defined relative to the vertex order starting at vertex 0