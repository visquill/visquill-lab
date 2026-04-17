# Text Animation

Animating text transitions character by character through a sequence of strings.

## What you see

A large text label and a Start button. Click the button and the text animates through a series of strings one at a time, each new string replacing the previous with a character-by-character transition. The sequence runs to the end and stops.

## Key concepts

- **`Animate.text(label, target, duration, options)`** — animates a text label to a new string; `durationMode: "per-character"` scales the total duration by string length, `deconstruction: "stepwise"` removes characters one by one before building the new ones
- **`onComplete` callback** — used here to chain animations: when one text transition finishes it increments an index, which triggers the next via a reactive block
- **Two-reactive-block sequencing** — one block watches the index and starts the text animation; another watches a toggle that fires when the animation completes and advances the index; this avoids nesting callbacks