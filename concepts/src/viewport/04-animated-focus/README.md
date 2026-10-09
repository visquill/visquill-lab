# Animated Focus

Use a pin's position, direction, and length as a camera: centre, rotate, and zoom the viewport to it.

## How it works

Each pin gets a direction with `Pins.rotateBy` and a length with `Pins.withLength`. The line from each marker shows the direction; its length grows with the pin's length.

```ts
const pin = content.values.pin([x, y])
Pins.withLength(Pins.rotateBy(pin, angle), length, pin)
```

On click, `Viewports.focusOnScaled` returns the origin that puts the pin on the centre of the viewport, rotates the view so the pin points to the right, and sets the zoom to the pin's length. A pin of length 2 is shown at zoom 2, a pin of length 0.5 at zoom 0.5.

```ts
svg.addEventListener("click", () => {
    const vCenter = Boxes.center(viewport.boundary)
    const target  = Viewports.focusOnScaled(pin, vCenter)
    Animate.pin.easedAt(viewport.origin, target, vCenter, focusDuration)
})
```

`Animate.pin.easedAt` eases pan, zoom, and rotation together.

## API

- `Viewports.focusOnScaled`: the origin that centres, rotates, and zooms to a pin
- `Pins.rotateBy`: turns a pin's direction
- `Pins.withLength`: sets a pin's length
- `Pins.moveForward`: the end of the direction line
- `Animate.pin.easedAt`: eases the origin to the target

## See also

- `viewport/03-animated-panning`
- `viewport/05-animated-path`
