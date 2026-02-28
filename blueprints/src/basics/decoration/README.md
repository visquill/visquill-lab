# Decoration

Utilities for placing labels along polylines and at the edges of rectangles.

## What it gives you

`labelsAlongPolyline()` places one label per polyline segment, centered along each segment and optionally rotated to follow its angle. `labelsAtRectangles()` places one label per rectangle, positioned at a specified edge with configurable alignment and distance.

## Basic usage

```typescript
import { Decoration } from "@visquill/visquill-blueprints"

// Label per polyline segment
Decoration.labelsAlongPolyline(group, {
    baseline: myPolyline,
    labels: [
        { text: "Q1", style: "label-quarter" },
        { text: "Q2", style: "label-quarter" }
    ]
})

// Label at the top edge of each bar
Decoration.labelsAtRectangles(group, {
    rectangles: myBars,
    labels: ["80", "120", "95"],
    placement: "top",
    position: "center",
    distance: 5,
    style: "label-value"
})
```

## Options

**`Decoration.labelsAlongPolyline(group, options)`**

| Option | Type | Description |
|---|---|---|
| `baseline` | `Polyline` | The polyline whose segments the labels follow |
| `labels` | `string[] \| LabelDescription[]` | One entry per segment; strings use the default style |
| `style` | `string` | Default CSS class applied when no per-label style is given |
| `autoFlip` | `boolean` | Flips labels on segments that run right-to-left (default: false) |

**`Decoration.labelsAtRectangles(group, options)`**

| Option | Type | Description |
|---|---|---|
| `rectangles` | `Rectangle[]` | One label is placed per rectangle |
| `labels` | `string[] \| LabelDescription[]` | Label texts or descriptions |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | Which edge to anchor to |
| `position` | `"start" \| "center" \| "end"` | Alignment along that edge |
| `distance` | `number \| Real` | Gap between the edge and the label |
| `style` | `string` | CSS class for all labels |