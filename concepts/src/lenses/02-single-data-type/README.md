# One Data Type

A lens that counts the points inside it per category and shows the counts as bars around its rim.

## How it works

The lens is a layer attached to a drag handle. A polyline with 5 points is laid along the ring with `Attach.polylineToCircle`; span and rotation come from the options panel. `Plots.labeledHedgeHogBars` from the blueprints puts one bar on each of its 4 segments.

```ts
const baseline = lens.visuals.polyline("hedgehog-path", 5)
Attach.polylineToCircle(baseline, ring, span, {distance: 10, angle: rotation})
```

Whenever the lens moves or its radius changes, the points of each category inside the circle are counted. `Animate.real.follow` moves each bar height towards the new count.

```ts
Reactive.do([lens.anchor, radius], () => {
    for (let i = 0; i < dataTypes.length; i++) {
        const count = countPoints(points[i])
        Animate.real.follow(heights[i], count / numberOfDataPoints * 400)
        valueLabels[i].value = count.toString()
    }
})
```

A point counts when `Points.distanceToPoint` to the lens centre is less than the radius.

## API

- `Attach.polylineToCircle`: lays a polyline along a circle, with a span, a distance and a start angle
- `Attach.circleRadiusToValue`: ties the ring's radius to the option
- `Attach.pointToPoint`: moves the lens layer with the handle
- `Animate.real.follow`: eases a value towards a target
- `Points.distanceToPoint`: the membership test

## See also

- `lenses/03-two-data-types`
