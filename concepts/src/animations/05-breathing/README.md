# Breathing

Loop a shape morph between two poses.

## How it works

`state` is 0 or 1. When it is 0, a reaction morphs the polygon to the tense pose; when it is 1, back to the relaxed pose. Each morph flips `state` when it completes, so the loop keeps itself going. The build-up is slow (`easeInOutSine`, 1400 ms), the release shorter (`easeOutCubic`, 900 ms).

A pose is ten points that alternate between two circles around the centre:

```ts
function pose(outerRadius: number, innerRadius: number): Point[] {
    // …
    return Array.from({ length: VERTICES }, (_, i) =>
        Circles.pointAt(i % 2 === 0 ? outer : inner, i / VERTICES)
    )
}
```

The circles are built with `Circles.circle3P` through 12, 3 and 6 o'clock, so the first point is at the top. With radii 80 and 72 the shape is almost round; with 120 and 28 it is a star.

## API

- `Animate.shape.morph`: animates the vertices of a shape to a target pose
- `Circles.pointAt`: the point at a ratio along a circle
- `Circles.circle3P`: the circle through three points, starting at the first
- `Reactive.do`: runs a function now and whenever its inputs change

## See also

- `animations/04-waveform`
- `animations/08-clock`
