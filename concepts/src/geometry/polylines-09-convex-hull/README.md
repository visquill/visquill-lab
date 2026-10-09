# Convex Hull Baseline

Build a smooth baseline beside a stretch of route, as a base for charts that follow the route.

## How it works

The stretch inside the window comes from the same windowing as `polylines-08-windowing`. From there, the reaction runs four steps. The slice is wrapped in its convex hull, and the hull is offset:

```ts
ConvexHulls.topStart(segSlice, hullPolygon);
// …
const offsetHull = Offsets.polygon(hullPolygon, offset.value, true, 1);
```

To find the part of the offset hull that faces away from the route, it takes the route's pins at both ends of the slice. Each pin is turned left and moved out by the offset. Where they land on the offset hull marks the ends of the baseline:

```ts
const dirs = Polylines.pinsAt(polyline, [{ value: start }, { value: end }]);
const a1   = Pins.moveForward(Pins.rotateLeft(dirs[0]), offset.value);
const a2   = Pins.moveForward(Pins.rotateLeft(dirs[1]), offset.value);
const pos1 = Polygons.closestPosition(offsetHull, a1);
const pos2 = Polygons.closestPosition(offsetHull, a2);

Polygons.slice(offsetHull, pos1, pos2, baseline);
```

Offsetting the route directly could self-intersect at sharp bends; the convex hull cannot.

## API

- `ConvexHulls.topStart`: the convex hull of the slice
- `Offsets.polygon`: grows the hull by the offset
- `Polylines.pinsAt`: the route's pins at the slice ends
- `Pins.rotateLeft`, `Pins.moveForward`: the anchor points beside the route
- `Polygons.closestPosition`, `Polygons.slice`: the baseline as part of the offset hull
- `Values.lerp`, `Values.inverseLerp`: map the slider to the offset and back

## See also

- `geometry/polylines-08-windowing`
- `plots/curves-05-along-baseline`
