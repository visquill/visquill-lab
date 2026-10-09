# Closest Point

Project a point onto a polyline: the nearest point, its distance, and its position along the line.

## How it works

`Polylines.closestPoint` writes the nearest point on the curve into a point value. The connector was created once between the handle and that value, so it follows both. `Polylines.distanceTo` gives the length of the connector, and `Polylines.closestPosition` gives the ratio (0 to 1) of the closest point along the curve:

```ts
Reactive.do([handle], () => {
    Polylines.closestPoint(polyline, handle, closestDot)
    Circles.circleAt(closestDot, 6, closestDotMarker)

    const dist = Polylines.distanceTo(polyline, handle)
    const pos = Polylines.closestPosition(polyline, handle)
    // …
})
```

## API

- `Polylines.closestPoint`: the point on a polyline nearest to a point
- `Polylines.distanceTo`: distance from a point to a polyline
- `Polylines.closestPosition`: the ratio of that nearest point along the polyline
- `Polylines.smooth`: rounds the control polyline

## See also

- `geometry/arcs-03-closest-point`
- `geometry/polygons-03-containment`
