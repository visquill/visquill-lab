# Contains Point

Test whether a point is inside a polygon, and find its nearest point on the boundary.

## How it works

One reaction depends on the vertices and the probe. It rebuilds the polygon, then runs three queries:

```ts
Reactive.do([...handles, probe], () => {
    Polygons.polygon(handles, polygon)

    Polygons.closestPoint(polygon, probe, closestPt)
    Polygons.distanceTo(polygon, probe, distanceVal)
    Polygons.containsPoint(polygon, probe, isInsideVal)
    // …
    probeSvg.style.fill = inside ? colourInside : colourOutside
}, true)
```

The connector was created once with the probe and `closestPt` as its ends, so it follows both.

The probe's color is set on its SVG element, which `Svg.get` returns.

## API

- `Polygons.containsPoint`: whether a point lies inside a polygon
- `Polygons.closestPoint`: the point on the boundary nearest to a point
- `Polygons.distanceTo`: distance from a point to the boundary
- `Polygons.polygon`: writes vertices into a polygon
- `Svg.get`: the SVG element of a visual

## Notes

`Polygons.distanceTo` measures to the boundary and is never negative, also inside. For a signed distance, combine it with `Polygons.containsPoint`.

## See also

- `reactions/reactions-02-distances`
