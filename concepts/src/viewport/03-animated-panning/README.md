# Animated Panning

Click any shape to smoothly pan the viewport until that shape is centred.

## What you see

A rectangular viewport containing scattered diamond shapes, with a small blue dot marking the viewport centre.  Click any diamond and the view glides until the shape sits directly over the centre marker.  Manual drag-to-pan and scroll-to-zoom still work alongside the click-to-pan behaviour.

## How it builds on Box Viewport

The viewport setup is identical to the Box Viewport demo.  Three new concepts are layered on top:

| Addition | Purpose |
|---|---|
| `Svg.get(shape)` | Access the underlying SVG element to attach a DOM click listener |
| `Viewports.panPointTo()` | Compute a target origin that would place a world-space point at the viewport centre |
| `Animate.pin.easedAt()` | Transition the viewport origin to the target with an eased animation |

Content fitting is done once on load rather than reactively — after that the user navigates via clicks or dragging.

## Key concepts

- **`Svg.get()`** — returns the raw SVG DOM element for any VisQuill visual, enabling standard `addEventListener` calls
- **`Rectangles.boundingBox()`** — computes the bounding box of a shape so its centre can be found with `Boxes.center()`
- **`Viewports.panPointTo(origin, worldPoint, viewportCenter)`** — returns a new origin `Pin` that moves `worldPoint` to `viewportCenter` without changing the zoom level
- **`Animate.pin.easedAt(pin, target, pivot, duration)`** — animates a pin from its current value to `target` over `duration` ms with easing, pivoting around a fixed screen point