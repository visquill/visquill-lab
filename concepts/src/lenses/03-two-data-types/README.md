# Two Data Types

One lens, two bar charts: the same points counted by colour on one side and by shape on the other.

## How it works

Each point has a colour and a shape. Both charts sit on the same ring, each on its own polyline. The shape chart is turned half a turn from the colour chart, so the two face each other.

```ts
const shapeRotation = lens.values.real(rotation.value + Math.PI)
Reactive.do([rotation], () => {
    shapeRotation.value = rotation.value + Math.PI
})
// …
const shapePolyline = lens.visuals.polyline("barline", 5)
Attach.polylineToCircle(shapePolyline, ring, span, {distance: 10, angle: shapeRotation})
```

One reaction counts both: once grouped by colour, once by shape. The `transpose` flag swaps the two loops, so the same function serves both charts.

```ts
Reactive.do([lens.anchor, radius], () => {
    updateBarline(colorHeights, colorLabels, (c, s) => points[c][s])
    updateBarline(shapeHeights, shapeLabels, (c, s) => points[c][s], true)
})
```

## API

- `Attach.polylineToCircle`: lays each bar baseline along the ring
- `Attach.circleRadiusToValue`: ties the ring's radius to the option
- `Attach.pointToPoint`: moves the lens layer with the handle
- `Animate.real.follow`: eases each bar height towards its count
- `Points.distanceToPoint`: the membership test

## See also

- `lenses/02-single-data-type`
