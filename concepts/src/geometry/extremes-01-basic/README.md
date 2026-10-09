# Basic

Pick the point that lies furthest in a direction, or closest to and farthest from a reference.

## How it works

Every `Extremes` function scans a list of points and returns one of them. The reaction lists all handles, so the markers follow whenever any point moves:

```ts
Reactive.do(handles, () => {
    const top    = Extremes.topMost(handles)
    const bottom = Extremes.bottomMost(handles)
    const left   = Extremes.leftMost(handles)
    const right  = Extremes.rightMost(handles)
    // …
})
```

The right panel compares against a reference handle, which joins the senders:

```ts
Reactive.do([reference, ...handles], () => {
    const closest  = Extremes.closestTo(handles,  reference)
    const farthest = Extremes.farthestFrom(handles, reference)
    // …
})
```

## API

- `Extremes.topMost`, `Extremes.bottomMost`: the points with the smallest and largest y
- `Extremes.leftMost`, `Extremes.rightMost`: the points with the smallest and largest x
- `Extremes.closestTo`: the point nearest to a reference point
- `Extremes.farthestFrom`: the point farthest from a reference point
- `Points.distanceToPoint`: the distances shown on the lines

## Notes

Y grows downward on screen, so `Extremes.bottomMost` returns the point with the largest y. An empty list gives the origin.

## See also

- `geometry/extremes-02-custom`
