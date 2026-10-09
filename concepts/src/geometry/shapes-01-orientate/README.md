# Orientate

Turn a shape around an anchor so that one direction points where another one does.

## How it works

`Shapes.orientate` takes two vectors instead of an angle: the shape's own "forward" direction and the direction it should face. It turns the shape around the anchor by the angle between them. The vertex list can be passed directly as the shape; the result goes into the visual polygon:

```ts
const srcDir = Vectors.direction(anchor, hSource)
const tgtDir = Vectors.direction(anchor, hTarget)
// …
Shapes.orientate(arrowVertices, anchor, srcDir, tgtDir, arrow)
```

Only the directions count, not the lengths. The angle shown below the anchor comes from `Vectors.angleTo`, measured clockwise on screen.

## API

- `Shapes.orientate`: rotates a shape so a source direction turns into a target direction
- `Vectors.direction`: the vector from the anchor to a handle
- `Vectors.angleTo`: the angle between two directions

## See also

- `geometry/shapes-04-transform`
- `geometry/pins-03-placement`
