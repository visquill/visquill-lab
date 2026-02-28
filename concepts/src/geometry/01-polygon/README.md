# Interactive Polygon

Shapes in VisQuill are point arrays — this demo shows what that means in practice.

## What you see

A pentagon with five draggable vertices. Drag any vertex and the polygon reshapes instantly. Labels follow each vertex automatically.

## Key concepts

- **Shapes as point references** — `canvas.visuals.polygon("shape", handles)` takes the handles array directly; the polygon references those points rather than copying them, so any change to a handle position is immediately reflected in the shape
- **No `Reactive.do()` needed** — the reactive connection is established at creation time when you pass handles to the polygon constructor
- **`polygon.at(i)`** — returns a reference to the i-th vertex point, which can then be used as an attach target for labels or other elements
- **`polygon.toBack()`** — sends the polygon behind the handles so dragging is never blocked by the fill area