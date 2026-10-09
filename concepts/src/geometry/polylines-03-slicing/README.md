# Slicing

Cut a polyline into the part before a ratio, the part between two ratios, and the part after.

## How it works

The three slice functions take ratios from 0 (start) to 1 (end) along the length. Together they cover the whole line without overlap:

```ts
Reactive.do([posA, posB], () => {
    const a = Math.min(posA.value, posB.value)
    const b = Math.max(posA.value, posB.value)

    Polylines.slicePrefix(polyline, a, segPrefix)
    Polylines.slice(polyline,  a, b, segSlice)
    Polylines.sliceSuffix(polyline, b, segSuffix)
    // …
})
```

The two handles may cross on the track; the reaction sorts their values, so `a` is never greater than `b`. The base polyline is a plain shape from `Polylines.smooth` and is not drawn.

## API

- `Polylines.slicePrefix`: the part from the start to a ratio
- `Polylines.slice`: the part between two ratios
- `Polylines.sliceSuffix`: the part from a ratio to the end
- `Polylines.smooth`: rounds the control polyline

## See also

- `geometry/polygons-04-slice`
- `geometry/polylines-08-windowing`
