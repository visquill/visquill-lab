# Shapes — Bounding Box

Drag five symbol shapes around the canvas and watch individual and collective bounding boxes update live.

## What you see

Five shapes — a diamond, rectangle, square, and two triangles — each in a distinct colour and each draggable by clicking anywhere on the shape.  A faint dashed box outlines each shape individually.  A heavier dashed black box encloses all five shapes together.  Moving any shape shrinks or grows both its individual box and the collective box instantly.

## Key concepts

- **`Shapes.boundingBox()`** — computes the smallest axis-aligned box that fully contains a single shape; called once per shape on every update
- **`Shapes.boundingBoxOfShapes()`** — computes the smallest axis-aligned box that fully contains every shape in a collection; the result grows and shrinks as shapes are dragged toward or away from the current extremes
- **`Symbols`** — each shape is built from `Symbols.diamond()`, `Symbols.rectangle()`, `Symbols.square()`, and `Symbols.triangle()` using the handle position as the centre; the handle is a large transparent disk so the whole shape feels draggable rather than a single point