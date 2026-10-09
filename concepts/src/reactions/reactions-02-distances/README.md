# Distances

Compute a measurement inside a reaction and write it into a value and a label.

## How it works

Each setup has one `Reactive.do` that lists every handle the measurement depends on. The GDK functions write into existing objects: the distance into a `Real` from `canvas.values.real()`, the closest point into a visual point that a dashed segment already connects to. `Points.midPoint` writes into the label, so the label sits halfway along the measured line.

The circle reaction first rebuilds the circle from its center handle, then measures against it:

```ts
Reactive.do([pointD, circleCenter, circleRadius], () => {
    Circles.circleAt(circleCenter, circleRadius, circle)
    Circles.closestPoint(circle, pointD, closestOnCircle)
    Circles.distanceTo(circle, pointD, distanceCircleEdge)

    Points.midPoint(pointD, closestOnCircle, labelCircle)
    labelCircle.value = `${distanceCircleEdge.value.toFixed(1)} px`
}, true)
```

## API

- `Reactive.do`: runs a function now and whenever its senders change
- `Points.distanceToPoint`: distance between two points
- `Points.distanceToSegment`: shortest distance from a point to a segment
- `Points.closestPointOnSegment`: the point on a segment closest to a given point
- `Points.midPoint`: the point halfway between two points
- `Circles.circleAt`: a circle from center and radius
- `Circles.closestPoint`: the point on a circle closest to a given point
- `Circles.distanceTo`: shortest distance from a point to a circle

## Notes

`Circles.distanceTo` is never negative: a point inside the circle gets its distance to the edge.

## See also

- `geometry/points-04-distances`
