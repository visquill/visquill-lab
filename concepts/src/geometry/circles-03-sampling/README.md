# Circle Sampling

Sampling a point, direction, and normal at any position along a circle.

## What you see

A circle with a centre handle and a perimeter handle. The perimeter handle also marks ratio=0 — the point where traversal begins — so dragging it around the circle visibly shifts the start of the parametric range. A ratio slider (0–1) moves a sample point around the circle. At the sampled position, a blue arrow shows the tangent direction and a green arrow shows the normal. A CW / CCW label near the centre reflects the winding order of the construction.

## Key concepts

- **`Circles.pinAt(circle, ratio)`** — returns a pin (position + orientation) at the given ratio; 0 and 1 both land at the first defining point, wrapping continuously around the circle
- **`Pins.moveForward(pin, length)`** — steps forward along the pin's orientation to find the direction arrow tip
- **`Pins.rotateLeft(pin)`** — rotates the pin 90° left to point along the normal; `moveForward` on the result gives the normal arrow tip
- **`Circles.isClockwise(circle)`** — reflects the winding order defined by the construction; determines which way "forward" travels around the circle