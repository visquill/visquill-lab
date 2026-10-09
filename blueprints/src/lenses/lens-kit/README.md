# Lens Kit

Building blocks for radial lenses: a circle with an active arc, masked bands around it, and bar plots and titles placed along slices of the arc.

## Usage

```ts
import * as Lenses from "./lens-kit"

const lens = Lenses.createLens(canvas, { rimRadius: 120, rimStyle: "rim" })
Attach.pointToPoint(lens.location, handle)

const band = Lenses.createBoundedRing(lens, { outerRadius: 180, innerRadius: 40 })
const span = Lenses.createRingSpan(band, { start: 0.02, extent: 0.29 })

const plot = Lenses.attachBarPlot(band.layer, span, {
    barWidth: 16,
    categories: [{ style: "category-1", name: "N" }, { style: "category-2", name: "S" }],
    offset: 20,
    valueLabels: { style: "value-label", distance: 8 },
})
plot.bars[0].height.value = 82

Lenses.attachTitle(span, { text: "Region A", style: "plot-title", offset: -10 })
```

Radii, angles, `start` and `extent` are `Real` values: animate them and everything attached follows.

## Options

| Function | Main options |
|---|---|
| `createLens` | `rimRadius`, `location`, `radialSpan` (default π), `startAngle`: the middle of the arc (default −π/2, top) |
| `createBoundedRing` | `innerRadius`, `outerRadius`: band around the rim; content outside is masked |
| `createRingSpan` | `start`, `extent`: fractions of the arc |
| `attachBarPlot` | `categories`, `barWidth`, `barOffset`, `offset`, `barCaptions`, `valueLabels`, `maxExtent` |
| `attachTitle` | `text`, `style`, `offset`, `minLength`, `minRadius` |
| `attachGridLines` | `count`, `distance`, `style`, `vertexCount` |
