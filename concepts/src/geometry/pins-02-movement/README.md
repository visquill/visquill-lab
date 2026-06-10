# Pins - Movement

Four movement directions shown simultaneously from one pin. Rotate with the handle, move with the buttons.

## What you see

A dashed source arrow with a white handle at its tip. Four coloured shafts branch from the same origin — green (forward), red (backward), blue (left), orange (right) — each showing where the pin would land after calling the corresponding `Pins.move*` method. Four buttons at the bottom actually move the pin; the coloured arrows update immediately.

Drag the white handle to change direction and watch all four endpoints rotate together. Click a button to move the pin; the handle snaps to the new tip so dragging still works correctly.

## Key concept

Movement in `Pins` is **relative to the pin's own orientation**, not to the world axes. `moveForward` always goes in the direction the pin is pointing; `moveLeft` is always 90° counterclockwise from that. Rotate the source arrow and every coloured endpoint rotates with it.

## Key concepts

- **`Pins.moveForward(pin, distance)`** — moves along the pin's orientation direction
- **`Pins.moveBackward(pin, distance)`** — moves opposite to the orientation direction
- **`Pins.moveLeft(pin, distance)`** — moves 90° counterclockwise from forward
- **`Pins.moveRight(pin, distance)`** — moves 90° clockwise from forward
- **`Pins.alignToSegment(pin, p1, p2)`** — points the orientation from p1 toward p2; used here so the tip handle directly controls direction without affecting position