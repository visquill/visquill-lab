# Polygon Contains Point

Drag a probe point to test whether it falls inside or outside the polygon, with live distance-to-boundary and closest-point readouts.

## What you see

A hexagonal polygon with draggable vertices and a larger probe handle.  The probe turns green when inside the polygon and red when outside.  A dashed line connects it to the nearest point on the polygon boundary, with the distance shown at the midpoint.  Reshaping the polygon by dragging its vertices updates all three readouts instantly.

## Key concepts

- **`Polygons.containsPoint()`** — ray-casting test; returns true when the probe is inside the polygon; points exactly on the boundary may return either result
- **`Polygons.closestPoint()`** — the nearest point on the polygon *boundary* to the probe, regardless of whether the probe is inside or outside; this is what the dashed line connects to
- **`Polygons.distanceTo()`** — the distance from the probe to the boundary; always non-negative with no sign flip when crossing from inside to outside — if you need signed distance you must combine it with `containsPoint()`
- **`Svg.get()`** — used here to update the probe's fill colour directly in response to `containsPoint()`, demonstrating how reactive results can drive DOM style changes alongside VisQuill's own visual system