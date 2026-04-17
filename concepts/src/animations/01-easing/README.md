# Easing Functions

Eight easing curves compared side by side through animated bars.

## What you see

Eight rows, one per easing function. Each row has a labeled button on the left and a colored bar on the right. Click any button to animate all bars to a new value — each bar reaches the target at the same time but travels there differently. Click again to animate back.

## Key concepts

- **`Animate.eased(value, target, duration, { easing })`** — animates a reactive `Real` to a target over a fixed duration using the given easing function; the visual updates automatically because the bar's width is bound to that value
- **`Attach.rectangleHeightToValue(bar, value)`** — creates a persistent reactive binding between a rectangle's dimension and a `Real`; no `Reactive.do()` needed
- **Easing as a first-class value** — easing functions (`Animate.linear`, `Animate.easeOutCubic`, etc.) are plain functions passed as options, so they can be stored in an array and iterated