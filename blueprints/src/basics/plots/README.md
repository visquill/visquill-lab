# Plots

Hedgehog bar charts along any polyline baseline — horizontal, curved, or arc-following.

## What it gives you

`hedgeHogBars()` creates a set of rectangles growing perpendicularly from a polyline, one bar per segment. Each bar's height is a reactive `Real` you can animate directly. `labeledHedgeHogBars()` adds optional caption labels along the baseline and value labels at the bar tips.

## Basic usage

```typescript
import { Plots } from "@visquill/visquill-blueprints"

const baseline = group.visuals.polyline("baseline", [
    [100, 150], [200, 150], [300, 150], [400, 150], [500, 150]
])

const bars = Plots.hedgeHogBars(group, {
    baseline,
    bars: 4,
    barWidth: 30,
    barDistance: 5,
    defaultStyle: "my-bar"
})

// Animate a bar to a new height
Animate.eased(bars[0].height, 120, 1000, { easing: Animate.easeOutCubic })
```

## Options

**`Plots.hedgeHogBars(group, options)`**

| Option | Type | Description |
|---|---|---|
| `baseline` | `Polyline` | The polyline bars grow perpendicularly from |
| `bars` | `number \| { style? }[]` | Number of bars, or array of per-bar configs |
| `barWidth` | `number \| Real` | Width of each bar along the baseline |
| `barDistance` | `number \| Real` | Gap between the baseline and the bar's base |
| `defaultStyle` | `string` | CSS class applied to all bars without an individual style |

**`Plots.labeledHedgeHogBars(group, options)`**

Same as above, plus:

| Option | Type | Description |
|---|---|---|
| `barCaptions` | `{ style, autoFlip? }` | Labels placed along the baseline at each bar's position |
| `valueLabels` | `{ style, distance, autoFlip? }` | Labels placed at each bar's tip showing its value |

**`Bar` return type**

Each item in the returned array has `height: Real` (animate or set directly), `shape: Rectangle`, and optional `caption` and `valueLabel` text elements.