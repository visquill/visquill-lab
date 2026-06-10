# Clock

Time-driven animation using `Animate.real.eased` and `Pins.withOrientation`.

## What you see

A clock face with hour, minute, and second hands, initialised from the system clock and ticking in real time. The second hand snaps to each position with a slight mechanical overshoot; the minute and hour hands glide smoothly.

## Key concepts

- **`Animate.real.eased` driving orientation** — each hand's angle is a reactive `Real`; a `Reactive.do` block calls `Pins.withOrientation` whenever it changes, translating the scalar angle into a layer rotation; the same pattern as the state machine demo, now applied to three independent values simultaneously
- **`setInterval` as a tick source** — unlike the state-machine demos that chain `onComplete` callbacks, the clock is driven by a 1 000 ms interval; each tick fires three independent `eased` calls, one per hand
- **Running angles** — angles accumulate rather than wrapping at 2π, so the second hand never snaps backward when crossing 12; each tick simply adds π/30 to the running total
- **Easing as character** — `easeOutBack` gives the second hand the overshoot of a real quartz movement; `easeInOutSine` keeps the minute and hour hands imperceptibly smooth
- **Layers as rotation groups** — each hand lives in its own unnamed child layer whose anchor is positioned at the clock centre; rotating the anchor's orientation rotates everything drawn inside that layer