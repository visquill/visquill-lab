# Construction

Build a rotated rectangle from a pin and a size, from an anchor point, or along a baseline.

## How it works

A rectangle in the GDK can be rotated, unlike a box. The pin's orientation sets the rotation. The handles here are pins, so `Pins.rotateBy` can tilt them at the start:

```ts
const pin    = canvas.handles.disk("pin-handle", [leftX, panelY])
Pins.rotateBy(pin,Math.PI / 8,pin)
// …
Reactive.do([pin, width, height], () => {
    Rectangles.centeredRectangle(pin, width, height,  result)
})
```

`Rectangles.anchoredRectangle` puts the pin at a relative position inside the rectangle instead of the center: `xRatio` along the width, `yRatio` along the height. 0.5 and 0.5 give the same rectangle as `centeredRectangle`.

`Rectangles.alongSegment` takes its rotation from a segment and stands on it, to its left or right. The demo decides the side from the toggle handle with a cross product:

```ts
const left  = Vectors.crossProduct(Vectors.direction(p1, p2), Vectors.direction(p1, toggle)).value < 0
Rectangles.alongSegment(p1, p2, height, left, result)
```

## API

- `Rectangles.centeredRectangle`: a rectangle centered on a pin
- `Rectangles.anchoredRectangle`: a rectangle with the pin at relative position (x, y) inside it
- `Rectangles.alongSegment`: a rectangle standing on a segment
- `Pins.rotateBy`: turns a pin
- `Vectors.crossProduct`, `Vectors.direction`: which side of the segment the toggle is on

## Notes

For an unrotated pin, `yRatio` 0 puts the pin on the bottom edge and 1 on the top edge.

## See also

- `geometry/rectangles-02-accessors`
- `geometry/boxes-01-basics`
