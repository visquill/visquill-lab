# Convex Hull

How to use `Reactive.do()` with an array of points as the dependency.

## What you see

Twenty draggable points scattered randomly. A filled polygon outlines the convex hull of all points. Drag any point — if it moves outside the current hull, the hull expands; if an inner point moves, only the hull changes if that affects the boundary.

## Key concepts

- **Array dependency** — passing an array of handles to `Reactive.do()` tracks all of them; the block fires when *any* point changes
- **`ConvexHulls.topStart(handles, polygon)`** — recomputes the hull from scratch on every call and writes the result directly into the existing polygon, avoiding allocation on each drag event
- **Layer separation** — handles live on a `controls` layer above the `canvas` layer so the hull polygon's fill never blocks dragging
- **`Reactive.do(..., true)`** — the third argument runs the block immediately on setup, so the hull is drawn before any interaction