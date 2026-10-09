# Fits

Scale and move a shape so it fits centered inside a box or a circle.

## How it works

Each `Fits` function compares a source shape with a target and returns a `Pin`: the translation and uniform scale that put the source centered inside the target. `Shapes.transform` applies the pin to the source and writes the result into a visual shape. The source itself never changes, so the fit can be recomputed from it on every drag step.

```ts
const sourceBox    = Boxes.centeredBox([0, 0], sourceBoxWidth, sourceBoxHeight)
const fittedSource = canvas.visuals.box("source-box")

Reactive.do([corner], () => {
    const pin = Fits.boxInBox(sourceBox, targetBox)
    Shapes.transform(sourceBox, pin, fittedSource)
})
```

The scale is uniform, so the source keeps its aspect ratio. In `boxInBox` the side that would overflow first decides the scale.

## API

- `Fits.boxInBox`: fits a box inside a box
- `Fits.boxInCircle`: fits a box inside a circle
- `Fits.circleInBox`: fits a circle inside a box
- `Fits.circleInCircle`: fits a circle inside a circle
- `Shapes.transform`: applies a pin (translation, rotation, scale) to a shape
- `Boxes.centeredBox`: a box from its center, width and height
- `Circles.circleAt`: a circle from center and radius

## See also

- `geometry/shapes-04-transform`
