# Curve Along Polygon

Plotting a data series offset from a polygon boundary with wraparound shift.

## What you see

A regular octagon as the baseline. Grey dots mark the sampling positions on the boundary; an orange closed curve connects the offset points. A shift slider maps one full drag to one full lap around the perimeter, so the samples wrap continuously past vertex 0 rather than stopping at the end. The shift and perimeter labels in the top-left update live.

## Key concepts

- **`Curves.alongPolygon(baseline, positions, values, shift, left, result)`** — same concept as the polyline variant but on a closed boundary; positions wrap around automatically when shift pushes them past the perimeter
- **`Polygons.perimeter(baseline)`** — used to map the slider's [0, 1] range to [0, perimeter] so one full drag equals exactly one full lap
- **`Polygons.pinsAtDistances(baseline, distances, true)`** — the `true` flag enables wraparound, matching the behaviour of `alongPolygon`