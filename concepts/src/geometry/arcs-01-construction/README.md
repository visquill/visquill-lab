# Construction

Four ways to build an arc: from a sweep, between two angles, from a circle, or from a chord.

## How it works

The first three panels take angles in radians, which the demo reads from the handles. Angles and a positive sweep both turn clockwise on screen.

```ts
const startDir = Vectors.direction(center, startH)
const sa = Vectors.angle(startDir, true)
const sw = Vectors.angleTo(startDir, Vectors.direction(center, endH), true)

Arcs.arcAt(center, r, sa, sw, arc)
```

`Arcs.arcBetween` takes the end angle and a winding flag instead of a sweep. The button flips the flag: the same angles give the other part of the circle. `Arcs.arcFromCircle` cuts an arc from a circle.

`Arcs.arcFromSagitta` needs no center, only a chord and the signed distance from its midpoint to the arc:

```ts
Arcs.arcFromSagitta(p1, p2, sag, arc)
```

## API

- `Arcs.arcAt`: an arc from center, radius, start angle and sweep
- `Arcs.arcBetween`: an arc from center, radius, start and end angle, and a winding direction
- `Arcs.arcFromCircle`: an arc on a circle from start angle and sweep
- `Arcs.arcFromSagitta`: an arc from two endpoints and a sagitta
- `Vectors.angle`: the angle of a direction
- `Vectors.angleTo`: the angle from one direction to another

## Notes

A positive sagitta bends the arc to the left of the start-to-end direction. With the chord drawn left to right, that is downward on screen.

## See also

- `geometry/arcs-02-sampling`
