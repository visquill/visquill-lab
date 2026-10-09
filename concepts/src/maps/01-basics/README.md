# MapLibre Basics

A VisQuill graphic on top of a MapLibre map, with conversions in both directions between screen pixels and lat/lng.

## How it works

`MapAdapter.create` (in `maps/utils`) stacks the SVG graphic over the map. The graphic ignores the pointer, so the map gets all input. `map.trackHandle` makes a handle draggable without panning the map underneath.

The handle lives in screen pixels. Its lat/lng changes when the handle moves and when the map moves, so the label is updated from both.

```ts
Reactive.do([markerHandle], () => {
    screenLabel.value = `${Math.round(markerHandle.x)} / ${Math.round(markerHandle.y)} px`;
    updateWorldLabel();
});

map.onMove(updateWorldLabel);
```

Big Ben goes the other way: a fixed lat/lng, projected to the screen on every map frame.

```ts
function reprojectLandmark(): void {
    const s = map.latLngToScreen(BIG_BEN);
    Vectors.copy(s, landmarkDot);
    Circles.circleAt(s, 10, landmarkRing);
    Points.moveRight(Points.moveUp(s, 20), 14, landmarkLabel);
}

map.onRender(reprojectLandmark);
```

## API

- `Circles.circleAt`, `Vectors.copy`, `Points.moveUp`, `Points.moveRight`: place the marker at the projected point
- `Attach.pointToPoint`: the labels follow the handle

## Notes

The map tiles come from OpenFreeMap and need the network.

## See also

- `maps/02-attached-polyline`
