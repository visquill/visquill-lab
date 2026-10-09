# Simple State Machine

Chain animations: each one starts the next when it completes.

## How it works

`state` is a `Real` that holds the current step. A reaction runs the step's animation whenever `state` changes, and every animation adds 1 to `state` in its `onComplete`:

```ts
function animate(variable: Real, value: number){
    Animate.real.eased(variable, value, 1000, {onComplete: ()=>state.value+=1})
}
// …
Reactive.do([state], () => {
    // …
    states[state.value]?.()
})
```

After the last step the reaction sets `state` back to 0, and `angle` from 2π back to 0, which is the same orientation.

The steps only change three numbers: `x`, `y` and `angle`. A second reaction turns them into the anchor of the box's layer with `Pins.withOrientation`, so the box moves and turns with it.

## API

- `Animate.real.eased`: animates a `Real`; `onComplete` runs when it arrives
- `Reactive.do`: runs a function now and whenever its inputs change
- `Pins.withOrientation`: a pin at a point, facing a direction
- `Vectors.fromAngle`: the unit vector for an angle

## See also

- `animations/03-planets`
- `animations/04-waveform`
