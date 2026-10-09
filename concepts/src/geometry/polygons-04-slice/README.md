# Slice

Cut a piece out of a polygon's boundary between two ratios, also across vertex 0.

## How it works

A ratio is a position along the boundary: 0 at vertex 0, 1 after one full round. `Polygons.closestPosition` turns each free handle into the ratio of its nearest boundary point, and `Polygons.pointAt` turns the ratio back into a point for the marker:

```ts
Polygons.closestPosition(polygon, handleA, ratioA)
Polygons.pointAt(polygon, ratioA, markerA)
```

`Polygons.slice` returns the boundary from the first ratio to the second as an open polyline. If the start is greater than the end, it runs on past vertex 0. Swapping the two ratios gives the rest of the boundary:

```ts
Polygons.slice(polygon, ratioA, ratioB, sliceArc)
Polygons.slice(polygon, ratioB, ratioA, remainArc)
```

## API

- `Polygons.slice`: the boundary between two ratios as a polyline; wraps past vertex 0 when start > end
- `Polygons.closestPosition`: the ratio of the boundary point nearest to a point
- `Polygons.pointAt`: the boundary point at a ratio
- `Polygons.polygon`: writes vertices into a polygon

## See also

- `geometry/polylines-03-slicing`
