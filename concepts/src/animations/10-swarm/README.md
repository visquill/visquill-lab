# Swarm

The `alpha` of `Animate.point.follow` sets how closely a point chases its target.

## How it works

An invisible attractor hops between six waypoints on a circle (`Circles.pointAt`) with `Animate.point.eased`. Twelve dots follow it, each with its own `alpha`, from 0.10 down to 0.01. Whenever the attractor moves, each dot's reaction re-aims its follow:

```ts
Reactive.do([attractor], () => {
    Animate.point.follow(dot, attractor, {alpha})
})
```

A higher `alpha` catches up faster, a lower one lags further behind, so the dots spread out into a tail. The attractor uses `easeInOutSine` and slows down at every waypoint: the swarm bunches up there and stretches out in between.

## API

- `Animate.point.follow`: moves a point towards a target on every frame; `alpha` sets how fast
- `Animate.point.eased`: animates a point to a target in a fixed time
- `Circles.circleAt`: a circle from centre and radius
- `Circles.pointAt`: the point at a ratio along a circle

## See also

- `animations/03-planets`
