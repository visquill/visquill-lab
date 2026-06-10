# Rectangle Accessors

Reading corners, sides, and measurements from a rectangle reactively.

## What you see

A rotated rectangle with a pin handle and width/height sliders on the left. On the right, a measurements panel shows width, height, area, and diagonal updating live. On the rectangle itself, coloured dots mark the four corners with labels, and coloured segments highlight each side with its name. Everything updates as you drag the pin or move the sliders.

## Key concepts

- **`Rectangles.topLeft/topRight/bottomLeft/bottomRight(rect)`** — return the four corner points in the rectangle's local orientation, not axis-aligned
- **`Rectangles.topSide/bottomSide/leftSide/rightSide(rect)`** — return each edge as a segment; useful for placing labels or attaching geometry to a specific side
- **`Rectangles.width/height/area/diagonal(rect)`** — scalar measurements derived from the rectangle; update reactively when the rectangle changes