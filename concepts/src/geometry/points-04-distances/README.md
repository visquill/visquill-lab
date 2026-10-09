# Distance Types

Compare the distance to a segment, to a line, and along the axes.

## How it works

`Points.distanceToSegment` measures to the nearest point of the segment, so beyond an end it measures to that end. `Points.distanceToLine` measures to the infinite line through the segment, so the closest point can lie outside it:

```ts
Reactive.do([p], () => {
    const closest = Points.closestPointOnLine(p, seg)
    const dist    = Points.distanceToLine(p, seg)
    // …
})
```

The dashed extension is the segment lengthened at both ends: `Polylines.extend([seg2Start, seg2End], 280, 280)`.

The third panel splits a distance into its parts. `Points.horizontalDistance` and `Points.verticalDistance` are the absolute differences in x and y; neither is ever longer than `Points.distanceToPoint`.

## API

- `Points.distanceToSegment`, `Points.closestPointOnSegment`: distance and closest point on a segment
- `Points.distanceToLine`, `Points.closestPointOnLine`: distance and closest point on a line
- `Points.horizontalDistance`, `Points.verticalDistance`: distance along x and along y
- `Points.distanceToPoint`: straight distance between two points
- `Polylines.extend`: lengthens a polyline at its start and end

## See also

- `reactions/reactions-02-distances`
