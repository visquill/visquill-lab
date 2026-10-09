# Point Set Analysis

Measure a whole set of points: its center, its widest pair, and its nearest and farthest point to a reference.

## How it works

The handles are points, so the array goes straight into the `Points` functions and into `Reactive.do`:

```ts
Reactive.do(handles, () => {
    const c = Points.centroid(handles)
    // …
    const diag = Points.diagonal(handles)
    // …
})
```

`Points.centroid` is the average position. `Points.diagonal` returns a segment between the two points farthest apart. The second reaction also lists the reference handle:

```ts
Reactive.do([...handles, refHandle], () => {
    const nearest = Points.pointWithMinDistance(refHandle, handles)
    // …
    const farthest = Points.pointWithMaxDistance(refHandle, handles)
    // …
})
```

## API

- `Points.centroid`: the average position of a set of points
- `Points.diagonal`: the segment between the two points farthest apart
- `Points.pointWithMinDistance`: the point of a set nearest to a reference
- `Points.pointWithMaxDistance`: the point of a set farthest from a reference

## See also

- `geometry/extremes-01-basic`
