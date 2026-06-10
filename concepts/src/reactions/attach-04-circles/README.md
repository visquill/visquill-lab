# Circle Attachments

Three methods for attaching geometry to a circle — an outer ring, a polygon, and an arc of points.

## What you see

Three panels, each with a dashed inner circle whose radius is controlled by a drag handle. **circleToCircle** — an indigo outer circle maintains a fixed 20px gap from the inner; resize the inner and the outer follows. **polygonToCircle** — an orange polygon has its vertices evenly distributed around the circle; the angle slider rotates the whole polygon. **polylineToCircle** — a green polyline's vertices are spread along an arc; the span slider controls the arc's angular width, the angle slider rotates it.

## Key concepts

- **`Attach.circleToCircle(outer, inner, distance)`** — keeps `outer` concentric with `inner`, its radius equal to `inner.radius + distance`
- **`Attach.polygonToCircle(polygon, circle, { angle })`** — distributes all polygon vertices evenly around the circle; the number of sides is determined by the polygon's vertex count
- **`Attach.polylineToCircle(polyline, circle, span, { angle, anchorPosition })`** — distributes polyline vertices along an arc of `span` radians; `anchorPosition` controls whether `angle` refers to the arc's start, center, or end