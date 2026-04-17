# Orbit

Point-based animation using `Animate.moveTo` and `Animate.followPoint`.

## What you see

An orange courier token hops between five draggable planets in a loop. A faded ghost token trails behind it via exponential interpolation. A dashed line connects the two, making the lag between eased and follow immediately visible. Drag any planet to reshape the path — the courier will aim at its new position the next time it visits.

## Key concepts

- **`Animate.moveTo` as the state transition driver** — each hop is a single `moveTo` call on a reactive point ref instead of the two separate `eased(x, …)` + `eased(y, …)` calls the scalar state machine required; the `onComplete` callback advances `state.value` exactly as before
- **`Animate.followPoint` for the ghost** — called inside `Reactive.do([position], …)` whenever the courier's animated position changes, it continuously re-aims the ghost toward the courier's current location; the low `alpha: 0.06` keeps the ghost visibly behind even on short hops
- **Separation of data and display** — `position` and `ghostPos` are plain reactive point refs; the state machine only writes values, never touches visuals directly; two separate `Reactive.do` blocks sync each ref to its visual, mirroring the `x`/`y`/`angle` pattern from the state machine demo
- **Draggable planet handles** — planets are `canvas.handles.disk()` rather than fixed visuals, so the courier always aims at their current position at the moment each hop starts; no re-registration needed
- **Per-hop easing variety** — `EASINGS` cycles through four functions so each leg has a distinct feel, demonstrating that easing applies uniformly across both axes in 2D space (`easeOutBack` visibly overshoots the target planet before settling)