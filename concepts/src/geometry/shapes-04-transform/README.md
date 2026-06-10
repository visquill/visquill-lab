# Shapes — Transform

Apply a full similarity transform — translation, rotation, and uniform scale — to a shape using a single pin controlled by two handles.

## What you see

An asymmetric arrow shape with a faint ghost at its original position.  A white anchor handle sets the pin's location, controlling translation.  A purple tip handle sets the endpoint of the pin's orientation vector, controlling both rotation (the angle from anchor to tip) and uniform scale (the distance from anchor to tip relative to the reference length).  Dragging the anchor moves the shape without changing its rotation or scale, because the tip moves with it as a rigid pair.  Dragging the tip alone rotates and scales the shape around the anchor.  The top-left panel shows all four components — angle, scale, and x/y translation — updated live.

## Key concepts

- **`Shapes.transform()`** — applies a similarity transform encoded in a `Pin`; the pin's location is the translation offset and its orientation vector is the combined rotation and uniform scale multiplier, where the vector's angle is the rotation and its length relative to a reference is the scale factor
- **Rigid anchor–tip pair** — when the anchor handle moves, its delta is applied to the tip handle in a dedicated reactive block that fires first; this preserves the orientation vector so rotation and scale are unchanged by a pure translation drag
- **`Pins.alignToSegment()`** — used to build the pin from the two handle positions by aligning its orientation to the anchor→tip direction at the tip's distance