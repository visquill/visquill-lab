# Card Deal

Staggered animation of multiple independent objects using `Animate.point.eased` and `Animate.real.eased`.

## What you see

Seven cards stacked in a deck. Click Deal and they fly out one by one into a fanned arc, each leaving 130 ms after the previous. Click again and they fold back in from the outside toward the centre.

## Key concepts

- **Per-object position + angle** — each card owns a reactive `Point` for position and a reactive `Real` for rotation; a single `Reactive.do([pos, angle], …)` block syncs both to the card layer's anchor pin using the two-step `Vectors.copy(pos, anchor)` → `Pins.withOrientation` pattern from the state machine demo
- **`Animate.point.eased` for 2D movement** — a single call moves the card in both axes simultaneously with one easing curve, rather than two separate `real.eased` calls; the card's `Reactive.do` block fires on every interpolated frame, keeping the visual in sync
- **`setTimeout` for stagger** — each card's deal animation is delayed by `i × 130 ms`; simple and explicit, no state machine or `onComplete` chaining needed for this kind of fire-and-forget stagger
- **Asymmetric stagger on collect** — dealing staggers from the top card outward (linear); collecting staggers by distance from the centre so the outermost cards move first and the middle card lands last, giving a closing-fan feel
- **SVG z-order as a feature** — cards are created 0 → 6 so card 6 sits on top; dealing starts from card 6 so the visible top card always leaves first, matching the physical intuition of picking from a deck