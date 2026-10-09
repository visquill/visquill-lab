# Reactive Chains

A reaction that writes a value triggers the reactions that listen to that value.

## How it works

Three reactions form a chain. Each one reads one value and writes the next: the slider ratio `t` becomes `radius`, `radius` becomes the circle and its `area`, `area` becomes the fill colour. Moving the slider runs all three in order. The colour reaction only knows `area`; it would work the same with any other source.

```ts
Reactive.do([t], () => {
    Values.lerp(minRadius, maxRadius, t, radius)
})

Reactive.do([radius], () => {
    Circles.circleAt([cx, cy], radius, circle)
    // …
    Circles.area(circle, area)
    // …
})

Reactive.do([area], () => {
    const ratio = Math.min(1, area.value / maxArea)
    // …
})
```

The slider handle stays on its track with `Points.closestPointOnSegment`, and `Points.relativePositionOnSegment` turns its position into `t`.

## API

- `Reactive.do`: runs a function now and whenever its senders change
- `canvas.values.real`: creates a reactive number
- `Values.lerp`: the value at a ratio between two values
- `Circles.circleAt`: a circle from center and radius
- `Circles.area`: the area of a circle
- `Points.closestPointOnSegment`: the point on a segment closest to a given point
- `Points.relativePositionOnSegment`: where a point lies along a segment, from 0 to 1

## Notes

Create values with `canvas.values.real` outside the reactions and only write them inside.

## See also

- `reactions/reactions-03-values`
