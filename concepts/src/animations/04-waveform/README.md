# Waveform

`Animate.shape.morph` moves every vertex of a shape to a target pose.

## How it works

Each pose is an array of 64 points, sampled from a function once at startup: flat, sine, square, sawtooth and back to flat. All poses share the same x values, so the vertices only move up and down.

A reaction morphs the polyline to the next pose; when the morph completes it advances `state`, which starts the next one. Each step has its own duration and easing.

```ts
Animate.shape.morph(waveform, poses[idx + 1], duration, {
    easing,
    onComplete: () => { state.value += 1 }
})
```

The morph writes into the polyline's own points, so no code is needed to keep the visual in sync.

## API

- `Animate.shape.morph`: animates the vertices of a shape to the points of a target pose
- `Reactive.do`: runs a function now and whenever its inputs change
- `canvas.visuals.polyline`: the polyline that is morphed

## See also

- `animations/05-breathing`
- `animations/02-state-machine`
