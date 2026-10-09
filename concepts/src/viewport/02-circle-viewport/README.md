# Circle Viewport

The same viewport as the box version, clipped to a circle.

## How it works

`canvas.viewports.circle` works like `canvas.viewports.box`, but `viewport.boundary` is a `Circle`. `Boxes.inscribeCircle` sets it to the largest circle inside the inset frame. The rim sits on the `frame` layer, so it is not clipped and does not pan or zoom.

```ts
const viewport = canvas.viewports.circle({ panning: true, zooming: true })
// …
const rim = frame.visuals.circle("rim")
// …
Reactive.do([rvg.frame], () => {
    Boxes.inscribeCircle(Boxes.inflate(rvg.frame, -viewportInset, -viewportInset), viewport.boundary)
    Circles.copy(viewport.boundary, rim)
})
```

`Fits.boxInCircle` writes the `viewport.origin` pin that fits the bounding box of the content into a slightly smaller circle.

```ts
Reactive.do([rvg.frame], () => {
    Fits.boxInCircle(
        content.getVisualBoundingBox(),
        Circles.inflate(viewport.boundary, -fitPadding),
        viewport.origin
    )
})
```

## API

- `canvas.viewports.circle`: a viewport clipped to a circle, with optional panning and zooming
- `Boxes.inscribeCircle`: the largest circle inside a box
- `Fits.boxInCircle`: the origin that fits a box into a circle
- `Circles.inflate`: leaves padding inside the boundary

## See also

- `viewport/01-box-viewport`
- `viewport/06-multiple-viewports`
