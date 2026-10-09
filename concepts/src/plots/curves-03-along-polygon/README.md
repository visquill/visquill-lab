# Curve Along Polygon

On a closed baseline, shifted positions wrap around instead of stopping at the end.

## How it works

`Curves.alongPolygon` works like `Curves.alongPolyline`: walk the boundary to each position, then step sideways by the value. On a polygon, a position past the perimeter continues from the first vertex.

```ts
const basePins = Polygons.pinsAtDistances(baseline, positions.map(p => ({
    value: p.value + shift.value,
})), true)
// …
Curves.alongPolygon(baseline, positions, values, shift, true, curve)
```

For the grey dots, `Polygons.pinsAtDistances` needs its last argument set to `true` to wrap the same way.

The slider maps its track to one lap: `Values.lerp` from 0 to `Polygons.perimeter`.

```ts
Values.lerp(0, Polygons.perimeter(baseline), ratio, value)
```

## API

- `Curves.alongPolygon`: points offset from a polygon boundary at given distances, wrapping around
- `Polygons.pinsAtDistances`: pins at distances along the boundary, optionally wrapping
- `Polygons.perimeter`: the length of the boundary
- `Points.placeOnCircle`: the octagon's vertices
- `Values.lerp`: maps the slider to the shift

## See also

- `plots/curves-01-along-polyline`
