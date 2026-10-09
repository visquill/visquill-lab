# Viewport Along Path

Drive the viewport from values: one slider moves the view along a path, the other sets the zoom.

## How it works

`Polylines.smooth` rounds the corners of the waypoint path. `Polylines.pinAt` samples the path at the slider ratio, and `Viewports.focusOn` moves that point to the centre of the viewport. It keeps the current zoom and rotation.

```ts
Reactive.do([position, viewport.boundary], () => {
    const vCenter = Boxes.center(viewport.boundary)
    const pin     = Polylines.pinAt(trajectory, position)
    Viewports.focusOn(viewport.origin, pin, vCenter, viewport.origin)
})
```

`Viewports.zoomTo` sets an absolute zoom and keeps the given screen point fixed. Because that point is the centre, the view stays on the path while zooming.

```ts
Reactive.do([zoom], () => {
    const vCenter   = Boxes.center(viewport.boundary)
    const zoomLevel = Values.lerp(minZoom, maxZoom, zoom)
    Viewports.zoomTo(viewport.origin, zoomLevel, vCenter, viewport.origin)
})
```

Each slider handle is kept on its track with `Points.closestPointOnSegment`, and `Points.relativePositionOnSegment` writes its ratio into a `Real`.

## API

- `Polylines.smooth`: rounds the corners of a polyline (Chaikin)
- `Polylines.pinAt`: the point and direction at a ratio along a polyline
- `Viewports.focusOn`: moves a world pin to a screen point, keeping zoom and rotation
- `Viewports.zoomTo`: sets the zoom around a screen point
- `Values.lerp`: maps the slider to the zoom range

## See also

- `viewport/04-animated-focus`
