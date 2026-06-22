# Convex Hull Baseline

Deriving a curved baseline from a polyline slice — the foundation for route-following charts.

## What you see

The same winding curve and draggable window from the Polyline Windowing demo. The windowed slice is wrapped in a convex hull (shown as a faint dashed polygon), which is then offset outward. The far side of the offset hull — the edge running roughly parallel to the slice but displaced from it — is extracted as the orange baseline. An offset slider controls how far the baseline sits from the route. Drag the window corners or the slider to see everything update live.

## Key concepts

- **`ConvexHulls.topStart(slice, hull)`** — wraps the slice vertices in a convex polygon, starting from the topmost point. The starting point matters for `Polygons.slice` later: `topStart` ensures the hull vertices are wound consistently so the boundary positions are predictable.

- **`Offsets.polygon(hull, distance, outward, smoothing)`** — expands the hull outward by `distance` pixels. The third argument (`true`) means outward; the fourth (`1`) applies one round of smoothing to the offset edges. This creates the gap between the route and the baseline where chart bars or curves would be drawn.

- **`Polygons.closestPosition` + `Polygons.slice`** — to locate the far side of the offset hull, pins at the slice start and end are rotated 90° left (perpendicular to the route direction) and stepped forward by the offset distance. `closestPosition` finds where those anchor pins land on the hull boundary; `Polygons.slice` extracts the arc between them directly into the baseline visual.

- **Why a hull rather than a direct offset of the polyline?** — offsetting a polyline directly can produce self-intersections and artefacts at sharp bends. Wrapping in a convex hull first guarantees a clean, non-self-intersecting boundary to offset from.