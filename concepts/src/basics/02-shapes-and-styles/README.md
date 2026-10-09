# Shapes & Styles

The basic shapes on `canvas.visuals`, styled by CSS class or inline.

## How it works

Each factory takes a style string first, then the geometry. A plain name is a CSS class: the graphic's prefix is put in front, so `"polygon"` becomes `demos-basics-shapes-polygon`. Several names give several classes, and `@style` sets styles on the element without a CSS rule.

```ts
canvas.visuals.box("box",[200, 60], [310, 160])
// …
canvas.visuals.circle(
    "circle circle-3p",
    [100, 320],
    [200, 420],
    [100, 420]
)
// …
canvas.visuals.point("@class point @style fill:red;",[350, 350] )
```

A box is axis aligned. A rectangle stands on a baseline with a height, so it can be rotated:

```ts
Rectangles.alongSegment([340, 60], [450, 160], 20, true, canvas.visuals.rectangle(
    "@style fill:darkred; stroke-width: 1px; stroke: black;"));
```

## API

- `canvas.visuals.polygon`, `.box`, `.circle`, `.circleAt`, `.point`, `.segment`, `.polyline`, `.rectangle`: shape factories
- `Rectangles.alongSegment`: sets a rectangle from a baseline, a height and a side
- `canvas.text.labelAt`: a text label at a position
- `canvas.text.labelAlongPolyline`: text that follows a polyline, at a distance from it

## See also

- `basics/04-layers`
