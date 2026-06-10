# Pins - Basics

A single pin visualised as an arrow. Click the buttons to transform it; watch the info panel update in real time.

## What you see

A red arrow whose tail sits on a draggable circle handle. An info panel in the top-left corner shows the pin's current position (x, y), raw orientation vector (dir-x, dir-y), angle in degrees, and orientation length. Three rows of buttons apply different `Pins` transforms:

- **Row 1 — rotation & flip:** `rotateLeft`, `rotateRight`, `rotateBy 45°`, `reverse`, `flipX`, `flipY`
- **Row 2 — scale & length:** `scaleBy 1.5`, `resetLength`
- **Row 3 — movement:** `moveForward`, `moveBackward`, `moveLeft`, `moveRight`

## Key concepts

- **Pin** — a position combined with an orientation vector (direction + length)
- **`Pins.rotateLeft()` / `rotateRight()`** — rotate 90° in one call
- **`Pins.rotateBy(angle)`** — rotate by an arbitrary radian angle
- **`Pins.reverse()`** — flip orientation 180°
- **`Pins.flipX()` / `flipY()`** — mirror the orientation across one axis; notice how dir-x or dir-y negates while the other component is unchanged
- **`Pins.scaleBy()`** — multiply orientation length by a factor without changing direction
- **`Pins.withLength()`** — set an absolute length while preserving direction
- **`Pins.moveForward()` / `moveBackward()` / `moveLeft()` / `moveRight()`** — translate position relative to the pin's own orientation frame, not world axes; rotate the pin first and observe how the movement directions follow
- **`Pins.getPosition()` / `Pins.getOrientation()`** — decompose a pin back into its position point and orientation vector
- **`Pins.angle()` / `Pins.len()`** — read the current orientation angle and length