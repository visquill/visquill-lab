# Pins - Interpolation

Smoothly blend between two pins. Position and orientation are interpolated independently.

## What you see

A blue pin (A) on the left and an orange pin (B) on the right, each defined by a solid origin handle and a hollow tip handle. A row of grey ghost pins shows the full interpolation sweep from A to B. The green pin is the live result of `Pins.interpolate(a, b, t)` at the slider value — drag the slider to move it along the trail.

Reshape either source pin (move its origin or tip handle) and the ghost trail and live result update immediately.

## Key concepts

- **`Pins.interpolate(a, b, t)`** — linearly interpolates both position and orientation between two pins; `t = 0` returns a pin equal to `a`, `t = 1` returns one equal to `b`
- **Position and orientation blend independently** — the green pin travels in a straight line between origins while its arrow rotates continuously; try placing A and B with very different directions to see the rotation clearly
- **`Pins.alignToSegment(pin, p1, p2)`** — used here so each tip handle directly sets the source pin's direction