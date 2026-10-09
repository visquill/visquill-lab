# Positioned

Place a segment parallel to another one, or at a distance from a point.

## How it works

`Segments.alongSegment` puts a segment parallel to the base from `p1` to `p2`, at a distance to its left or right. The paddings shorten it at the start and the end, as for a dimension line:

```ts
Segments.alongSegment(
    p1, p2,
    leftSide,
    distance.value,
    paddingStart.value,
    paddingEnd.value,
    result
)
```

The side comes from the toggle handle: a negative cross product means it lies to the left of `p1` → `p2`.

`Segments.segmentAtPoint` builds a segment along a direction, at a distance beside a point. The direction vector also sets the length. The ratio says which part of the segment sits next to the point: 0 its start, 1 its end:

```ts
Segments.segmentAtPoint(
    point,
    distance.value,
    Vectors.direction(point, dirPt),
    ratio.value,
    leftSide,
    result
)
```

## API

- `Segments.alongSegment`: a segment parallel to a base, with distance and paddings
- `Segments.segmentAtPoint`: a segment beside a point, along a direction
- `Segments.pointAt`: the end of the dashed distance line
- `Vectors.crossProduct`, `Vectors.direction`: the side of the toggle, the direction vector

## See also

- `geometry/segments-01-basic`
- `geometry/rectangles-01-basic`
