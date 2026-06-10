# Polyline - Mapping

Two editable polylines: a shape and a path. The shape's segment-length proportions are projected onto the path to produce a mapped result.

## What you see

Orange handles define the shape polyline (shown in its original position for reference). Blue handles define the path (shown as a faint dashed curve). The orange result curve is the shape mapped onto the path. Drag either set of handles to see the effect: changing the shape alters the pattern, changing the path alters where and how that pattern is laid out.

## Key concepts

- **`Polylines.mapOnPolyline(shape, target, result)`** — for each vertex of `shape`, computes its normalised position along the shape's own length and its perpendicular offset from the shape's baseline. It then places the result vertex at the same normalised position along `target`, displaced perpendicularly by the same amount. The segment-length proportions of `shape` are therefore preserved: a short segment in the shape maps to a proportionally short portion of the path, a long one to a longer portion.
- **Shape vs path** — the shape defines the *pattern* (what proportions and offsets to use); the path defines the *layout* (the curve to follow). They are independent: editing one never affects the other.
- **`Polylines.copy()`** — used to write the rebuilt shape polyline into the visual so the reference drawing stays in sync with the handles.