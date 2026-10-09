# Point Attachments

Four ways to attach a pin to a shape. Most options accept a reactive value.

## How it works

The sliders return `Real` values, and these go straight into the `Attach` options. The binding then follows both the shape and the slider, without a reaction of its own. With `orientation: "relative"` the pin also points along the shape; the short dotted line shows its direction.

```ts
Attach.pointToSegment(pin, canvas.shapes.segment(segA, segB), {
    position: position,
    distance: distance,
    side: "left",
    orientation: "relative",
})
// …
Attach.pointToCircle(pin, circle, {
    angle:    angle,
    distance: distance,
    orientation: "relative",
})
```

`Attach.pointToCircle` takes the angle in radians and a radial distance, which may be negative. `Attach.pointToRectangleEdge` names the edge with `placement` and the position along it with `anchorPosition`.

## API

- `Attach.pointToSegment`: a pin at a position along a segment, optionally to one side
- `Attach.pointToCircle`: a pin at an angle on a circle, optionally outside or inside it
- `Attach.pointToRectangleEdge`: a pin at a position along one edge of a rectangle
- `Attach.pointToPoint`: a point at a fixed offset from another point
- `Attach.circleCenterToPoint`, `Attach.circleRadiusToValue`: bind a circle's center and radius
- `Values.lerp`: maps the slider ratio into the slider's range

## See also

- `reactions/attach-01-basics`
- `geometry/pins-03-placement`
