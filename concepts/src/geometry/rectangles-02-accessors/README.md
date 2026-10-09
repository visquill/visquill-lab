# Accessors

Read the corners, sides and measurements of a rotated rectangle.

## How it works

The rectangle is a visual and a sender. The other reactions list only the rectangle, so they run after it has been rebuilt from the pin and the sliders:

```ts
Reactive.do([pin, width, height], () => {
    Rectangles.centeredRectangle(pin, width.value, height.value,  rect)
})
```

Corners and sides follow the rectangle's own orientation, not the screen axes: after a turn, `Rectangles.topLeft` may be anywhere.

```ts
Reactive.do([rect], () => {
    const ts = Rectangles.topSide(rect)
    // …
    Segments.copy(ts, topSeg)
    // …
})
```

The measurements return `Real` values: `Rectangles.width(rect).value`.

## API

- `Rectangles.centeredRectangle`: a rectangle centered on a pin
- `Rectangles.topLeft`, `Rectangles.topRight`, `Rectangles.bottomLeft`, `Rectangles.bottomRight`: the corners
- `Rectangles.topSide`, `Rectangles.bottomSide`, `Rectangles.leftSide`, `Rectangles.rightSide`: the sides as segments
- `Rectangles.width`, `Rectangles.height`, `Rectangles.area`, `Rectangles.diagonal`: measurements
- `Segments.copy`: copies a side into a visual segment

## See also

- `geometry/rectangles-01-basic`
- `geometry/boxes-01-basics`
