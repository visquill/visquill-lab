# Mapping

Place the vertices of one polyline along another, keeping their spacing.

## How it works

`Polylines.mapOnPolyline` looks at how far along its own length each vertex of the shape sits, as a fraction. It then puts a vertex at the same fraction of the path's length. A short edge in the shape becomes a short stretch of the path; a long edge a long one.

```ts
Reactive.do([...shapeHandles, ...pathHandles], () => {
    Polylines.polyline(shapeHandles, shapePolyline)
    Polylines.smooth(pathHandles, smoothingIterations, pathSmooth)

    Polylines.mapOnPolyline(shapePolyline, pathSmooth, mapped)
})
```

The result has as many vertices as the shape, and they all lie on the path. Only the spacing of the shape matters: moving an orange handle up or down changes the result only as far as it changes the edge lengths.

## API

- `Polylines.mapOnPolyline`: places a polyline's vertices along another polyline by length fraction
- `Polylines.polyline`: writes vertices into a polyline
- `Polylines.smooth`: rounds the path

## See also

- `geometry/polylines-07-distance-smapling`
- `plots/curves-01-along-polyline`
