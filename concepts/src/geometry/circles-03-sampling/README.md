# Sampling

Read a position and its direction at any point around a circle.

## How it works

`Circles.pinAt` returns a pin at a ratio around the circle: a position plus the direction of travel there. The tangent and normal arrows both come from that pin. `Pins.moveForward` steps along its direction; `Pins.rotateLeft` turns it by 90° first.

```ts
Reactive.do([circle, ratio], () => {
    const pin = Circles.pinAt(circle, ratio)

    Circles.circleAt(pin, 5, dot)

    Points.copy(pin, dirArrow.at(0))
    Pins.getPosition(Pins.moveForward(pin, arrowLen), dirArrow.at(1))

    Points.copy(pin, normalArrow.at(0))
    Pins.getPosition(Pins.moveForward(Pins.rotateLeft(pin), arrowLen), normalArrow.at(1))
})
```

## API

- `Circles.pinAt`: position and travel direction at a ratio around a circle
- `Circles.circleAt`: a circle from center and radius
- `Pins.moveForward`: moves a pin along its direction
- `Pins.rotateLeft`: turns a pin by 90° to the left
- `Pins.getPosition`: the position of a pin as a point
- `Values.lerp`: maps the slider position to a value

## Notes

For a circle from `Circles.circleAt`, ratio 0 is the leftmost point and the ratio runs clockwise on screen. Where the radius handle sits does not change that. 0 and 1 are the same point.

## See also

- `geometry/arcs-02-sampling`
- `animations/10-swarm`
