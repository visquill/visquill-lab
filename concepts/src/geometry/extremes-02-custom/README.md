# Custom Extreme

Find the extreme point by your own rule, here: furthest in any direction.

## How it works

`Extremes.extreme` takes a comparison of two points. It returns a negative number when the first point counts as more extreme. Here the rule is the projection onto a direction, so the winner is the point furthest along it. The direction comes from the slider's angle:

```ts
Reactive.do([angle, ...handles], () => {
    const dir = Vectors.fromAngle(angle)

    const result = Extremes.extreme(handles, (p, q) =>
        // negative when p is more extreme
        Vectors.dotProduct(q, dir).value - Vectors.dotProduct(p, dir).value
    )
    // …
})
```

At angle 0 the direction points right, so the result is the same as `Extremes.rightMost`. The four fixed directions are special cases of this rule.

## API

- `Extremes.extreme`: the most extreme point under a comparison
- `Vectors.fromAngle`: a unit direction from an angle in radians
- `Vectors.dotProduct`: the dot product of two vectors
- `Vectors.scale`, `Vectors.add`: draw the projection line and the direction arrow
- `Values.lerp`: maps the slider position to an angle

## See also

- `geometry/extremes-01-basic`
