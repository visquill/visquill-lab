# Attach

Five focused panels showing how `Attach` binds one element to another without any `Reactive.do`.

## What you see

Two rows of interactive panels, each demonstrating one `Attach` function. Drag any handle and watch everything attached to it reposition automatically. A bottom panel shows that attaching a layer's anchor moves the entire group at once.

## Key concepts

- **Declarative positioning** — `Attach` replaces `Reactive.do` for common positioning tasks; `Attach.pointToPoint(label, handle, { offset })` is equivalent to writing a reactive block that copies the handle position and adds an offset, but in one line
- **Attach targets can chain** — the `follower` point in panel 1 is itself attached to the handle, and the label is attached to the follower; `Attach` calls compose naturally
- **`pointToSegment`** — places a pin at a parametric position along a segment (default: center); no geometry math required
- **`rectangleToSegment`** — stretches a rectangle along a segment and offsets it perpendicularly; useful for bar charts and annotation bands
- **`circleToCircle`** — keeps an outer circle a fixed number of pixels larger than an inner one, even as the inner circle is resized
- **Attaching a layer anchor** — `Attach.pointToPoint(group.anchor, handle)` moves the entire layer's coordinate space; everything drawn on the layer follows without knowing its canvas position