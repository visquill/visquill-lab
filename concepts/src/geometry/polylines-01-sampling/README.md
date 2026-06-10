# Polyline Sampling

Drag a slider to move a probe along a smooth curve and read off its position, tangent direction, and left-hand normal — all updating live.

## What you see

A smooth curve drawn through eleven waypoints (a faint dashed line shows the original control points). An orange dot marks the current sample position. A green arrow shows the tangent direction; a purple arrow shows the left-hand normal. Three fixed labels below the curve display the current ratio t, the direction angle in degrees, and the normal angle in degrees — they stay anchored to the bottom of the canvas and do not move with the probe.

## Key concepts

- **`Polylines.smooth(polyline, iterations)`** — applies Chaikin corner-cutting to produce a smooth curve from coarse waypoints; more iterations give a rounder result
- **`Polylines.pointAt(polyline, ratio)`** — returns the point on the curve at a normalised position t ∈ [0, 1]
- **`Polylines.directionAt(polyline, ratio)`** — returns a unit vector aligned with the curve's tangent at t; the angle changes continuously as t moves
- **`Polylines.normalAt(polyline, ratio, left)`** — returns a unit vector perpendicular to the tangent; `left = true` gives the counter-clockwise (left-hand) normal
- **`Vectors.angle(vector)`** — converts a unit direction vector to an angle in radians, used here to show human-readable degree values in the fixed labels
- **Fixed vs moving labels** — labels whose *position* depends on `rvg.frame` stay put on resize; labels whose *text* depends on `position` update with the slider; these two concerns live in separate `Reactive.do` blocks