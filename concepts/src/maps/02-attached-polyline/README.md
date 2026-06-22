# Reprojected Geometry

Keeping SVG geometry locked to geography as the map pans and zooms.

## What you see

A smoothed polyline traces the Rhine river from Basel to Rotterdam, staying pinned to the map through any pan, zoom, or animated transition. A draggable handle floats freely over the map; when released it snaps to the nearest point on the route. A label on the handle shows the position as a percentage along the river.

## Key concepts

- **`onRender` + `latLngToScreen`** — the core reprojection pattern. On every MapLibre render frame, each geographic waypoint is projected to screen pixels and the polyline is rebuilt. `onRender` fires more frequently than `onMove` — including during tile-loading redraws and momentum scrolling — so the geometry never lags behind the map.

- **`Polylines.smooth`** — Chaikin corner-cutting applied to the projected screen points. The waypoints are sparse enough to produce visible corners without smoothing; two passes turn them into a curve. The smoothed polyline is rebuilt from scratch every frame, so the output always reflects the current projection.

- **Reprojected geometry is fully interactive** — `Polylines.closestPoint` and `Polylines.closestPosition` work on the reprojected screen-space polyline exactly as they would on any other VisQuill polyline. The map integration is isolated to the `onRender` callback; everything else is standard VisQuill.

- **Snap on release** — while the handle is dragged, a snap dot and connector show where it would land on the route. On drag end (`handle.active` goes false), `Polylines.closestPoint` writes the snap position back into the handle itself, moving it onto the line.