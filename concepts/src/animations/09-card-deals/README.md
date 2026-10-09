# Card Deal

Animate a layer's anchor pin to move and turn everything in the layer.

## How it works

Each card is a layer with the card drawn around the layer's origin. The layer's anchor is a pin: a position and an orientation. `Animate.pin.eased` animates both, so one call moves and turns the card:

```ts
Animate.pin.eased(cards[i], fanPin(i), 520, {
    easing: EasingFunctions.easeOutCubic,
})
```

The fan positions come from `Pins.placeAndAlignOnCircle`: a pin on a large circle below the cards, turned along the circle's tangent.

```ts
function fanPin(i: number) {
    // …
    return Pins.placeAndAlignOnCircle([ARC_X, ARC_Y], ARC_R, angle)
}
```

`setTimeout` staggers the cards. Dealing starts with the last card created, which is drawn on top of the deck; collecting starts with the outer cards.

## API

- `Animate.pin.eased`: animates a pin's position and orientation together
- `Pins.placeAndAlignOnCircle`: a pin on a circle at an angle, turned along the tangent
- `Pins.withOrientation`: a pin at a point, facing a direction
- `Pins.copy`: copies a pin into another one

## Notes

- Angles start at 3 o'clock, so `-Math.PI / 2` is the top of the circle.

## See also

- `animations/02-state-machine`
