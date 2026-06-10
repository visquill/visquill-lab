# Boxes - Inspection

Drag two corner handles to reshape a box and watch all its properties and named points update live.

## What you see

A resizable box defined by two draggable handles. Four coloured sides are labelled with the method that returns each one. Five corner/center dots show the named points. A monospaced info panel on the left reports ten scalar properties in real time.

## Key concepts

- **`Boxes.spannedBox(p1, p2)`** — constructs the smallest box containing both points; either handle can cross the other without breaking the box
- **`Boxes.topSide()` / `bottomSide()` / `leftSide()` / `rightSide()`** — return each edge as a `Segment`
- **`Boxes.topLeft()` / `topRight()` / `bottomLeft()` / `bottomRight()` / `center()`** — the five named points of a box
- **`Boxes.width()` / `height()` / `area()` / `circumference()`** — basic dimensional properties
- **`Boxes.diameter()`** — length of the diagonal
- **`Boxes.aspectRatio()`** — width ÷ height
- **`Boxes.longestSide()` / `shortestSide()`** — the greater and lesser of width and height
- **`Boxes.isSquare()`** — true when width equals height exactly
- **`Boxes.isEmpty()`** — true when width or height is zero or negative (handles coincide or cross)