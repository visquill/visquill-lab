# Smoothing

Round a coarse polyline by cutting its corners, once or many times.

## How it works

`Polylines.smooth` cuts every corner: each pass replaces an edge with two points at 25% and 75% of it, so the vertex count roughly doubles. The first and last points stay. The handles go straight into it as the vertices:

```ts
Reactive.do(handles, () => {
    iterationLevels.forEach((n, i) => {
        Polylines.smooth(handles, n, curves[i])
    })
})
```

All five levels are computed on every drag step; the slider only decides which one is visible (`curve.visible.value`). The vertex count shown is read from the result, `curves[idx].elements.length`.

## API

- `Polylines.smooth`: rounds a polyline by cutting its corners a number of times

## Notes

The cost grows with the vertex count: 8 passes turn the 7 control points into 1792 vertices. For a drawing, 2 to 4 passes are usually enough.

## See also

- `geometry/polylines-01-sampling`
