# Reactive Chains

A slider drives a radius, which derives an area, which derives a colour — three independent blocks chained together.

## What you see

A circle that grows and shifts from blue to orange as you drag the slider. Three readout labels show the current radius, area, and colour value updating in real time.

## Key concepts

- **Dependency chains** — block A writes `radius`, block B reads `radius` and writes `area`, block C reads `area` and updates the colour; changing the slider cascades automatically through all three
- **Single responsibility** — each `Reactive.do` block has one job and knows only its immediate input; block C has no idea the slider exists
- **Intermediate reactive values** — `canvas.values.real()` is used not only as UI state but as the connective tissue between blocks; writing to `area.value` inside block B is what triggers block C
- **Separation of concerns** — geometry (block B) and presentation (block C) are kept in separate blocks; this makes each easier to understand and replace independently