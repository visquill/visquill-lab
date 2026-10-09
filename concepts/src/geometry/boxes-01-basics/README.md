# Inspection

Build a box from two points and read its sides, corners and measurements.

## How it works

`Boxes.spannedBox` makes the smallest box that contains both handles, so either handle can be dragged past the other. All other parts of the demo react to the box.

```ts
const box = canvas.visuals.box("box-fill")
Reactive.do([hTL, hBR], () => {
    Boxes.spannedBox(hTL, hBR, box)
})
```

The side functions return segments, the corner functions return points:

```ts
Reactive.do([box], () => {
    const t = Boxes.topSide(box)
    // …
    Segments.copy(t, sides[0].seg)
    // …
})
```

The info panel calls one function per line, for example `Boxes.aspectRatio(box)`. Each returns a `Real` (or a `Bool`), so `.value` gives the number.

## API

- `Boxes.spannedBox`: the smallest box containing two points
- `Boxes.topSide`, `Boxes.bottomSide`, `Boxes.leftSide`, `Boxes.rightSide`: the sides as segments
- `Boxes.topLeft`, `Boxes.topRight`, `Boxes.bottomLeft`, `Boxes.bottomRight`, `Boxes.center`: named points
- `Boxes.width`, `Boxes.height`, `Boxes.area`, `Boxes.circumference`: size
- `Boxes.diameter`: length of the diagonal
- `Boxes.aspectRatio`, `Boxes.longestSide`, `Boxes.shortestSide`: proportions
- `Boxes.isSquare`, `Boxes.isEmpty`: checks; a box is empty when its area is zero or negative

## See also

- `geometry/boxes-02-growing`
- `geometry/rectangles-02-accessors`
