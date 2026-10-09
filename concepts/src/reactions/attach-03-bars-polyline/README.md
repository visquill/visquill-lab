# Bars Along a Polyline

Attach one bar to each segment of a polyline and its height to a value.

## How it works

Each bar is a rectangle whose height is bound to a `Real` with `Attach.rectangleHeightToValue`. `Attach.rectanglesAlongPolyline` then places one bar per segment, standing on the polyline. Changing a value changes that bar; dragging a handle moves all bars on the changed segments.

```ts
const bars = barHeights.map(h => {
    const bar = canvas.visuals.rectangle("bar")
    const val = canvas.values.real(h)
    Attach.rectangleHeightToValue(bar, val, { side: "left" })
    return bar
})

Attach.rectanglesAlongPolyline(bars, polyline, {
    barWidth,
    positionOnSegment: "center",
    anchorPositionX:   "center",
    anchorPositionY:   "bottom",
    distance:          0,
})
```

The second set uses `Attach.rectanglesAlignedAlongPolyline`, which takes one `align` option instead of the anchor positions. Its bars grow to the other `side`, below the line.

## API

- `Attach.rectangleHeightToValue`: binds a rectangle's height to a value, growing to one side
- `Attach.rectanglesAlongPolyline`: one rectangle per polyline segment, with explicit anchors
- `Attach.rectanglesAlignedAlongPolyline`: the same with `align: "left" | "center" | "right"`
- `Reactive.linkVertices`: makes the polyline notify its listeners when a handle moves

## See also

- `plots/bars-02-along-polyline`
