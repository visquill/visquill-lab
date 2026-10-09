# Bar Anchoring

The anchor ratio decides which point of a bar's base sits on the pin.

## How it works

`Pins.placeAndAlignOnSegment` turns the two handles into one pin: it sits on the position handle and points to the direction handle. `Bars.fromAnchoredPin` builds a bar of fixed width and height on that pin. Its base runs along the pin's direction, and the anchor ratio says where the pin is on the base: 0 at the start, 0.5 in the middle, 1 at the end.

```ts
Reactive.do([posHandle, dirHandle], () => {
    const pin = Pins.placeAndAlignOnSegment(posHandle, dirHandle, 0)

    Bars.fromAnchoredPin(pin, { value: 0.0 }, barWidth, barHeight, true, barLeft as Rectangle)
    Bars.fromAnchoredPin(pin, { value: 0.5 }, barWidth, barHeight, true, barCenter as Rectangle)
    Bars.fromAnchoredPin(pin, { value: 1.0 }, barWidth, barHeight, true, barRight as Rectangle)
}, true)
```

With `left` set to `true`, the bars grow to the left of the pin's direction. Rotating the pin turns each bar around its own anchor.

## API

- `Bars.fromAnchoredPin`: a bar placed on a pin at an anchor ratio along its base
- `Pins.placeAndAlignOnSegment`: a pin at a ratio along a segment, pointing along it

## See also

- `plots/bars-02-along-polyline`
