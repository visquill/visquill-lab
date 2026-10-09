# Plots

Bars that grow sideways from the segments of a polyline, with optional captions and value labels.

## Usage

```ts
import { Plots } from "@visquill/visquill-blueprints"
import { Animate, EasingFunctions } from "@visquill/visquill-gdk"

const bars = Plots.hedgeHogBars(group, {
    baseline,          // a polyline; one bar per segment
    bars: 4,
    barWidth: 30,
    barDistance: 5,
    defaultStyle: "bar-blue",
})

Animate.real.eased(bars[0].height, 120, 1000, { easing: EasingFunctions.easeOutCubic })
```

Each bar's `height` is a `Real`: set it or animate it, and the rectangle follows. The bars stay attached when the baseline changes.

## Options

`Plots.hedgeHogBars(group, options)`:

| Option | Meaning |
|---|---|
| `bars` | count, or `{ style }` per bar; at most one per segment |
| `barWidth` | width along the segment, number or `Real` |
| `barDistance` | gap between segment and bar (default 0) |
| `defaultStyle` | class for bars without their own style |

`Plots.labeledHedgeHogBars` also takes `caption` per bar and:

| Option | Meaning |
|---|---|
| `barCaptions` | `{ style, autoFlip }`: labels on the baseline |
| `valueLabels` | `{ style, distance, autoFlip }`: labels at the bar tips |

Each returned bar has `height`, `shape`, and, if requested, `caption` and `valueLabel`.
