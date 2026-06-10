# Animated Focus

Click any pin to smoothly pan *and* zoom — the pin's length controls the zoom level.

## What you see

A rectangular viewport containing scattered pins.  Each pin is shown as a green circle with a thin line extending in its forward direction — longer lines mean larger scale.  Click a pin and the viewport animates to centre on it while zooming to a level derived from the pin's length: short pins zoom in close, long pins zoom out.  A blue centre marker on the frame layer shows the focus target.

## How it builds on Animated Panning

The viewport setup is identical.  Two things change:

| Animated Panning | Animated Focus |
|---|---|
| Plain shapes (diamonds) | Pins with direction and length |
| `Viewports.panPointTo()` — pan only | `Viewports.focusOnScaled()` — pan and zoom |

Because `focusOnScaled` reads the pin's length to determine zoom, each pin produces a different zoom level — something `panPointTo` cannot do.

## Key concepts

- **`Pins`** — geometric primitives that carry position, direction, and length; richer than plain points
- **`Pins.withLength()` / `Pins.rotateBy()`** — set a pin's scale and orientation
- **`Pins.moveForward()`** — returns a point offset along the pin's forward direction, used here to draw the direction indicator
- **`Viewports.focusOnScaled(pin, viewportCenter)`** — computes a target origin that centres the pin *and* sets the zoom level from the pin's length
- **`Animate.pin.easedAt()`** — same eased animation as the Animated Panning demo, but now the target encodes both a new pan offset and a new zoom level