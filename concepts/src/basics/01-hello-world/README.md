# Hello World

The minimal VisQuill setup — a single text element attached to the center of the canvas.

## What you see

"Hello World!" rendered in large type, centered in the graphic. There is nothing to interact with; the point is the setup, not the output.

## Key concepts

- **`VisQuill.create(div, prefix)`** — creates the root graphic and sets the CSS prefix that all class names in this graphic will be built from
- **`canvas.text.label(text, class)`** — creates a text element; the full CSS class is assembled from the graphic prefix + the class name you pass
- **`Attach.pointToPoint(text, rvg.center)`** — keeps the text origin pinned to the graphic's center point; if the container resizes, the text stays centered