# Bar Anchoring

How the anchor ratio controls where a pin sits along a bar's width.

## What you see

Three bars sharing the same pin, drawn in different colours. The green bar has anchor 0.0 — the pin sits at its left edge. The orange bar has anchor 0.5 — the pin sits at its centre. The purple bar has anchor 1.0 — the pin sits at its right edge. A connector between the position handle and direction handle visualises the pin orientation. Drag the position handle to move all three bars together; drag the direction handle to rotate them and see how each bar swings around its own anchor point.

## Key concepts

- **`Bars.fromAnchoredPin(pin, anchorRatio, width, height, left, result)`** — places the bar so that the fraction `anchorRatio` of its width aligns with the pin position; 0.0 = left edge, 0.5 = centre, 1.0 = right edge
- **`Bars.fromPin`** — equivalent to `fromAnchoredPin` with anchor 0.5