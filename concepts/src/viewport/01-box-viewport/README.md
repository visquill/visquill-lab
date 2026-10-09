# Box Viewport

A viewport clips its content to a rectangle and lets the user pan and zoom inside it.

## How it works

`canvas.viewports.box` returns a viewport with two layers. Shapes on `content` are clipped to `viewport.boundary` and move with pan and zoom. Shapes on `frame` are drawn on top and stay fixed, so the rim goes there.

```ts
const viewport = canvas.viewports.box({ panning: true, zooming: true })
const content = viewport.content
const frame   = viewport.frame

const rim = frame.visuals.box("rim")
```

The boundary is an ordinary `Box`. It is set from the container on every resize, and `Fits.boxInBox` writes the `viewport.origin` pin that fits all content into it.

```ts
Reactive.do([rvg.frame], () => {
    Boxes.inflate(rvg.frame, -viewportInset, -viewportInset, viewport.boundary)
    Boxes.copy(viewport.boundary, rim)
})

Reactive.do([rvg.frame], () => {
    Fits.boxInBox(
        content.getVisualBoundingBox(),
        Boxes.inflate(viewport.boundary, -fitPadding, -fitPadding),
        viewport.origin
    )
})
```

## API

- `canvas.viewports.box`: a viewport clipped to a rectangle, with optional panning and zooming
- `Boxes.inflate`: shrinks the frame to the viewport boundary
- `Fits.boxInBox`: the origin that fits a box into another box
- `Symbols.diamond`: the content shapes

## Notes

The fit runs again on every resize, so it also undoes the user's pan and zoom.

## See also

- `viewport/02-circle-viewport`
- `viewport/03-animated-panning`
