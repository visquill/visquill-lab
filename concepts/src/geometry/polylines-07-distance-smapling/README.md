# Distance Sampling

Sample a polyline at distances in pixels from its start, instead of at ratios.

## How it works

`Polylines.pinsAtDistances` works like `Polylines.pinsAt`, but each entry is a distance along the line in pixels. The demo converts the two slider ratios into distances with `Polylines.len` and spreads the samples evenly between them:

```ts
Reactive.do([ratioA, ratioB], () => {
    const totalLength = Polylines.len(polyline).value
    // …
    const distA = rA * totalLength
    const distB = rB * totalLength

    const distances = Array.from({ length: sampleCount }, (_, i) =>
        ( {value: distA + (distB - distA) * (i / (sampleCount - 1))}))

    const pins = Polylines.pinsAtDistances(polyline, distances)
    // …
    Polylines.slice(polyline, rA, rB, highlight)
    // …
}, true)
```

Polyline ratios are fractions of the length, so `Polylines.slice` with the same ratios highlights exactly the sampled range.

## API

- `Polylines.pinsAtDistances`: pins at many distances along a polyline, in one walk
- `Polylines.len`: the length of a polyline
- `Polylines.slice`: the part between two ratios
- `Pins.moveForward`, `Pins.getPosition`: the arrow tips

## See also

- `geometry/polylines-06-batch-sampling`
