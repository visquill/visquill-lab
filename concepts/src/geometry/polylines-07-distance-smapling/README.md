# Polyline Distance Sampling

Sampling a range of evenly spaced points along a polyline using path-length distances.

## What you see

A smooth polyline with two handles on a ruler at the bottom. The handles define a start and end distance along the curve. The section of the polyline between those distances is highlighted, and ten sample dots with tangent arrows appear evenly spaced within the range. Labels in the top-left show the start distance, end distance, and total polyline length in pixels. Dragging either handle narrows or widens the range; the samples reposition instantly.

## Key concepts

- **`Polylines.pinsAtDistances(polyline, distances)`** — samples multiple pins in a single walk along the curve; distances are in path-length pixels, not ratios
- **`Polylines.len(polyline)`** — returns the total path length, used here to convert the slider ratios into actual distances
- **`Polylines.slice(polyline, ratioA, ratioB, result)`** — extracts the sub-section of the polyline between two normalised positions, used to draw the highlighted range