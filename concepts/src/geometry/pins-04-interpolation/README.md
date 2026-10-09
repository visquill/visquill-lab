# Interpolation

Blend two pins, position and orientation, by a factor between 0 and 1.

## How it works

`Pins.interpolate` returns pin `a` at `t = 0` and pin `b` at `t = 1`. In between, it interpolates the position and the orientation vector separately and linearly. The position moves on a straight line from `a` to `b`.

```ts
Reactive.do([pinA, pinB, t], () => {
    const p   = Pins.interpolate(pinA, pinB, t)
    const tip = Pins.moveForward(p, 40)
    // …
})
```

The faint trail calls it nine times with fixed factors, so it shows the whole blend at once. Each source pin is built from two handles with `Pins.placeAt` and `Pins.alignToSegment`.

## API

- `Pins.interpolate`: a pin between two pins at a factor
- `Pins.placeAt`: moves a pin to a point, keeping its orientation
- `Pins.alignToSegment`: orients a pin from one point toward another
- `Pins.withLength`: sets the orientation's length
- `Pins.moveForward`: the arrow tip

## Notes

The orientation is interpolated as a vector, not turned like a clock hand. Halfway between opposite directions the orientation has length 0, and the arrow flips there.

## See also

- `geometry/pins-03-placement`
- `animations/09-card-deals`
