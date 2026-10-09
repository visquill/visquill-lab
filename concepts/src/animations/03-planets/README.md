# Orbit

Two ways to animate a point: to a target in a fixed time, or chasing a target.

## How it works

The courier hops from planet to planet with `Animate.point.eased`. Each hop takes the same time and, when it completes, advances `state`, which starts the next hop. Each hop takes its easing function from a list of five.

```ts
Animate.point.eased(courier, target, HOP_DURATION, {
    easing,
    onComplete: () => { state.value += 1 }
})
```

The ghost has no duration. `Animate.point.follow` moves it towards the courier on every frame, and a reaction re-aims it whenever the courier moves. A low `alpha` keeps it behind; when the courier stops, the ghost catches up.

```ts
Reactive.do([courier], () => {
    Animate.point.follow(ghost, courier, { alpha: 0.06 })
})
```

The planets are draggable handles, and each hop targets a handle, so dragging a planet changes the route.

## API

- `Animate.point.eased`: animates a point to a target in a fixed time
- `Animate.point.follow`: moves a point towards a target on every frame
- `canvas.handles.disk`: a draggable point
- `Attach.pointToPoint`: keeps the labels next to their planets

## See also

- `animations/10-swarm`
- `animations/02-state-machine`
