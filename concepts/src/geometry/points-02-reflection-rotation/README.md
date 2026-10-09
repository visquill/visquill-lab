# Reflection & Rotation

Mirror a point through a point or across a line, or rotate it around a pivot.

## How it works

`Points.reflect` mirrors through a point: the pivot ends up halfway between source and result, the same as a half turn. `Points.reflectOverLine` mirrors across the infinite line through a segment. The demo passes the drawn mirror segment itself:

```ts
Reactive.do([source, lineA, lineB], () => {
    Segments.segment(lineA, lineB, mirror)
    const r = Points.reflectOverLine(source, mirror)
    // …
})
```

`Points.rotateAround` turns a point around a pivot by an angle in radians:

```ts
const r = Points.rotateAround(source, pivot, angle.value)
```

## API

- `Points.reflect`: mirrors a point through another point
- `Points.reflectOverLine`: mirrors a point across a line
- `Points.rotateAround`: rotates a point around a pivot
- `Segments.segment`: writes the mirror segment from its two handles
- `Values.lerp`: maps the slider position to an angle

## Notes

Positive angles in `Points.rotateAround` turn clockwise on screen, because y grows downward.

## See also

- `geometry/shapes-02-mirror`
