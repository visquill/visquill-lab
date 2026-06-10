# Reflection & Rotation

Three spatial transforms on points — two reflections and a rotation.

## What you see

Three panels, each with a blue source handle and an orange result. **reflect** — drag the source or the purple pivot; the result is always directly opposite the pivot from the source. **reflectOverLine** — drag the source or either line endpoint; the result is the mirror image across the line, with a dashed connector showing the perpendicular. **rotateAround** — drag the source or pivot, then use the slider to rotate; the two dashed radii show the angle swept.

## Key concepts

- **`reflect(point, pivot)`** — reflects through a point: the pivot is the midpoint between source and result; equivalent to rotating 180°
- **`reflectOverLine(point, line)`** — reflects across a line: the result is equidistant from the line on the opposite side; the connector from source to result is always perpendicular to the line
- **`rotateAround(point, pivot, angle)`** — rotates a point around a pivot by an angle in radians; positive values rotate counterclockwise