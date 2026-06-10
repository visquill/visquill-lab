# Polyline Batch Sampling

Sampling N evenly spaced pins along a polyline in a single pass.

## What you see

A smooth polyline with a slider controlling N (3–20). At each value of N, orange dots and green tangent arrows appear at evenly spaced positions along the curve. Increasing N densifies the samples without changing their relative positions — the spacing stays even because the ratios are recomputed from scratch each time. Unused slots disappear rather than lingering at stale positions.

## Key concepts

- **`Polylines.pinsAt(polyline, ratios)`** — samples all N pins in one edge walk regardless of how large N is; more efficient than N individual lookups
- **`visual.visible`** — toggled per slot to hide unused pre-allocated markers without recreating them