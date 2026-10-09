# Filled Curve

An area chart is two shapes from the same values: the filled band and its top line.

## How it works

`Curves.alongPolylineUniform` spreads the values evenly over the length of the baseline and offsets each point by its value. `Curves.filledAlongPolyline` uses the same positions and returns a closed polygon between the baseline and that curve.

```ts
Curves.filledAlongPolyline(baseline, values, true, filledArea)
Curves.alongPolylineUniform(baseline, values, true, curveOutline)
```

The filled area is created first, so the outline is drawn on top of it. Both run once, because the baseline and the values never change.

The baseline is a polyline smoothed with `Polylines.smooth`.

```ts
const baseline = canvas.visuals.polyline(
    "baseline",
    Polylines.smooth(baselinePoints, smoothingIterations)
)
```

## API

- `Curves.filledAlongPolyline`: the closed area between a polyline and its offset curve
- `Curves.alongPolylineUniform`: the offset curve, values spread evenly along the polyline
- `Polylines.smooth`: rounds the corners of a polyline

## See also

- `plots/curves-01-along-polyline`
- `plots/curves-05-along-baseline`
