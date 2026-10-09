# Radar Charts

Animate the numbers behind a chart, and the chart follows.

## How it works

`createRadarChart` (in `radar.ts`) returns the chart's inputs as `Real` values: `innerRadius`, `rayLength`, and `data`, one value per curve and ray. One reaction redraws the chart whenever any of them changes:

```ts
Reactive.do(data.flat().concat(outerRadius), () => {
    Circles.circleAt([0, 0], innerRadius, innerCircle)
    Circles.circleAt([0, 0], outerRadius, outerCircle)
    // …
    updateCurves()
})
```

The rays are spread over the circles with `Distribute.pointsOnCircle`. A value is a ratio along its ray, and stacked curves add up the values below them:

```ts
ratio = options.stackedCurves ? ratio + value : value
Points.placeOnSegment(ray.at(0), ray.at(1), ratio, curve.at(rayIndex))
```

Changing the data animates every value with `Animate.real.eased`; the controls animate the radius and the ray length. All values are divided by the largest stack in the data, so no stack goes past the outer circle.

## API

- `Animate.real.eased`: animates a `Real` to a target value
- `Reactive.do`: runs a function whenever its inputs change
- `Points.placeOnSegment`: the point at a ratio along a segment
- `Distribute.pointsOnCircle`: spreads points evenly over a circle
- `Circles.circleAt`: a circle from centre and radius

## See also

- `animations/01-easing`
