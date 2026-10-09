# Nested Viewports

A viewport can live inside the content of another viewport and keeps its own pan and zoom.

## How it works

The children are created on the parent's `content` layer instead of the canvas. Their boundaries are set in the parent's world coordinates, so they move and scale with the parent, while each one still has its own `origin`.

```ts
const child = parent.viewports.box({ panning: true, zooming: true })

Boxes.centeredBox(
    [col * gridSpacing, row * gridSpacing],
    childBoxSize, childBoxSize,
    child.boundary
)
```

Without an output argument, `Fits.boxInBox` and `Fits.boxInCircle` return the fitting origin instead of writing it. `Animate.pin.eased` then animates the origin to it. The Fit All button runs this for every child and for the parent.

```ts
fitFunctions.push(() => {
    const target = Fits.boxInBox(
        child.content.getVisualBoundingBox(),
        Boxes.inflate(child.boundary, -childFitPadding, -childFitPadding)
    )
    Animate.pin.eased(child.origin, target, fitDuration)
})
```

Mouse events go to the innermost viewport under the pointer, so dragging inside a child pans only that child.

## API

- `canvas.viewports.box`, `canvas.viewports.circle`: also available on a viewport's `content`
- `Fits.boxInBox`, `Fits.boxInCircle`: return the fitting origin
- `Animate.pin.eased`: eases an origin to a target
- `Boxes.pad`: leaves room for the button below the parent
- `Svg.get`: the click target of the button

## See also

- `viewport/01-box-viewport`
- `viewport/02-circle-viewport`
