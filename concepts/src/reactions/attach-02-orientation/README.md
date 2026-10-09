# Orientation Modes

A pin carries a direction; `orientation` decides whether an attached shape turns with it.

## How it works

Both sliders move a pin along the same smoothed path with `Polylines.pinAt`. The pin's direction is the path's tangent at that point. Each pin gets a rectangle through `Attach.rectangleToPoint`; the only difference between the two is the `orientation` option.

```ts
Reactive.do([ratio], () => {
    Polylines.pinAt(smoothed, ratio, pin)
})

Attach.rectangleToPoint(rect, pin, {
    width: arrowHalfW * 2,
    height: arrowHalfH * 2,
    anchorX: "center",
    anchorY: "center",
    orientation: "relative",
})
```

With `"relative"` the rectangle turns with the pin. With `"absolute"` it keeps its own orientation and only moves.

## API

- `Attach.rectangleToPoint`: keeps a rectangle of given size at a point or pin
- `Polylines.pinAt`: the pin at a ratio along a polyline, pointing along it
- `Polylines.smooth`: a smoothed copy of a polyline
- `Reactive.do`: runs a function now and whenever its senders change

## See also

- `reactions/attach-03-points`
- `geometry/pins-01-basics`
