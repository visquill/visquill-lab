# Masked Background

A mask cuts a hole into a dark cover layer, so the data shows only inside the lens.

## How it works

The cover is a layer with one dark box over the whole frame. Its mask has two parts: a white box (show the cover) and a black circle on top of it (hide the cover). Where the circle is, the points below show through.

```ts
const box = cover.visuals.box("@style fill:#000000AA")
// …
const frameMask = cover.mask.box("white")
// …
const circleMask = cover.mask.circle("black")
Reactive.do([handle,lensRadius],()=>{
    Circles.circleAt(handle,lensRadius,circleMask)
})
```

The mask circle follows the drag handle and the radius option. The ring on top is a separate layer, attached once to the same handle and radius.

```ts
const ring = lens.visuals.circle("ring")
Attach.circleRadiusToValue(ring, lensRadius)

Attach.pointToPoint(lens.anchor, handle)
```

## API

- `canvas.mask.box`, `canvas.mask.circle`: mask shapes of a layer; white shows, black hides
- `Circles.circleAt`: moves the mask circle to the handle
- `Attach.circleRadiusToValue`: ties the ring's radius to the option
- `Attach.pointToPoint`: moves the lens layer with the handle

## Notes

The drag handle is transparent and has a radius of 50 px, so the lens can be dragged only near its centre.

## See also

- `lenses/02-single-data-type`
- `basics/04-layers`
