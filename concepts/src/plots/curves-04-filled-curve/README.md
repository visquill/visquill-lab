# Filled Curve

A filled area chart plotted against a polyline baseline.

## What you see

A smooth polyline baseline in grey. A light-orange filled polygon covers the area between the baseline and its offset curve. A darker orange line sits on top as the curve outline. Both are static — there are no interactive handles — so the focus is purely on the layering relationship between the filled area and the outline.

## Key concepts

- **`Curves.filledAlongPolyline(baseline, values, left, result)`** — produces the closed filled polygon stitched between the baseline and the offset curve; drawn first so the outline sits on top
- **`Curves.alongPolylineUniform(baseline, values, left, result)`** — produces the offset curve with values distributed uniformly along the baseline length; drawn on top of the filled area as the visible boundary