# Waveform

One-shot shape morph animation using `Animate.morph`.

## What you see

A polyline cycles through four signal waveforms — flat, sine, square, sawtooth — looping forever. Each transition uses easing that matches the character of the target shape: the sine transition flows smoothly, the square wave snaps, the sawtooth ramps.

## Key concepts

- **`Animate.morph` with `onComplete`** — each transition is a one-shot morph; `onComplete` advances `state.value` by 1, re-triggering the reactive block for the next step; the same state machine pattern as the scalar demo, now driving a shape instead of a number
- **Poses as frozen `Point[]`** — each waveform is sampled once at startup by the `pose` helper; x coordinates are fixed across all poses (only y varies), so the morph moves vertices purely vertically
- **Easing matches waveform character** — `easeInOutSine` for smooth curves, `easeInOutCubic` for the abrupt square wave snap, `easeInCubic` for the accelerating sawtooth ramp; the easing choice is part of the storytelling
- **No sync code** — `morph` writes directly into the polyline's `elements` in place; the visual updates automatically with no `Reactive.do` needed for display