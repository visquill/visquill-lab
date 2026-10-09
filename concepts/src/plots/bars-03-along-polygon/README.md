# Bars Along Polygon

Bars on every edge of a closed shape, including the edge from the last vertex back to the first.

## How it works

The code is the one from the polyline version. The only change is the index of the second end point, which wraps around, so the last bar sits on the closing edge.

```ts
Reactive.do([...handles], () => {
    for (let i = 0; i < vertexCount; i++)
        Bars.fromSegment(handles[i], handles[(i + 1) % vertexCount], values[i], true, barVisuals[i] as Rectangle)
}, true)
```

The start positions of the six vertices come from `Points.placeOnCircle`, beginning at 12 o'clock. The vertices go round clockwise on screen, so bars with `left` set to `true` point outward.

```ts
const polygonPoints: Point[] = Array.from(
    { length: vertexCount },
    (_, i) => Points.placeOnCircle([cx, cy], radius, (i / vertexCount) * Math.PI * 2 - Math.PI / 2)
)
```

## API

- `Bars.fromSegment`: a bar whose base is a segment, with the given height
- `Points.placeOnCircle`: a point on a circle at an angle (0 = 3 o'clock, clockwise on screen)

## See also

- `plots/bars-02-along-polyline`
