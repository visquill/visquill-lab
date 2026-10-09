# Data Lens

Lenses built from a plain scheme object, plus groups that make several lenses share the circle and stick together.

## Usage

```ts
import { createInteractiveLens, createProximityGroup, createSnapGroup } from "./data-lens"

const lenses = schemes.map(scheme => createInteractiveLens(layer, scheme, "handle"))

createProximityGroup(layer, lenses, { threshold: 100, arcGap: 0.1, arcLayout: equal })
createSnapGroup(layer, lenses, { snapDistance: 50, unsnapDistance: 75 })

lenses[0].plots[0].bars[0].height.value = 62
lenses[0].aspect.value = "gender"   // show the plot with aspect "gender"
```

`equal` is an `ArcLayoutFunction` defined in the demo: it splits the circle among the lenses of a group.

## Options

`DataLensScheme`, one per lens:

| Field | Meaning |
|---|---|
| `rimRadius`, `innerRadius`, `outerRadius` | lens radius and the band around it |
| `radialSpan`, `startAngle` | arc width and its middle (default top) |
| `plots` | one `BarPlotScheme` per `aspect`; each covers the whole arc |
| `initialAspect` | the plot shown first |
| `title`, `onCollapse` | arc title; radii when `size` goes to 0 |

`createProximityGroup`: lenses closer than `threshold` form a group; `arcLayout` assigns each its arc.

`createSnapGroup`: handles closer than `snapDistance` move together until they are `unsnapDistance` apart.

`createDropBox(box, lens)` collapses a lens while its centre is in the box.
