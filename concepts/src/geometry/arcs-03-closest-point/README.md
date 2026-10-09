# Closest Point

Find the point on an arc nearest to any other point, and how far away it is.

## How it works

`Arcs.closestPoint` projects the query point onto the arc. If the projection falls outside the arc's angle range, it returns the nearer endpoint, not a point on the rest of the circle. `Arcs.distanceTo` gives the distance to that point.

```ts
Reactive.do([arc, query], () => {
    const closest = Arcs.closestPoint(arc, query)
    const dist    = Arcs.distanceTo(arc, query)

    Circles.circleAt(closest, 5, closestDot)

    Points.copy(query,   connector.at(0))
    Points.copy(closest, connector.at(1))
    // …
})
```

## API

- `Arcs.closestPoint`: the point on an arc nearest to a given point, clamped to the endpoints
- `Arcs.distanceTo`: distance from a point to an arc
- `Arcs.arcAt`: an arc from center, radius, start angle and sweep
- `Points.midPoint`: places the distance label halfway along the connector

## See also

- `geometry/polylines-02-closest-point`
- `reactions/reactions-02-distances`
