# Curve Along Polyline

Plot values at distances along a curved baseline, and slide them with one shift value.

## How it works

`Curves.alongPolyline` walks the baseline to each position (in pixels), then steps sideways by the value. Negative values go to the other side. `shift` is added to every position, so changing it slides the data along the baseline.

```ts
Reactive.do([shift], () => {
    const totalLength = Polylines.len(baseline).value
    const spacing     = totalLength / valueCount

    const positions = Array.from({ length: valueCount }, (_, i) => ({
        value: i * spacing,
    }))
    // …
    Curves.alongPolyline(baseline, positions, values, shift, true, curve)
```

The grey dots come from `Polylines.pinsAtDistances` at the same shifted positions, so each dot sits under its curve point. `Polylines.smooth` rounds the corners of the baseline.

The slider maps the middle of the track to no shift, with `Values.lerp` from minus to plus half the baseline length.

## API

- `Curves.alongPolyline`: points offset from a polyline at given distances
- `Polylines.pinsAtDistances`: pins at distances along a polyline
- `Polylines.smooth`: rounds the corners of a polyline
- `Polylines.len`: the length of the baseline
- `Values.lerp`: maps the slider to the shift

## Notes

Positions past either end are clamped to the end, so shifted points pile up there.

## See also

- `plots/curves-03-along-polygon`
- `plots/curves-04-filled-curve`
