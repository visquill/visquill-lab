# Basics

`Attach` binds one object to another, so you don't write the reaction yourself.

## How it works

Each `Attach` call sets up the reaction that keeps its first argument in place relative to the target. Here the target is a segment between two handles. Pins are attached at the center, at a ratio of 0.25, and at a distance to the left of the segment; a rectangle is attached along it. Symbols then follow the pins with `Attach.shapeToPoint`.

```ts
const seg = canvas.visuals.segment("segment", handleA, handleB)
Reactive.linkVertices(seg)
// …
Attach.pointToSegment(ratioPin, seg, {position: 0.25})
// …
Attach.pointToSegment(offsetPin, seg, {position: "center", distance: offsetDistance, side: "left"})
// …
Attach.rectangleToSegment(bar, rectangleHeight, seg, {distance: rectangleDistance, side: "right", paddingLeft: 50, paddingRight: 100})
```

`side` is measured along the direction from the first to the second end of the segment.

## API

- `Attach.pointToSegment`: keeps a point or pin at a position along a segment, optionally to one side
- `Attach.rectangleToSegment`: keeps a rectangle of given height along a segment
- `Attach.pointToPoint`: keeps a point at an offset from another point
- `Attach.shapeToPoint`: moves a shape with a point
- `Reactive.linkVertices`: makes a shape notify its listeners when one of its vertices moves
- `Symbols.circle`, `Symbols.diamond`: marker shapes around a point

## Notes

The segment's ends are the handles themselves. `Reactive.linkVertices(seg)` makes the segment report their changes, which is what the `Attach` bindings listen to.

## See also

- `reactions/attach-03-points`
- `reactions/reactions-01-basics`
