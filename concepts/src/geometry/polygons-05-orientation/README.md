# Polygon Vertex Orientations

Tangent bisector and outward normal at every vertex of a draggable polygon.

## What you see

A regular hexagon with draggable vertices. At each vertex a green arrow shows the orientation (tangent bisector of the two adjacent edges) and a purple arrow shows the outward normal. Drag a vertex to create a sharp corner and watch the bisector split the interior angle evenly while the normal stays perpendicular to it. Dragging a vertex nearly collinear with its neighbours causes the bisector to fall back to the outgoing edge direction.

## Key concepts

- **`Polygons.vertexOrientation(polygon, i)`** — returns the normalised tangent bisector at vertex i; at near-straight corners it falls back to the outgoing edge direction
- **`Polygons.vertexNormal(polygon, i, true)`** — returns the outward normal at vertex i, perpendicular to the bisector; the boolean controls which side is considered outward