# Offset

Grow a convex polygon outward by a distance that a slider controls.

## How it works

The distance is a `Real` from `canvas.values.real()`. A `Real` is a sender like a handle, so it goes into the same `Reactive.do` as the points. The reaction rebuilds the hull and then its offset:

```ts
Reactive.do([...handles, distance], () => {
    ConvexHulls.topStart(handles, polygon);
    Offsets.polygon(polygon, distance, true, 1, offset);
}, true);
```

The slider is a plain handle. Its own reaction pulls it back onto the track and writes its distance from the track's start into `distance`:

```ts
Reactive.do([slider], () => {
    Points.closestPointOnSegment(slider, track, slider);
    Points.distanceToPoint(track.at(0), slider, distance);
    // …
}, true);
```

## API

- `Reactive.do`: runs a function now and whenever its senders change
- `ConvexHulls.topStart`: the convex hull of a set of points
- `Offsets.polygon`: a polygon offset from a baseline polygon to its left or right side
- `Points.closestPointOnSegment`: the point on a segment closest to a given point
- `Points.distanceToPoint`: distance between two points

## Notes

`Offsets.polygon` is meant for convex baselines; a concave one can give a self-intersecting result. The fourth argument sets how many extra points round each corner.

## See also

- `geometry/02-convex-hull`
