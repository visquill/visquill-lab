# Attach

`Attach` keeps one object positioned relative to another, so you don't write the reaction yourself.

## How it works

Each call binds its first argument to the target once; after that it follows. Attached objects can be targets themselves: the label follows a point that follows the handle.

```ts
const follower = canvas.values.point()
Attach.pointToPoint(follower, handle, { offset: { x: 0, y: -40 } })
// …
Attach.pointToPoint(label, follower)
```

A layer anchor is a point too, so attaching it moves everything on the layer:

```ts
const group = canvas.layer("group-")
Attach.pointToPoint(group.anchor, handle)
```

The circle's radius comes from a handle. The radius value is attached once; the reaction only writes it:

```ts
const radius = canvas.values.real()
Attach.circleRadiusToValue(inner, radius)
Reactive.do([radiusHandle], () => {
    Values.max(12, Points.distanceToPoint(center, radiusHandle), radius)
})
```

## API

- `Attach.pointToPoint`: keeps a point at an offset from another point
- `Attach.pointToSegment`: keeps a pin at a position along a segment
- `Attach.shapeToPoint`: moves a shape with a point
- `Attach.rectangleToSegment`: keeps a rectangle along a segment
- `Attach.circleCenterToPoint`, `Attach.circleRadiusToValue`: bind a circle's center and radius
- `Attach.circleToCircle`: keeps a circle a fixed gap outside another
- `Values.max`, `Points.distanceToPoint`: the radius from the handle
- `Symbols.diamond`: a diamond marker around a point

## Notes

Never call `Attach` inside `Reactive.do`: each call adds a binding.

## See also

- `reactions/attach-01-basics`
- `basics/04-layers`
