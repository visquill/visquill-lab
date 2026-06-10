# Arc Construction

Four ways to construct an arc, side by side.

## What you see

Four panels. **arcAt** — drag the centre, or either angle handle along the perimeter; the radius and sweep labels update. **arcBetween** — same two angle handles, but a toggle button flips the winding direction, showing how the same start and end angles produce two different arcs. **arcFromCircle** — a ghost circle stays visible underneath; drag the angle handles to clip a portion of it into an arc. **arcFromSagitta** — drag the two endpoint handles left and right to set the chord length, and drag the sagitta handle up and down to control the bulge; the sagitta value updates live.

## Key concepts

- **`arcAt(center, r, startAngle, sweepAngle)`** — explicit centre, radius, start angle, and signed sweep; the most direct construction
- **`arcBetween(center, r, startAngle, endAngle, clockwise)`** — same as `arcAt` but you specify the end angle and winding direction separately; swapping `clockwise` gives the complementary arc
- **`arcFromCircle(circle, startAngle, sweepAngle)`** — clips an existing circle to an arc; makes the relationship between circle and arc explicit
- **`arcFromSagitta(start, end, sagitta)`** — defines the arc by its chord and the perpendicular distance from chord midpoint to arc midpoint; positive sagitta curves left of the start-to-end direction, negative curves right