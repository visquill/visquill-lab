# Conditional Reactive

A reaction is a plain function, so it can branch.

## How it works

One reaction listens to both segment ends and the probe. It measures first, then decides: the GDK writes the closest point and the distance, and a single comparison picks the state. Both states use the same visuals; the branch only writes different colours, opacity and text into them.

```ts
Reactive.do([handleA, handleB, probe], () => {
    Points.closestPointOnSegment(probe, segment, closest)
    Points.distanceToSegment(probe, segment, distance)
    Circles.circleAt(probe, threshold, thresholdRing)
    // …
    const isNear = distance.value < threshold

    probeSvg.style.fill        = isNear ? "#e04040" : "#f7a020"
    connectorSvg.style.opacity = isNear ? "1"       : "0.25"
    // …
}, true)
```

The connector is created with `probe` and `closest` as its ends, so it follows both without code in the reaction.

## API

- `Reactive.do`: runs a function now and whenever its senders change
- `Points.closestPointOnSegment`: the point on a segment closest to a given point
- `Points.distanceToSegment`: shortest distance from a point to a segment
- `Points.midPoint`: the point halfway between two points
- `Circles.circleAt`: a circle from center and radius
- `Svg.get`: the SVG element of a visual, for styling

## See also

- `reactions/reactions-02-distances`
