# MapLibre + VisQuill

Combining a VisQuill SVG scene with a MapLibre map using a shared `MapAdapter` that handles all overlay boilerplate.

## What you see

A MapLibre map centred on London with two kinds of marker:

- **Screen-space handle** — a draggable ring that stays at its pixel position when the map pans or zooms. Two labels follow it: one shows its pixel coordinates, the other shows the corresponding lat/lng. The lat/lng label also updates when the map moves, since the same screen position maps to different geography after a pan or zoom.
- **Geo-anchored marker** — a fixed point at Big Ben's coordinates. Unlike the handle, this marker moves with the map on every pan and zoom, staying locked to the geography.

Comparing the two markers makes the core distinction tangible: screen space versus world space.

## Key concepts

- **`MapAdapter.create()`** — static factory that handles all overlay boilerplate: two stacked divs, pointer-event routing, wheel forwarding, and the glass pane. Returns `{ map, rvg }`. Nothing in `run()` deals with DOM setup.
- **`map.trackHandle(handle)`** — registers a draggable handle so the glass pane activates automatically during drag, preventing the map from panning underneath. Multiple handles are reference-counted; the pane stays active until all are released.
- **`screenToLatLng` + `onMove`** — the screen-space handle reads its geographic meaning via `screenToLatLng`. This must be called both when the handle moves (new pixel, same view) and when the map moves (same pixel, new view), so `updateWorldLabel` is registered with both `Reactive.do` and `map.onMove`.
- **`latLngToScreen` + `onRender`** — the geo-anchored marker calls `latLngToScreen` on every MapLibre render frame to stay locked to geography. `onRender` is used rather than `onMove` because it fires on every draw — including tile-loading redraws and animated pans — so the marker never lags.