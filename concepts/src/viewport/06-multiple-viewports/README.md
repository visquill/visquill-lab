# Nested Viewports

A parent viewport containing four child viewports in a checkerboard of boxes and circles, each with independent pan and zoom.

## What you see

A dashed rectangle (the parent viewport) contains a 2×2 grid of child viewports: box viewports at the top-left and bottom-right, circle viewports at the top-right and bottom-left.  Each child is filled with diamond shapes and has its own solid-coloured rim.  You can pan and zoom each child independently, or pan and zoom the parent to move all four children together.  A blue "Fit All" button below the parent animates every viewport back to a fitted state.

## How it builds on earlier demos

This demo combines concepts from across the series:

| From demo | Concept reused here |
|---|---|
| Circle Viewport | `viewports.circle()`, `Fits.boxInCircle()`, `Circles.circleAt()` |
| Box Viewport | `viewports.box()`, `Fits.boxInBox()`, `Boxes.centeredBox()` |
| Animated Focus | `Animate.pin.eased()` for smooth viewport transitions |

The new concept is **nesting**: child viewports are created on the parent's `content` layer (`content.viewports.box()` / `content.viewports.circle()`), so they live inside the parent's coordinate system and move with it.

## Key concepts

- **Nested viewports** — `parent.content.viewports.box()` creates a child viewport inside the parent's content; the child pans and zooms independently while still being subject to the parent's transform
- **`Boxes.centeredBox(center, w, h, output)`** — positions a child viewport's boundary at a specific point in the parent's world space
- **`Boxes.pad(box, top, right, bottom, left, output)`** — asymmetric inset, used here to leave extra room at the bottom for the button
- **`Fits.boxInBox()` / `Fits.boxInCircle()` (2-arg form)** — when called without an output parameter, these return a target `Pin` instead of writing directly to the origin; the target can then be passed to `Animate.pin.eased()` for an animated transition
- **`Svg.get(visual)`** — used here to attach a click listener to the button's SVG element