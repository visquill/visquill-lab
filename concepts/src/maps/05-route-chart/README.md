# Focused Route Chart

A chart along the part of a route that is visible on the map, rebuilt on every map frame.

## How it works

On every render frame, the route is projected to the screen, the visible part is found, and the chart is rebuilt. `Reactive.block` holds back the reactions until all of this is written, so nothing reacts to a half-updated state.

```ts
map.onRender(() => {
    Reactive.block(() => {
        const screen = ROUTE.map(p => map.latLngToScreen(p));
        const smoothed = Polylines.toReversedPolyline(Polylines.smooth(screen, SMOOTHING));
        Polylines.copy(smoothed, route);

        const window = focusedWindow(route, rvg.frame, FRAME_INSET);
        // …
        updateChart();
    });
});
```

The window is the map frame, inset by `FRAME_INSET`. The chart is built as in `plots/curves-05-along-baseline`: a convex hull around the visible slice, pushed out with `Offsets.polygon`, gives the baseline, and each value is plotted sideways with `Pins.rotateLeft` and `Pins.moveForward`.

The data positions are ratios along the route (0 to 1), not pixels, because the route's length in pixels changes with every zoom.

## API

- `Reactive.block`: one batch of updates per frame
- `Polylines.smooth`, `Polylines.slice`, `Polylines.pinsAtDistances`: route and baseline
- `ConvexHulls.topStart`, `Offsets.polygon`, `Polygons.slice`: the baseline
- `Pins.rotateLeft`, `Pins.moveForward`: step sideways by the value

## See also

- `plots/curves-05-along-baseline`
- `maps/02-attached-polyline`
