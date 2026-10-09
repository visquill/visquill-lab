# Decoration

Labels that follow shapes: one per polyline segment, or one per rectangle edge.

## Usage

```ts
import { Decoration } from "@visquill/visquill-blueprints"

Decoration.labelsAlongPolyline(group, {
    baseline,
    labels: [{ text: "Q1", style: "label-quarter" }, { text: "Q2", style: "label-quarter" }],
})

Decoration.labelsAtRectangles(group, {
    rectangles,
    labels: ["80", "120", "95"],
    placement: "top",
    position: "center",
    distance: 12,
    style: "label-value",
})
```

The labels are attached, so they move when the polyline or the rectangles change.

## Options

`Decoration.labelsAlongPolyline(group, options)`: label i sits in the middle of segment i.

| Option | Meaning |
|---|---|
| `labels` | strings or `{ text, style }`; extra labels are dropped |
| `distance` | distance to the left of the segment (default 0) |
| `style` | class for plain-string labels |
| `autoFlip` | keep labels readable on right-to-left segments (default true) |

`Decoration.labelsAtRectangles(group, options)`: label i sits at rectangle i.

| Option | Meaning |
|---|---|
| `labels` | strings, `{ text, style }`, or a count of empty labels |
| `placement` | edge: `top`, `bottom`, `left`, `right` |
| `position` | `start`, `center`, `end` or a ratio along the edge |
| `distance` | gap to the edge, one value or one `Real` per label |
| `angle`, `autoFlip` | rotation in radians; flip with the rectangle |
