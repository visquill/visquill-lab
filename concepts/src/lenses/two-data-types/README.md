# Two Data Types Lens

A single lens showing two independent hedgehog paths simultaneously — one counting by color, one counting by shape.

## What you see

Points scattered across the canvas, each with both a color (red, green, blue, orange) and a shape (diamond, triangle, square, circle). The lens has two bar charts on opposite sides of its rim: the upper half counts by color, the lower half counts by shape. Drag the lens and both charts update together.

## Key concepts

- **Two polylines, one lens** — each hedgehog path gets its own polyline attached to a different arc segment of the same ring; they share the drag handle so a single interaction updates both
- **Counting along two dimensions** — the same set of data points is queried twice inside one `Reactive.do()` block, once grouping by color and once by shape; the lens position is the only dependency
- **`transpose` flag** — a boolean that swaps which dimension the outer loop iterates over, allowing the same counting logic to serve both hedgehog paths without duplicating code
- **Composition without clutter** — placing the two paths on opposite sides of the rim keeps them visually distinct while still making clear they describe the same underlying data