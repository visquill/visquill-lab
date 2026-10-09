# Cycle By

Change which vertex of a shape comes first, without moving any vertex.

## How it works

`Shapes.cycleBy` rotates the vertex list: with an offset of 1, the old vertex 1 becomes vertex 0 and the old vertex 0 moves to the end. The outline stays the same. What changes is everything that depends on the order, such as where `Polygons.pointAt` starts or where a slice wraps.

```ts
Shapes.cycleBy(arrowVertices, offset, arrow)
```

The labels read their position from the cycled shape, `arrow.at(i)`, so label "0" moves to the new first vertex. Each label sits 16 px beyond its vertex on the line from the center:

```ts
const pin = Pins.placeAndAlignOnSegment({ x: cx, y: cy }, arrow.at(i), 1)
Pins.getPosition(Pins.moveForward(pin, 16), label)
```

The slider snaps to whole offsets with `Points.placeOnSegment`.

## API

- `Shapes.cycleBy`: shifts the start of a shape's vertex list
- `Pins.placeAndAlignOnSegment`, `Pins.moveForward`: place the labels outside the vertices
- `Points.closestPointOnSegment`, `Points.relativePositionOnSegment`, `Points.placeOnSegment`: the stepped slider

## See also

- `geometry/polygons-04-slice`
