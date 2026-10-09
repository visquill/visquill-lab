# Inflate & Pad

Grow or shrink a box, either by the same amount on opposite sides or per side.

## How it works

Both results start from the same fixed source box, which never changes.

`Boxes.inflate` adds `dx` to the left and to the right side, and `dy` to the top and to the bottom. A `dx` of 20 makes the box 40 pixels wider.

```ts
Reactive.do([dx, dy], () => {
    Boxes.inflate(source, dx.value, dy.value, inflateResult)
})
```

`Boxes.pad` takes one amount per side, so the box can grow on one side and shrink on another, for example to leave room for a label.

```ts
Reactive.do([padL, padT, padR, padB], () => {
    Boxes.pad(source, padL.value, padT.value, padR.value, padB.value, padResult)
})
```

Negative values shrink. Each slider returns a `Real` that `Values.lerp` maps from the slider position to its range.

## API

- `Boxes.inflate`: grows a box by `dx` on the left and right and `dy` on top and bottom
- `Boxes.pad`: grows each side of a box by its own amount
- `Boxes.spannedBox`: the source box from two corners
- `Values.lerp`: maps the slider position to a value

## Notes

Shrinking by more than half the width or height is not clamped: the box turns inside out and `Boxes.isEmpty` becomes true.

## See also

- `geometry/boxes-01-basics`
