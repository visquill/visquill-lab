# Properties

Measure a polygon: area, perimeter, oriented area, winding, convexity and centroid.

## How it works

One reaction rebuilds the polygon from the handles and writes every measurement into a value from `canvas.values`:

```ts
Reactive.do(handles, () => {
    Polygons.polygon(handles, polygon)

    Polygons.area(polygon,         areaVal)
    Polygons.perimeter(polygon,    perimeterVal)
    Polygons.orientedArea(polygon, orientedAreaVal)

    Polygons.isConvex(polygon,    isConvexVal)
    Polygons.isClockwise(polygon, isClockwiseVal)

    Polygons.centroid(polygon, centroid)
    // …
}, true)
```

The winding is the direction in which the vertices run, starting at vertex 0 (marked). The oriented area is positive when they run clockwise on screen and negative otherwise; `Polygons.area` drops the sign. The perimeter includes the closing edge back to vertex 0.

## API

- `Polygons.polygon`: writes vertices into a polygon
- `Polygons.area`, `Polygons.orientedArea`: area without and with the winding's sign
- `Polygons.perimeter`: the length of all edges
- `Polygons.isClockwise`, `Polygons.isConvex`: winding and convexity checks
- `Polygons.centroid`: the center of mass of the area

## Notes

For a self-intersecting polygon the parts with opposite winding cancel: a figure-eight can have area 0.

## See also

- `geometry/polygons-05-orientation`
