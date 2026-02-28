# data-lens

A higher-level layer on top of lens-kit that drives lenses from declarative scheme objects and manages coordination between multiple lenses.

## What it gives you

You describe what each lens should show in a plain object — its data, color palette, arc layout, and which dimensions to display. `data-lens` handles the arc geometry, reactive wiring, bar plots, labels, and group behavior. Multiple lenses share a single drag interaction and update together.

## Basic usage

```typescript
import { createDataLens } from "./data-lens"

createDataLens(canvas, {
    center: [400, 300],
    lenses: [
        {
            id: "income",
            palette: ["#7ebce6", "#4197cc", "#0072b2", "#005a8c", "#004466"],
            dimensions: [
                { label: "Age",    values: [0.2, 0.4, 0.6, 0.7, 0.9] },
                { label: "Gender", values: [0.3, 0.5, 0.8] }
            ]
        }
    ]
})
```

## Options

**`createDataLens(layer, options)`**

| Option | Type | Description |
|---|---|---|
| `center` | `Point` | Initial position of the shared drag handle |
| `lenses` | `LensScheme[]` | One entry per lens |

**`LensScheme`**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Used as the CSS class prefix for this lens |
| `palette` | `string[]` | Color ramp applied to bar segments, lightest to darkest |
| `dimensions` | `DimensionScheme[]` | Each dimension occupies a span of the arc |
| `gridLines` | `object` | Optional radial grid lines — `count`, `style`, `offset` |

**`DimensionScheme`**

| Field | Type | Description |
|---|---|---|
| `label` | `string` | Arc-following title for this dimension |
| `values` | `number[]` | Bar heights as fractions (0–1) |
| `style` | `string` | CSS class for the bars (defaults to palette-derived class) |