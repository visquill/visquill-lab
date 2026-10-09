# Sampling

Read the point, direction and normal at any position along a polyline.

## How it works

The curve is `Polylines.smooth` applied to a few control points. All sampling uses a ratio from 0 (first vertex) to 1 (last vertex), measured along the length:

```ts
Reactive.do([position], () => {
    const pt = Polylines.pointAt(polyline, position)
    Circles.circleAt(pt, 6, sampleDot)

    const dir = Polylines.directionAt(polyline, position)
    Points.copy(pt, dirStart)
    Vectors.add(pt, Vectors.scale(dir, arrowLength), dirEnd)

    const nrm = Polylines.normalAt(polyline, position, true)
    // …
})
```

The direction is a unit vector along the curve. The normal is turned 90° to the left of it (`true`) or to the right. `Vectors.angle` turns both into the angles shown at the top left.

## API

- `Polylines.smooth`: rounds a polyline by cutting its corners
- `Polylines.pointAt`: the point at a ratio along a polyline
- `Polylines.directionAt`: the unit direction at a ratio
- `Polylines.normalAt`: the unit normal at a ratio, to the left or right
- `Vectors.angle`: the angle of a direction

## See also

- `geometry/polylines-06-batch-sampling`
- `geometry/arcs-02-sampling`
