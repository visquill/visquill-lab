# Viewport Along Path

Slide the viewport's focus point along a smooth trajectory through the content world, with independent zoom control.

## What you see

A rectangular viewport showing scattered diamond shapes and an orange camera path.  The dashed line shows the original waypoints; the solid line is the smoothed trajectory.  Two sliders sit below the viewport: **Position** moves the camera along the path (0–1), **Zoom** scales the view in and out.  Drag-to-pan and scroll-to-zoom still work alongside the sliders.

## Key concepts

- **`Polylines.smooth(polyline, steps)`** — interpolates a smooth curve through the vertices of a coarse polyline, producing a gentle trajectory for the camera
- **`Polylines.pinAt(polyline, ratio)`** — samples a pin (position + direction) at a normalised ratio along a polyline; the direction follows the curve's tangent
- **`Viewports.focusOn(origin, pin, viewportCenter, output)`** — sets the viewport origin so that the pin's position sits at the viewport centre, without changing the zoom level
- **`Viewports.zoomTo(origin, level, viewportCenter, output)`** — adjusts the zoom level around a screen-space pivot point
- **Slider pattern** — a draggable handle constrained to a track segment via `Points.closestPointOnSegment()`, with its normalised position written back into a reactive `Real` via `Points.relativePositionOnSegment()`