# Transform

Move, rotate and scale a shape in one step with a pin.

## How it works

`Shapes.transform` reads a pin as a transform: its position is the translation, its orientation's angle the rotation, and the orientation's length the scale factor. The arrow's vertices are given around (0, 0), so the pin places that origin.

The anchor handle is itself a pin. Dragging the tip changes its orientation:

```ts
Reactive.do([hTip],()=>{
    Pins.withOrientation(hAnchor,Vectors.direction(hAnchor,hTip),hAnchor)
})
```

The main reaction divides the orientation's length by its start length, so the start position means scale 1, then transforms the vertices into the visual:

```ts
const pin = Pins.withLength(hAnchor,Pins.len(hAnchor).value/refLen)
// …
Shapes.transform(arrowVertices, pin, arrow)
```

A third reaction moves the tip along with the anchor, so dragging the anchor only translates.

## API

- `Shapes.transform`: applies a pin's translation, rotation and scale to a shape
- `Pins.withOrientation`: sets a pin's orientation vector
- `Pins.withLength`, `Pins.len`: set and read the orientation's length
- `Pins.moveForward`: places the tip at the end of the orientation
- `Pins.angle`: the rotation shown in the info panel

## See also

- `geometry/05-fitting`
- `geometry/shapes-01-orientate`
