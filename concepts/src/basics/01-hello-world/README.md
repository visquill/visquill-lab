# Hello World

The smallest VisQuill graphic: create it in a div, draw one label, keep it at the center.

## How it works

`VisQuill.create` builds the graphic inside the div and sets the CSS prefix for its class names. The label's class `"label"` becomes `demos-basics-hello-world-label`, which `styles.css` styles. `Attach.pointToPoint` keeps the label on `rvg.center`, so it stays centered when the container is resized.

```ts
const rvg = VisQuill.create(div, "demos-basics-hello-world-")
const canvas = rvg.canvas
const text = canvas.text.label("Hello World!",  "label")
Attach.pointToPoint(text, rvg.center)
```

## API

- `VisQuill.create`: creates a graphic in a div, with the prefix for all its CSS classes
- `canvas.text.label`: creates a text label with a CSS class
- `Attach.pointToPoint`: keeps a point, here the label, on another point

## See also

- `basics/03-rvg-frame`
- `basics/05-attach`
