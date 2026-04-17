# Breathing

Shape morph animation using `Animate.sequenceShape`.

## What you see

A ten-vertex polygon loops continuously between a relaxed near-circle and a sharp star, with a slight overshoot on the return that makes it feel like something releasing tension.

## Key concepts

- **`Animate.sequenceShape` with `loop: true`** — the entire animation is two lines; no state machine, no `onComplete` counter, no reactive integer needed
- **Poses as `Point[]`** — each pose is a plain array of `{x, y}` objects computed once at startup; `sequenceShape` snapshots them at call time and morphs between them
- **Per-step easing in 2D** — `easeInOutSine` gives the expansion a slow build; `easeOutBack` makes the contraction slightly overshoot the relaxed pose before settling, which sells the organic feel; both easings apply uniformly across all ten vertices simultaneously
- **No sync code** — because `sequenceShape` writes directly into `shape.elements` in place, the polygon visual updates automatically with no `Reactive.do` needed