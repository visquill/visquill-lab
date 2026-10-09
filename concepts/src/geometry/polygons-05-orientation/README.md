# Vertex Orientations

Get the direction and the normal of a polygon at each of its vertices.

## How it works

A corner has two edges, so it has no single direction. `Polygons.vertexOrientation` returns the average of the two edge directions, a unit vector along the boundary. `Polygons.vertexNormal` is that direction turned by 90° to the left or right of the travel direction:

```ts
handles.forEach((vertex, i) => {
    const ori = Polygons.vertexOrientation(polygon, i)
    Points.copy(vertex, oriArrows[i].at(0))
    Vectors.add(vertex, Vectors.scale(ori, arrowLength), oriArrows[i].at(1))

    const nrm = Polygons.vertexNormal(polygon, i, true)
    // …
})
```

The vertices run clockwise on screen, so the left normal points outward. Drag the polygon inside out and the normals point inward.

## API

- `Polygons.vertexOrientation`: the direction along the boundary at a vertex
- `Polygons.vertexNormal`: that direction turned 90° to the left or right
- `Vectors.scale`, `Vectors.add`: the arrow tips
- `Polygons.polygon`: writes vertices into a polygon

## Notes

Where the boundary almost doubles back, the two edge directions nearly cancel; there `Polygons.vertexOrientation` uses the outgoing edge's direction.

## See also

- `geometry/polygons-02-properties`
- `geometry/polylines-04-smoothing`
