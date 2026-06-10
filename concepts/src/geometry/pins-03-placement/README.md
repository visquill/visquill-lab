# Pins - Placement & Orientation

Place pins along and beside a segment, with and without orientation alignment. Plus `lookAt` for pointing a pin at an arbitrary target.

## What you see

A draggable segment with two endpoint handles. A slider controls a ratio (0–1) along the segment. Four pins are shown simultaneously at that ratio:

- **Grey (×2)** — `placeOnSegment` and `placeBesideSegment`: position is set, orientation is left unchanged (pointing right by default)
- **Green** — `placeAndAlignOnSegment`: position on the segment, orientation aligned to the segment direction
- **Orange** — `placeAndAlignBesideSegment`: offset perpendicularly from the segment, orientation aligned

In the lower half, a purple pin always faces a draggable target handle via `lookAt`. A dashed connector shows the relationship between pin and target.

## Key concepts

- **`Pins.placeOnSegment(p1, p2, ratio)`** — sets position at `ratio` along the segment; orientation is untouched
- **`Pins.placeAndAlignOnSegment(p1, p2, ratio)`** — same position, but also rotates orientation to match the segment direction; the `AndAlign` suffix is the only difference from `placeOnSegment`
- **`Pins.placeBesideSegment(p1, p2, ratio, distance, left)`** — offsets the pin perpendicularly from the segment; orientation unchanged
- **`Pins.placeAndAlignBesideSegment(p1, p2, ratio, distance, left)`** — same offset position, orientation aligned; compare the grey and orange arrows to see the effect
- **`Pins.lookAt(pin, target)`** — rotates orientation to point from the pin's current position toward `target`; position is unaffected