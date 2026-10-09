# Mirror

Reflect a shape across the line through two points.

## How it works

`Shapes.mirror` reflects every vertex across the infinite line through `p1` and `p2`. The two handles only fix the line's position and direction; their distance does not matter:

```ts
Reactive.do([hP1, hP2], () => {
    Shapes.mirror(original, hP1, hP2, mirrored)
    // …
}, true)
```

To show that the line is infinite, the drawn axis runs 80 px past both handles. `Polylines.extend` lengthens the line through the two handles at each end:

```ts
Polylines.extend([hP1, hP2], 80, 80, axisLine)
```

The labels sit below each shape's `Shapes.centroid`.

## API

- `Shapes.mirror`: reflects a shape across a line through two points
- `Shapes.centroid`: the average position of a shape's vertices
- `Polylines.extend`: lengthens a polyline at its start and end

## See also

- `geometry/points-02-reflection-rotation`
