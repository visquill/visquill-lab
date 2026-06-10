# Layers

How layers work: local coordinates, anchors, nesting, z-order, and orientation.

## What you see

Three coloured badges — Layer A, B, and C — each containing the same shape drawn at the same local coordinates. A smaller sub-badge sits offset from Layer B, nested inside it. At the bottom, a rotated layer shows that setting an anchor's direction spins the entire local coordinate space.

## Key concepts

- **Local coordinates** — every shape on a layer is drawn relative to that layer's anchor point, which acts as local (0, 0); the anchor's canvas position is set separately via `Vectors.copy([x, y], layer.anchor)`
- **Same shape, different positions** — all three badges use identical `visuals.box([-40, -40], [40, 40])` calls; only their layer anchors differ, which is what places them at different canvas positions
- **Nesting** — `layerB.layer("sub-")` creates a child layer in layerB's coordinate space; placing its anchor at `[55, 55]` means 55 px from layerB's anchor, not from the canvas origin
- **z-index** — `layer.anchor.zIndex.value = 2` controls render order; higher values draw on top; the default is 0
- **Anchor orientation** — anchors carry a direction as well as a position; `Pins.withOrientation(layer.anchor, Vectors.fromAngle(angle), layer.anchor)` rotates the entire local coordinate space, so an axis-aligned rectangle appears at an angle on the canvas
- **Named vs anonymous layers** — `canvas.layer("layer-a-")` adds the string to the CSS prefix chain; `canvas.layer()` creates an anonymous layer with no additional prefix