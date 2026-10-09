# Polyline Windowing

Find the part of a polyline that runs through a box, as a range of ratios along it.

## How it works

The GDK has no function that clips a polyline to a box, so `windowPolyline` in the demo does it in three steps. It walks the vertices with `Boxes.containsPoint` to find the first and last vertex inside. It intersects the edges just before and after them with the box sides (`segmentBoxIntersection` from `concepts/src/utils/geometry.ts`). Then `Polylines.closestPosition` turns the two crossing points into ratios:

```ts
const start = Polylines.closestPosition(polyline, entryPt).value;
const end   = Polylines.closestPosition(polyline, exitPt).value;
```

With the ratios, the three slice functions draw the line in three parts:

```ts
Polylines.slicePrefix(polyline, start, segPrefix);
Polylines.slice(polyline, start, end,  segSlice);
Polylines.sliceSuffix(polyline, end,   segSuffix);
```

## API

- `Boxes.containsPoint`: whether a point lies in a box
- `Boxes.spannedBox`: the window from its two corner handles
- `Polylines.closestPosition`: the ratio of the nearest point on a polyline
- `Polylines.slicePrefix`, `Polylines.slice`, `Polylines.sliceSuffix`: the parts before, between and after two ratios

## Notes

The range runs from the first entry to the last exit. A line that leaves the box and comes back counts as one range.

## See also

- `geometry/polylines-03-slicing`
- `geometry/polylines-09-convex-hull`
