# Animated Panning

Animate the viewport origin to bring a clicked shape to the centre.

## How it works

The view of a viewport is the pin `viewport.origin`. `Viewports.panPointTo` returns a new origin in which a world point lands on a given screen point, with the same zoom. `Animate.pin.easedAt` then moves the origin there over `panDuration` milliseconds.

```ts
for (const shape of shapes) {
    const svg    = Svg.get(shape)
    const center = Boxes.center(Rectangles.boundingBox(shape))

    svg.addEventListener("click", () => {
        const vCenter = Boxes.center(viewport.boundary)
        const target  = Viewports.panPointTo(viewport.origin, center, vCenter)
        Animate.pin.easedAt(viewport.origin, target, vCenter, panDuration)
    })
}
```

`Svg.get` returns the SVG element of a visual, so plain DOM listeners work. The centre marker is drawn on the `frame` layer and does not move.

The content is fitted once with `Fits.boxInBox` at start, not on every resize, so it does not undo the user's navigation.

## API

- `Viewports.panPointTo`: the origin that moves a world point to a screen point
- `Animate.pin.easedAt`: eases a pin to a target, interpolating around a screen point
- `Svg.get`: the SVG element of a visual
- `Rectangles.boundingBox`: the bounding box of a shape

## See also

- `viewport/01-box-viewport`
- `viewport/04-animated-focus`
