# Closest Point

Drag a handle anywhere on the canvas and watch a red dot snap to the nearest point on the curve, with live distance and position readouts.

## What you see

   The same smooth curve as the Polyline Sampling demo.  A blue draggable handle projects onto the curve: a red dot marks the closest point, a dashed connector joins the two, and a small label on the connector shows the distance in pixels.  Two info labels in the top-left corner show the distance and the normalised curve position t of the closest point.

## Key concepts

- **`Polylines.closestPoint(polyline, point, result)`** — finds the nearest point on the polyline to a given point; used here to snap the red dot as the handle moves
- **`Polylines.distanceTo(polyline, point, result)`** — the length of the shortest path from the point to any point on the polyline; drives both the connector label and the info panel
- **`Polylines.closestPosition(polyline, point, result)`** — the normalised ratio t ∈ [0, 1] of the closest point; shows where along the curve the projection lands