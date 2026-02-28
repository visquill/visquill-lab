# Shapes & Styles

Every shape primitive in one place, with examples of both CSS class styling and inline style overrides.

## What you see

Two rows of static shapes: polygon, box, rounded rectangle, circle in the top row; circle-from-3-points, points, segments, and a polyline with text along its path in the bottom row. Nothing is interactive — this is a reference layout.

## Key concepts

- **Shape primitives** — `polygon`, `box`, `circle`, `point`, `segment`, `polyline` are the building blocks; each takes a class name that gets prefixed automatically
- **CSS prefix chain** — the class name you pass (e.g. `"polygon"`) is combined with the graphic and layer prefixes to produce the full class (`demos-basics-shapes-polygon`); your stylesheet only needs the full name
- **Inline `@style` overrides** — passing `"@style fill:darkred;"` instead of a class name applies styles directly on the element without a CSS rule; useful for one-offs
- **Multiple classes** — passing `"circle circle-3p"` applies both classes to the element, letting you share a base style and override only what differs
- **Text along a path** — `canvas.text.labelAlongPolyline()` makes text follow the geometry of any polyline