# Bounding Box

Find the axis-aligned box around one shape, or around many.

## How it works

`Shapes.boundingBox` returns the smallest box with horizontal and vertical sides that contains a shape. `Shapes.boundingBoxOfShapes` does the same for a whole list. Each shape is built from a `Symbols` function at its handle:

```ts
builtShapes.forEach((shape, i) => {
    Shapes.copy(shape, shapeVisuals[i])
    const bb = Shapes.boundingBox(shape)
    Boxes.copy(bb, indivBoxes[i])
})

const collective = Shapes.boundingBoxOfShapes(builtShapes)
Boxes.copy(collective, collectiveBox)
```

The handles are large transparent disks, so the whole shape can be grabbed, not only its center.

## API

- `Shapes.boundingBox`: the axis-aligned box around a shape
- `Shapes.boundingBoxOfShapes`: the axis-aligned box around several shapes
- `Symbols.diamond`, `Symbols.rectangle`, `Symbols.square`, `Symbols.triangle`: the shapes, centered on a point
- `Shapes.copy`, `Boxes.copy`: write the results into the visuals

## See also

- `geometry/boxes-01-basics`
