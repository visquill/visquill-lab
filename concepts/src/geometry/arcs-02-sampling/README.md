# Arc Sampling & Directions

Sampling a point, direction, and normal at any position along an arc.

## What you see

A single arc with three draggable handles to reshape it. A ratio slider (0–1) moves a sample point along the arc. At the sampled position, a blue arrow shows the tangent direction and a green arrow shows the normal — perpendicular and pointing left of travel.

## Key concepts

- **`Arcs.pinAt(arc, ratio)`** — returns a pin (position + orientation) at the given ratio; 0 is the start, 1 is the end
- **`Pins.moveForward(pin, length)`** — steps forward along the pin's orientation to find the arrow tip, avoiding manual vector arithmetic
- **`Pins.rotateLeft(pin)`** — rotates the pin 90° left, turning the tangent direction into the normal direction; `moveForward` on the rotated pin then gives the normal arrow tip