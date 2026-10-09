# Scale By

Stretch or shrink a shape around an anchor, separately along x and y.

## How it works

`Shapes.scaleBy` multiplies each vertex's distance from the anchor: along x by `scaleX`, along y by `scaleY`. The anchor itself stays where it is.

Each handle is kept on its track. Its distance from the anchor, relative to where it started, is the factor:

```ts
Points.closestPointOnSegment(hX, trackX, hX)
// …
const scaleX = Points.distanceToPoint(anchor, hX).value / refX
const scaleY = Points.distanceToPoint(anchor, hY).value / refY

Shapes.scaleBy(arrowVertices, anchor, scaleX, scaleY, scaled)
```

The tracks run from 0.15 to 4 times the start distance. The dashed outline is the unscaled shape.

## API

- `Shapes.scaleBy`: scales a shape around an anchor, with one factor per axis
- `Points.closestPointOnSegment`: keeps a handle on its track
- `Points.distanceToPoint`: the handle's distance from the anchor

## See also

- `geometry/shapes-04-transform`
- `geometry/circles-02-sizing`
