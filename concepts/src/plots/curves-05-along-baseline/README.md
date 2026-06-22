# Curve Along Baseline

Plotting data perpendicular to a dynamically derived curved baseline.

## What you see

A winding route with a draggable window. The windowed slice drives a convex hull baseline (offset 80 px from the route). Simulated data — two overlapping density bumps defined as pixel distances along the route — is sampled for the visible window and plotted perpendicular to the baseline as a filled curve. Moving the window pans across the data: the baseline reshapes to follow the new segment and the curve updates accordingly.

## Key concepts

- **`Polylines.pinsAtDistances` + `Pins.rotateLeft` + `Pins.moveForward`** — each visible data point is placed on the baseline at its corresponding distance via `pinsAtDistances`. The returned pin carries the local baseline direction; `rotateLeft` turns it 90° to face perpendicularly away from the baseline, and `moveForward` steps along that direction by the data value. The resulting `{x, y}` points form the curve outline.

- **Data in pixel distances along the route** — data points are defined as absolute pixel distances along the route polyline, computed once when the route length is known. For the visible window `[start, end]`, each point's route distance is remapped to a baseline distance: `(d.dist - startDist) / (endDist - startDist) * baselineLen`. This is the coordinate transform that makes the chart follow the window.

- **`Polylines.concatenate` + `Cast.asPolyline`** — the filled polygon is built by concatenating the reversed curve with the baseline. `toReversedPolyline(curve)` runs from the curve's end back to its start; concatenating with the baseline closes the area between them. `Cast.asPolyline(curveFill)` allows a polygon visual to be written as a polyline target.

- **Plain values for intermediate geometry** — `ConvexHulls.topStart`, `Offsets.polygon`, and `Polylines.slice` return plain non-reactive values. They are computed fresh on every reactive update and discarded — no reactive allocation happens inside the block.

- **Everything rebuilds on window change** — the reactive block recomputes the hull, offset, baseline, data sample, and curve whenever the window box or polyline changes. Stateless recomputation keeps the logic simple and correct by construction.