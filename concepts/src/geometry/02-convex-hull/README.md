# Convex Hull

Recompute a convex hull whenever any of many points moves.

## How it works

`Reactive.do` takes any iterable of senders, so the whole array of handles can be passed at once. The reaction runs when any handle moves. `ConvexHulls.topStart` writes the hull into the polygon that is already on the canvas, so no new shape is created per drag step.

```ts
const polygon = canvas.visuals.polygon("contour");

Reactive.do(handles, () => {
    ConvexHulls.topStart(handles, polygon);
}, true);
```

The handles live on a second layer above the polygon, so the filled hull never covers them.

## API

- `Reactive.do`: runs a function now and whenever its senders change
- `ConvexHulls.topStart`: the convex hull of a set of points, starting at the topmost point

## See also

- `geometry/03-offset-polygon`
- `geometry/polylines-09-convex-hull`
