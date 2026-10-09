# Clock

Animate a number and let a reaction turn it into geometry.

## How it works

Each hand has one `Real`: how far it has turned, as a fraction of a full turn. A reaction places the hand on a circle at that fraction. Once a second, `Animate.real.eased` moves each value on by its share of a turn, and the reaction redraws the hand on every frame.

```ts
Reactive.do([turn], () => {
    Segments.segment(Circles.pointAt(tail, turn.value + 0.5), Circles.pointAt(tip, turn), segment)
})
// …
Animate.real.eased(secTurn, secTurn.value + 1 / 60, 300, {
    easing: EasingFunctions.easeOutBack
})
```

`dial()` builds each circle with `Circles.circle3P` through 12, 3 and 6 o'clock, so ratio 0 is 12 o'clock and ratios run clockwise. Ratios above 1 wrap around. The values only grow, so the second hand never runs backwards at 12.

## API

- `Animate.real.eased`: animates a `Real` to a target value
- `Reactive.do`: runs a function now and whenever its inputs change
- `Circles.pointAt`: the point at a ratio along a circle
- `Circles.circle3P`: the circle through three points, starting at the first
- `Segments.segment`: writes a segment into an existing visual

## See also

- `animations/01-easing`
- `geometry/circles-03-sampling`
