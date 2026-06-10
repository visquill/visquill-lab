# Bars Along a Polyline

Rectangles distributed along a draggable polyline — a flexible foundation for path-following bar charts.

## What you see

A polyline with draggable handles and two sets of bars growing perpendicularly from it. The **indigo bars** use `rectanglesAlongPolyline` (full control). The **orange bars** use `rectanglesAlignedAlongPolyline` (simplified alignment). Drag any handle and both bar sets reposition reactively.

## Key concepts

- **`Attach.rectanglesAlongPolyline(bars, polyline, options)`** — distributes one rectangle per segment; `positionOnSegment` controls where along each segment the bar sits, `anchorPositionX/Y` controls how the bar aligns to that point
- **`Attach.rectanglesAlignedAlongPolyline(bars, polyline, options)`** — convenience wrapper: `align: "left" | "right" | "center"` replaces the explicit anchor parameters
- **`Attach.rectangleHeightToValue(bar, value, { side })`** — binds a reactive Real to the bar's height; `side: "left"` grows toward the left of the segment direction (typically "above"), `"right"` grows the other way; combine this with `rectanglesAlongPolyline` to drive bar heights from data
- **`distance`** — perpendicular offset from the polyline; useful for separating the two bar sets as shown here