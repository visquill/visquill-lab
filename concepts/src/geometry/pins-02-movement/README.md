# Movement

Move a point relative to a direction instead of along the screen axes.

## How it works

Each arrow is a pin moved by one of the four move functions. They step a distance in pixels along the pin's orientation, against it, or 90° to its left or right:

```ts
buildDerivedArrow(canvas, pin, "moveLeft",
    p => Pins.moveLeft(p, moveDistance),     "left",     -labelOffset)
```

The handle turns the pin. `Pins.alignToSegment` points it from its own position toward the handle, so the position stays where it is:

```ts
Reactive.do([hTip], () => {
    Pins.alignToSegment(pin, Pins.getPosition(pin), hTip, pin)
    Pins.withLength(pin, moveDistance, pin)
})
```

The buttons apply the same functions to the pin itself, for example `Pins.moveForward(pin, moveStep, pin)`.

## API

- `Pins.moveForward`, `Pins.moveBackward`: move along the orientation or against it
- `Pins.moveLeft`, `Pins.moveRight`: move 90° to the left or right of the orientation
- `Pins.alignToSegment`: orients a pin along the direction from one point to another
- `Pins.withLength`: sets the orientation's length
- `Pins.getPosition`: the position of a pin as a point

## Notes

Left and right are as seen on screen when facing along the orientation: with the pin pointing right, `Pins.moveLeft` goes up.

## See also

- `geometry/pins-01-basics`
- `geometry/arcs-02-sampling`
