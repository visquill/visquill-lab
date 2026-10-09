# Point Placement

Place a point on a circle by angle, on an arc by ratio, or beside a segment.

## How it works

Each panel calls one `Points.place…` function with the slider's value and draws the result:

```ts
Reactive.do([angle], () => {
    const pt = Points.placeOnCircle([cx, cy], r, angle.value)
    // …
})
```

`Points.placeOnCircle` measures the angle from the positive x axis; on screen, growing angles turn clockwise. `Points.placeOnArc` takes the arc as two directions from the center plus a winding flag, and a ratio from 0 (start) to 1 (end). The grey arc is drawn by calling it 49 times. `Points.placeBesideSegment` goes to a ratio along the segment, then a distance to its left or right:

```ts
const onSeg  = Points.placeOnSegment(p1, p2, ratio.value)
const beside = Points.placeBesideSegment(p1, p2, ratio.value, dist, true)
```

## API

- `Points.placeOnCircle`: a point on a circle at an angle
- `Points.placeOnArc`: a point at a ratio along an arc between two directions
- `Points.placeOnSegment`: a point at a ratio along a segment
- `Points.placeBesideSegment`: a point at a distance beside a segment

## Notes

In `Points.placeOnArc` the winding flag is mirrored compared with `Arcs.arcBetween`: `false` runs clockwise on screen. With `false` the arc here passes through the bottom.

## See also

- `geometry/pins-03-placement`
- `geometry/arcs-01-construction`
