# Box Viewport

A rectangular clipping viewport with pan and zoom, sized reactively to fill its container.

## What you see

A dashed rectangle inset from the container edge.  Inside it, scattered diamond shapes represent the content world.  Shapes that extend beyond the rectangle's edge are clipped.  Two coordinate labels inside the content scroll with the world; a label on the frame layer stays fixed.  Drag to pan the content, scroll (or pinch) to zoom.

## How it differs from Circle Viewport

The structure is intentionally identical.  Only three things change:

| Circle Viewport | Box Viewport |
|---|---|
| `viewports.circle()` | `viewports.box()` |
| `Boxes.inscribeCircle()` → boundary | `Boxes.inflate()` → boundary |
| `Fits.boxInCircle()` | `Fits.boxInBox()` |

Everything else — content creation, frame labels, reactive wiring — is the same code.

## Key concepts

- **`viewports.box()`** — creates a viewport whose clip region is an axis-aligned rectangle; the API mirrors `viewports.circle()` exactly
- **`viewport.boundary`** — here a reactive `Box` instead of a `Circle`, but used in the same way
- **`Boxes.inflate()`** — shrinks (or grows) a rectangle by a fixed inset on each axis; used here to derive the viewport boundary from the container frame
- **`Fits.boxInBox()`** — calculates the origin pin that fits a world-space bounding box into a rectangle, the rectangular counterpart to `Fits.boxInCircle()`