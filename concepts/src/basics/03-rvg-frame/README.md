# Frame and Center

How to use `rvg.frame` and `rvg.center` — the two built-in coordinate references every VisQuill graphic exposes.

## What you see

A dashed rectangle marking the exact boundary of the SVG element, with labeled corner points and an orange crosshair at the center. Resize the browser window and everything stays anchored — the frame corners track the edges, the crosshair stays at the midpoint.

## Key concepts

- **`rvg.frame`** — a reactive `Box` spanning the full SVG element; it fires any `Reactive.do()` block that depends on it when the container is resized
- **`rvg.center`** — the midpoint of `rvg.frame`; use it as a stable origin for centered layouts without hardcoding coordinates
- **`Boxes.*` helpers** — `Boxes.topLeft()`, `Boxes.topRight()` etc. extract corner points from the frame into separate point visuals that can then be used as attach targets
- **Layer as a positioned group** — the crosshair is drawn in local coordinates around `[0, 0]` inside its own layer; attaching the layer's anchor to `rvg.center` moves the whole thing as a unit