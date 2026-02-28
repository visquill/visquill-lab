# lens-kit

Primitives for building radial visualizations: draggable circles with reactive arcs, arc slices to position content on, and attachment functions that place bar plots and text along those arcs.

## What it gives you

A `createLens()` that returns a draggable circle with a reactive radius and an active arc defining where content may go. `createBoundedRing()` places a masked annular band on the lens. `createRingSpan()` carves a slice of that band into a named zone. `attachBarPlot()` and `attachTitle()` place content along the arc of a span. Everything is reactive — changing radius, position, or arc angle propagates automatically.

## Basic usage

```typescript
import * as Lenses from "./lens-kit"

const lens = Lenses.createLens(canvas, {
    center: [400, 300],
    radius: 120,
    startAngle: -Math.PI / 2,
    radialSpan: Math.PI * 2
})

const ring = Lenses.createBoundedRing(lens, {
    outerOffset: 180,
    innerOffset: 10
})

const span = Lenses.createRingSpan(ring, {
    position: 0,
    span: 0.5
})

Lenses.attachBarPlot(span, {
    values: [0.2, 0.5, 0.8],
    style: "my-bar"
})
```

## Options

**`createLens(layer, options)`**

| Option | Type | Description |
|---|---|---|
| `center` | `Point` | Initial position of the draggable handle |
| `radius` | `number` | Expanded radius in canvas units |
| `startAngle` | `number` | Start of the active arc in radians |
| `radialSpan` | `number` | Angular extent of the active arc (`2π` = full circle) |

**`createBoundedRing(lens, options)`**

| Option | Type | Description |
|---|---|---|
| `outerOffset` | `number` | Width of the band outward from the lens rim |
| `innerOffset` | `number` | Gap between the rim and the inner edge of the band |

**`createRingSpan(ring, options)`**

| Option | Type | Description |
|---|---|---|
| `position` | `number` | Start of the span as a fraction of the ring's arc (0–1) |
| `span` | `number` | Width of the span as a fraction of the ring's arc |

**`attachBarPlot(span, options)`** — places a hedgehog bar plot along the span's arc. **`attachTitle(span, options)`** — places arc-following text at the center of the span.

All numeric values returned (`radius`, `startAngle`, `radialSpan`, `position`, `span`) are reactive `Real`s — pass them to `Animate.eased()` to animate, or write `.value` directly to update instantly.