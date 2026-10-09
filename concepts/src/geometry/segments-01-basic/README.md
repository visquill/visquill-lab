# Basics

Build a segment from two points or from a start and a direction, and measure it.

## How it works

A visual segment created with two handles uses them as its ends, so it follows them. The reactions measure that segment directly:

```ts
const s   = canvas.visuals.segment("segment", p1, p2)
// …
Reactive.do([p1, p2], () => {
    const m  = Segments.midPoint(s)
    const l  = Segments.len(s)
    const hl = Segments.horizontalLength(s)
    const vl = Segments.verticalLength(s)
    // …
})
```

`Segments.directedSegment` takes a start and a vector; the vector's length becomes the segment's length. `Segments.direction` gives the unit vector back:

```ts
const v = Vectors.direction(origin, dirPt)

Segments.directedSegment(origin, v, seg)
const l   = Segments.len(seg)
const dir = Segments.direction(seg)
```

## API

- `Segments.directedSegment`: a segment from a start point and a vector
- `Segments.len`, `Segments.horizontalLength`, `Segments.verticalLength`: length, and length along x and y
- `Segments.midPoint`: the middle of a segment
- `Segments.pointAt`: the point at a ratio, 0 at the start and 1 at the end
- `Segments.direction`: the unit direction from start to end
- `Vectors.direction`: the vector from one point to another (not normalized)

## See also

- `geometry/segments-02-positioned`
