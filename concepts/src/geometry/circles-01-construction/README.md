# Construction

Three ways to build a circle: from center and radius, from two points, or from three points.

## How it works

Each panel rebuilds its circle from its handles in one reaction. `Circles.circleAt` takes a center and a radius; here the radius is the distance to a second handle:

```ts
Reactive.do([center, radiusHandle], () => {
    const r = Points.distanceToPoint(center, radiusHandle)
    Circles.circleAt(center, r, circle)
    // …
})
```

`Circles.circle2P` treats its two points as the ends of a diameter. `Circles.circle3P` finds the one circle through three points. The center and radius are not given there, so the demo reads them back from the result:

```ts
Reactive.do([p1, p2, p3], () => {
    Circles.circle3P(p1, p2, p3, circle)
    Circles.center(circle, cLabel)
    const r = Circles.radius(circle)
    // …
})
```

## API

- `Circles.circleAt`: a circle from center and radius
- `Circles.circle2P`: a circle whose diameter runs between two points
- `Circles.circle3P`: the circle through three points
- `Circles.center`: the center of a circle
- `Circles.radius`: the radius of a circle
- `Points.distanceToPoint`: distance between two points

## Notes

Three points on one line have no circle through them: the radius grows as they line up and is `Infinity` when they are exactly on one line.

## See also

- `geometry/circles-02-sizing`
