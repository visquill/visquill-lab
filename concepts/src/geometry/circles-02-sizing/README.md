# Inflate & Scale

Change a circle's size by adding to its radius or by multiplying it.

## How it works

Both results are computed from the same fixed base circle. `Circles.inflate` adds a fixed amount to the radius, so the gap to the base circle is the same at every size:

```ts
Reactive.do([delta], () => {
    Circles.inflate(baseCircle, delta.value, inflatedCircle)
    const ir = Circles.radius(inflatedCircle)
    // …
})
```

`Circles.scale` multiplies the radius. The same factor makes a big circle grow by more pixels than a small one:

```ts
Reactive.do([factor], () => {
    Circles.scale(baseCircle, factor.value, scaledCircle)
    // …
})
```

`Circles.radius` reads the new radius back to place the labels.

## API

- `Circles.inflate`: adds an amount to the radius; negative values shrink
- `Circles.scale`: multiplies the radius by a factor
- `Circles.radius`: the radius of a circle
- `Circles.circleAt`: the base circle from center and radius
- `Values.lerp`: maps the slider position to a value

## See also

- `geometry/circles-01-construction`
- `geometry/boxes-02-growing`
