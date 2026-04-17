# Radar Charts

Stacked radar charts as draggable, reactively animated nodes.

## What you see

Three radar charts on the canvas, each showing six stacked colour bands across eight rays. The charts share a common scale so relative sizes stay comparable as you cycle through datasets. Each chart is offset into the block sequence so all three always show distinct data. Grab anywhere inside a chart to reposition it. The controls panel cycles through datasets, inner-radius sizes, and ray lengths — every transition animates simultaneously across all three charts.

## Key concepts

- **`createRadarChart` as a self-contained component** — the factory returns a `{ group, innerRadius, rayLength, data }` handle; the caller drives the reactive values from outside without knowing anything about the internal geometry
- **`Animate.eased` on scalar `Real` refs** — `innerRadius`, `rayLength`, and each data cell are plain `Real` values; a single `Animate.eased(ref, target, 1000)` call inside `Reactive.do` is all that is needed for smooth geometry transitions
- **Shared normalisation** — `maxStackedValue` is computed once over all blocks before any chart is created; every `assignData` call divides by this global maximum so curves always fill the same proportion of ray length regardless of the active dataset
- **Index-offset data rotation** — each chart receives `blocks[(dataIndex + chartIndex) % blocks.length]`; advancing `dataIndex` by one rotates all three charts in a single `Reactive.do` callback, keeping them permanently out of phase
- **Invisible drag handles** — each chart anchor is a `handles.disk` with `fill: none; stroke: none`; the hit area covers the full chart radius so the whole surface is draggable without anything visual competing with the chart