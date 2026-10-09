# Reprojected Geometry

Geometry defined in lat/lng is rebuilt in screen pixels on every map frame, and then works like any other VisQuill shape.

## How it works

The Rhine is a list of lat/lng waypoints. On every render frame they are projected to the screen and smoothed into the route polyline.

```ts
map.onRender(() => {
    const screen = RHINE.map(p => map.latLngToScreen(p));
    Polylines.smooth(screen, 2, route);
});
```

The route is an ordinary polyline, so the handle reaction can depend on it. `Polylines.closestPoint` finds the snap dot, and `Polylines.closestPosition` gives the position along the river (0 at Basel, 1 at Rotterdam).

```ts
Reactive.do([handle, route], () => {
    Polylines.closestPoint(route, handle, snapDot);

    const t = Polylines.closestPosition(route, handle).value;
    posLabel.value = `${Math.round(t * 100)}%`;
    // …
});
```

When the drag ends (`handle.active` turns false), the handle itself is moved onto the route.

## API

- `Polylines.smooth`: rounds the projected waypoints into a river
- `Polylines.closestPoint`: the snap point on the route
- `Polylines.closestPosition`: the position along the route as a ratio
- `Segments.segment`: the connector from handle to snap point
- `Attach.pointToPoint`: the label follows the handle

## Notes

The handle stays in screen pixels: after a pan it is no longer on the route until it is dragged again.

## See also

- `maps/01-basics`
- `maps/05-route-chart`
