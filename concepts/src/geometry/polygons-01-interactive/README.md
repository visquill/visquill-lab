# Interactive

A polygon can use handles as its vertices, so it follows them without any reaction.

## How it works

`canvas.visuals.polygon` takes the handles array. The polygon keeps those point objects as its vertices instead of copying their positions, so dragging a handle moves the vertex:

```ts
const polygon = canvas.visuals.polygon("shape", handles);
```

`polygon.at(i)` returns the vertex point itself. The labels are attached to it with an offset, so they follow too:

```ts
Attach.pointToPoint(label, polygon.at(i), {
    offset: { x: 15, y: -15 }
});
```

The starting pentagon is placed with `Points.placeOnCircle`, beginning at the top.

## API

- `canvas.visuals.polygon`: a visual polygon; given points, it uses them as vertices
- `Attach.pointToPoint`: keeps a point at another point, here with an offset
- `Points.placeOnCircle`: a point on a circle at an angle

## See also

- `geometry/polygons-02-properties`
- `basics/05-attach`
