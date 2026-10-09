# Bars Along Polyline

One bar per segment of an open path, with the segment as the bar's base.

## How it works

`Bars.fromSegment` takes the two end points of a segment and a height. The segment is the base of the bar, so its width and direction come from the two points. The vertices are handles, so each bar follows them.

```ts
Reactive.do([...handles], () => {
    for (let i = 0; i < values.length; i++)
        Bars.fromSegment(handles[i], handles[i + 1], values[i], true, barVisuals[i] as Rectangle)
}, true)
```

Seven vertices give six segments and six bars. With `left` set to `true`, each bar grows to the left of the direction from `handles[i]` to `handles[i + 1]`.

## API

- `Bars.fromSegment`: a bar whose base is a segment, with the given height

## See also

- `plots/bars-03-along-polygon`
- `plots/bars-01-anchoring`
