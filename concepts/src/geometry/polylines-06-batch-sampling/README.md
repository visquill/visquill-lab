# Batch Sampling

Sample many positions along a polyline in one call instead of one call per position.

## How it works

`Polylines.pinsAt` takes a list of ratios and returns one pin per ratio, in the same order. It walks the polyline once for all of them, which is cheaper than calling `Polylines.pinAt` N times. A ratio is anything with a `value`, so plain objects work:

```ts
Reactive.do([countVal], () => {
    const n       = Math.round(countVal.value)
    const ratios  = Array.from({ length: n }, (_, i) => ({value: i / (n - 1)}))
    // Evenly spaced ratios from 0 to 1, sampled in one walk
    const pins = Polylines.pinsAt(polyline, ratios)
    // …
}, true)
```

Each pin carries the position and the unit direction, so the dot and the arrow come from it directly:

```ts
Circles.circleAt(pin, 5, dots[i])
Points.copy(pin, arrowStarts[i])
Pins.getPosition(Pins.moveForward(pin, arrowLength), arrowEnds[i])
```

The markers for the maximum count are created once; the ones not needed are hidden with `visible.value = false`.

## API

- `Polylines.pinsAt`: pins at many ratios along a polyline, in one walk
- `Pins.moveForward`, `Pins.getPosition`: the arrow tip
- `Polylines.smooth`: rounds the control polyline

## See also

- `geometry/polylines-07-distance-smapling`
- `geometry/polylines-01-sampling`
