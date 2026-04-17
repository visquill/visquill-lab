# Masked Background

How to use layer masking to create a spotlight effect — the lens reveals data through a darkened overlay.

## What you see

Colored dots scattered across a darkened canvas. A circular window cuts through the darkness, showing the points underneath in full color. Drag the lens to move the spotlight. Use the radius control to change its size.

## Key concepts

- **`cover.mask.box(frame, "white")`** — registers the full frame as an opaque (white) mask region, meaning the cover layer is visible everywhere by default
- **`cover.mask.circle(handle, radius, "black")`** — punches a transparent (black) hole in the mask at the lens position; SVG mask convention: white = show, black = hide
- **Reactive mask** — the mask hole is pinned to the drag handle, so moving the handle repositions the cutout automatically with no extra `Reactive.do()` needed
- **Layer composition** — points live on `pointLayer` below the cover; the cover darkens everything; the lens ring sits above as a visual boundary; three independent layers make the stacking explicit and easy to adjust