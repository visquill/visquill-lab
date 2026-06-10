# Swarm

Population-level `Animate.point.follow` with varying alpha.

## What you see

Twelve dots chase an invisible attractor that orbits a circle. The four largest, darkest dots use alpha 0.16 and stay close to the attractor. The mid-sized dots use alpha 0.08–0.12 and trail further. The four smallest, faintest dots use alpha 0.04 and lag far behind. When the attractor slows into a waypoint the swarm compresses; as it accelerates away it stretches into a comet tail.

## Key concepts

- **`Animate.point.follow(dot, target, { alpha })`** — each dot registers a separate `Reactive.do([attractor], …)` that calls `follow` with its own alpha; because the attractor is updated every frame (by `point.eased`), the reactive block fires every frame, so `follow` is continuously re-applied rather than needing a game loop
- **Alpha as visible lag** — all twelve dots share the same target; the only variable is alpha; placing them in the same scene makes the relationship between alpha and pursuit distance immediately legible
- **Speed variation amplifies the effect** — the attractor uses `easeInOutSine` rather than linear so it decelerates into waypoints and accelerates away; this periodically compresses and stretches the swarm tail, making the alpha differences more visible than constant-speed motion would
- **Invisible attractor** — hiding the attractor (`r: 0` in CSS) focuses attention on the followers; the faint dashed orbit ring gives just enough spatial context to understand the motion without distracting from the follow dynamics