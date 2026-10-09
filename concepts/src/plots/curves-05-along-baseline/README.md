# Curve Along Baseline

Plot data for the visible part of a route along a baseline that is derived from that part.

## How it works

The window cuts a slice out of the route. Its convex hull, pushed out by `OFFSET`, gives an outline around the slice. `Polygons.slice` keeps the part of that outline between the two ends of the slice; that is the baseline.

```ts
const hull       = ConvexHulls.topStart(slice);
const offsetHull = Offsets.polygon(hull, OFFSET, true, 1);
// …
Polygons.slice(offsetHull, pos1, pos2, baseline);
```

Each data point has a distance along the route. For the visible points, that distance is mapped to the same fraction of the baseline length. `Polylines.pinsAtDistances` gives a pin there, and `Pins.rotateLeft` plus `Pins.moveForward` step sideways by the value.

```ts
const pins = Polylines.pinsAtDistances(baseline, baselineDists);

const curvePoints = pins.map((pin, i) => {
    const displaced = Pins.moveForward(Pins.rotateLeft(pin), visible[i].value);
    return { x: displaced.x, y: displaced.y };
});
```

The filled area is the reversed curve joined to the baseline with `Polylines.concatenate`.

## API

- `ConvexHulls.topStart`, `Offsets.polygon`, `Polygons.slice`: the baseline
- `Polylines.pinsAtDistances`: pins on the baseline
- `Pins.rotateLeft`, `Pins.moveForward`: step sideways by the value
- `Polylines.concatenate`, `Polylines.toReversedPolyline`: the filled area

## Notes

Finding where the route enters and leaves the window uses a helper from `utils/geometry`.

## See also

- `geometry/polylines-08-windowing`
- `plots/curves-04-filled-curve`
