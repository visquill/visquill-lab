# Curve Along Polyline

Plotting a data series offset from a polyline baseline using path-length positions.

## What you see

A smooth polyline baseline in grey. Grey dots mark the sampling positions on the baseline; an orange curve connects the correspondingly offset points above or below it. A shift slider at the bottom moves all sampling positions along the baseline simultaneously, sliding the entire dataset like scrolling a time series. The shift label in the top-left shows the current offset in pixels.

## Key concepts

- **`Curves.alongPolyline(baseline, positions, values, shift, left, result)`** — places each data point by walking the baseline to the given distance position, then stepping perpendicularly by the value amount; `shift` offsets every position by the same distance
- **`Polylines.pinsAtDistances`** — used separately here to place the grey baseline markers at the same shifted positions, making the correspondence between baseline position and curve point visible