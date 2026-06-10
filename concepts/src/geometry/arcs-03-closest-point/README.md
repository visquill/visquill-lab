# Arc Closest Point

Finding the nearest point on an arc to an arbitrary query point.

## What you see

An arc with three handles to reshape it, and a freely draggable sky-blue query point. A dashed connector joins the query point to the closest point on the arc, marked in green. A distance label updates live as either the arc or the query point moves. Dragging the query point past an endpoint shows that the result clamps to the endpoint rather than continuing around the underlying circle.

## Key concepts

- **`Arcs.closestPoint(arc, p)`** — returns the point on the arc nearest to `p`; clamps to the nearest endpoint if the perpendicular projection falls outside the arc's angular range
- **`Arcs.distanceTo(arc, p)`** — returns the scalar distance from `p` to the closest point on the arc