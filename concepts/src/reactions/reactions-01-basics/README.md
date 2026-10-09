# Basics

`Reactive.do` runs a function now and again whenever one of its senders changes.

## How it works

Handles are reactive points, so they can be senders. The first two reactions keep each handle on the track: `Points.closestPointOnSegment` writes the snapped position back into the handle. Two more reactions with one sender each update the handle's reading.

The midpoint reaction lists both handles as senders, so it runs when either one moves. It writes the result into the point `mid`, and the label attached to `mid` follows.

```ts
Reactive.do([handleA], () => {
    readingA.value = "x = " + Math.round(handleA.x)
})
// …
Reactive.do([handleA, handleB], () => {
    Points.midPoint(handleA, handleB, mid)
    midLabel.value = "mid = " + Math.round(mid.x)
})
```

## API

- `Reactive.do`: runs a function now and whenever its senders change
- `Points.closestPointOnSegment`: the point on a segment closest to a given point
- `Points.midPoint`: the point halfway between two points
- `Attach.pointToPoint`: makes a label follow a point, with an offset

## See also

- `reactions/reactions-04-chain`
- `reactions/attach-01-basics`
