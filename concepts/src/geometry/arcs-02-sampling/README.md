# Sampling & Directions

Read a position and its direction at any point along an arc.

## How it works

`Arcs.pinAt` returns a pin at a ratio along the arc: a position plus the direction of travel there. 0 is the start, 1 the end. The tangent and normal arrows come from that one pin. `Pins.moveForward` steps along its direction, and `Pins.rotateLeft` turns it by 90° first, so no vector maths is needed:

```ts
Reactive.do([arc, ratio], () => {
    const pin = Arcs.pinAt(arc, ratio)

    Circles.circleAt(pin, 5, dot)

    Points.copy(pin, dirArrow.at(0))
    Pins.getPosition(Pins.moveForward(pin, arrowLen), dirArrow.at(1))

    Points.copy(pin, normalArrow.at(0))
    Pins.getPosition(Pins.moveForward(Pins.rotateLeft(pin), arrowLen), normalArrow.at(1))
})
```

The arc itself is a sender, so this reaction runs both when the slider moves and when the arc is reshaped.

## API

- `Arcs.pinAt`: position and travel direction at a ratio along an arc
- `Pins.moveForward`: moves a pin along its direction
- `Pins.rotateLeft`: turns a pin by 90° to the left
- `Pins.getPosition`: the position of a pin as a point
- `Arcs.arcAt`: an arc from center, radius, start angle and sweep

## See also

- `geometry/arcs-01-construction`
- `geometry/pins-02-movement`
