# Placement & Orientation

Place a pin on or beside a segment, with or without turning it along the segment.

## How it works

The placement functions come in pairs. The plain one only sets the position and keeps the pin's orientation. The `AndAlign` one also turns the pin along the segment from `p1` to `p2`:

```ts
// position on segment, orientation unchanged
Pins.placeOnSegment(hA, hB, ratio, p)
// position on segment, oriented along it
Pins.placeAndAlignOnSegment(hA, hB, ratio, p)
```

The `Beside` variants add a distance to the left or right of the segment:

```ts
Pins.placeAndAlignBesideSegment(hA, hB, ratio, besideDistance, true, p)
```

`Pins.lookAt` does the opposite of placing: it keeps the position and turns the pin toward a target.

```ts
Reactive.do([hTarget], () => {
    Pins.lookAt(lookPin, hTarget, lookPin)
    // …
})
```

## API

- `Pins.placeOnSegment`: sets the position at a ratio along a segment
- `Pins.placeAndAlignOnSegment`: the same, and orients the pin along the segment
- `Pins.placeBesideSegment`: sets the position at a distance beside a segment
- `Pins.placeAndAlignBesideSegment`: the same, and orients the pin along the segment
- `Pins.lookAt`: turns a pin toward a point
- `Pins.withOrientation`: gives the placed pins their initial orientation

## See also

- `geometry/pins-02-movement`
- `geometry/points-01-placement`
