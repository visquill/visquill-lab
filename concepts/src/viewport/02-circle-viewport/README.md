# Circle Viewport

A circular clipping viewport with pan and zoom, sized reactively to fill its container.

## What you see

A dashed circle inscribed in the container.  Inside it, scattered diamond shapes represent the content world.  Shapes that extend beyond the circle's edge are clipped.  Two coordinate labels inside the content scroll with the world; a label on the frame layer stays fixed.  Drag to pan the content, scroll (or pinch) to zoom.

## Key concepts

- **`viewports.circle()`** — creates a viewport whose clip region is a circle; pass `{ panning: true, zooming: true }` to enable interaction
- **`viewport.boundary`** — the reactive `Circle` that defines the clipping region; anything outside it is hidden
- **`viewport.content` vs `viewport.frame`** — `content` is the pannable, zoomable canvas inside the clip; `frame` is a static overlay drawn on top, outside the clip, ideal for rims and fixed labels
- **`viewport.origin`** — the `Pin` that encodes the current pan offset and zoom level; write to it to change the view programmatically
- **`Boxes.inscribeCircle()`** — computes the largest circle that fits inside a rectangle, used here to size the viewport boundary to the container
- **`Fits.boxInCircle()`** — calculates the origin pin that fits a world-space bounding box into a circle, with optional padding via `Circles.inflate()`