# Circle Attachments

Attach a circle, a polygon or a polyline to a circle.

## How it works

Each panel's circle has its center and radius attached to values. A reaction writes the handle's distance into the radius value; everything attached to the circle follows.

```ts
const radius = canvas.values.real(baseRadius)
Attach.circleCenterToPoint(circle, canvas.values.point([cx, cy]))
Attach.circleRadiusToValue(circle, radius)
Reactive.do([handle], () => {
    Values.max(20, Points.distanceToPoint([cx, cy], handle), radius)
})
```

`Attach.circleToCircle` keeps a second circle around the first at a fixed distance. `Attach.polygonToCircle` spreads a polygon's vertices evenly around the circle, starting at `angle`. `Attach.polylineToCircle` spreads a polyline's vertices over an arc of `span` radians.

## API

- `Attach.circleCenterToPoint`: binds a circle's center to a point
- `Attach.circleRadiusToValue`: binds a circle's radius to a value
- `Attach.circleToCircle`: a concentric circle at a fixed distance
- `Attach.polygonToCircle`: polygon vertices evenly around a circle
- `Attach.polylineToCircle`: polyline vertices along an arc of a circle
- `Values.max`: the larger of two values
- `Values.lerp`: maps the slider ratio into the slider's range

## Notes

Call `Attach` functions once, outside reactions. Each call adds a binding, so calling one inside `Reactive.do` adds a new one on every change. To change a bound value later, write the `Real` you attached.

## See also

- `reactions/attach-03-points`
- `geometry/circles-01-construction`
