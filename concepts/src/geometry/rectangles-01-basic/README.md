# Rectangle Construction

Three ways to construct a rectangle, side by side.

## What you see

Three panels separated by dividers. **centeredRectangle** — a pin handle sets position and orientation; width and height sliders control the dimensions; the rectangle is always centred on the pin. **anchoredRectangle** — the same pin and size sliders, plus xRatio and yRatio sliders that shift the anchor point from one edge to the other; a dot marks where the pin sits on the rectangle. **alongSegment** — two endpoint handles define the baseline; a height slider sets the depth; a side toggle handle dragged above or below the baseline midpoint flips which side the rectangle grows toward.

## Key concepts

- **`Rectangles.centeredRectangle(pin, width, height)`** — simplest construction; pin orientation rotates the entire rectangle
- **`Rectangles.anchoredRectangle(pin, xRatio, yRatio, width, height)`** — xRatio=0 pins the left edge, xRatio=1 the right; yRatio=0 the top, yRatio=1 the bottom; 0.5/0.5 is equivalent to `centeredRectangle`
- **`Rectangles.alongSegment(p1, p2, height, left)`** — derives orientation from the segment direction; `left` controls which side of the baseline the rectangle occupies