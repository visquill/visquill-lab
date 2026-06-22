# Focused Route Chart

A route-following chart that automatically tracks the visible portion of a reprojected path.

## What you see

The Rhine river is reprojected from lat/lng onto the map on every render frame. The visible portion — wherever the route crosses the viewport — is highlighted in blue. A density chart floats above that segment: a convex hull baseline offset from the route, with a filled curve plotted perpendicular to it. Pan and zoom the map; the chart redraws immediately to follow the visible window.

## Key concepts

- **`Reactive.block`** — wraps the entire per-frame update (reproject → window → chart) in a single batch. Without it, each reactive write would trigger its dependents immediately — `route` changing would fire the chart update before `startPos` and `endPos` had been updated. `Reactive.block` defers all downstream reactions until the block completes, making the update atomic.

- **The viewport frame as the window** — unlike the Polyline Windowing demo where the window was a draggable box, here the window is `Boxes.inflate(rvg.frame, -inset, -inset)`. `focusedWindow` reads it on every render frame alongside the reprojected route.

- **Handling route endpoints inside the box** — `focusedWindow` allows the route to start or end inside the box, using the first or last vertex directly as the entry/exit point. This makes the chart work even when the route begins or ends in the visible viewport.

- **`Polylines.pinsAt` for baseline anchors** — pins at the slice start and end carry the local route direction. `Pins.rotateLeft` turns each 90° to point toward the offset side; `Pins.moveForward` steps out by the offset distance to place anchor points on the far side of the hull. `Polygons.closestPosition` then locates those anchors on the hull boundary and `Polygons.slice` extracts the arc between them as the baseline.

- **Data in normalised route space** — unlike the Plots demo where data is in pixel distances, here data positions are normalised [0, 1]. The route reprojects every frame so its pixel length changes with zoom — normalised positions remain stable and map correctly to the window range on every frame.
