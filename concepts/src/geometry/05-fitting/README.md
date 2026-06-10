# Fits

Four panels showing every combination of box/circle source fitted into a box/circle target.

## What you see

A 2×2 grid.  In each panel a dashed shape is the target; the filled indigo shape is the source fitted inside it.  Drag the handle to resize the target — the source rescales and recentres reactively.  The source is always uniformly scaled (never stretched) so its aspect ratio is preserved.

## Key concepts

- **`Fits.*`** — each method returns a `Pin` encoding the translation and uniform scale that maps the source centred inside the target
- **2-arg form** — called without an output parameter the pin is returned directly; pass it to `Boxes.transform()` or `Circles.transform()` to apply it to the source shape
- **Limiting dimension** — for `boxInBox` the scale is clamped by whichever dimension (width or height) would overflow first; for `boxInCircle` the diagonal equals the diameter