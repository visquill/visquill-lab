# Shapes — Scale By

Scale a shape independently on X and Y by dragging two axis-constrained handles.

## What you see

An asymmetric arrow shape anchored at its centroid.  An amber handle sits on the horizontal axis and controls scaleX — drag right to stretch, left to compress.  A rose handle sits on the vertical axis and controls scaleY — drag down to stretch, up to compress.  Each handle is constrained to its own axis so the two factors are always independent.  A faint ghost shows the original size for comparison.  Live scaleX and scaleY readouts appear in the top-left corner.

## Key concepts

- **`Shapes.scaleBy()`** — scales a shape non-uniformly around an anchor point; scaleX and scaleY are independent, so values below 1 compress and values above 1 stretch; negative values flip the shape across that axis
- **`Shapes.copy()`** — writes the scaled result into an existing polygon visual on every update; no new canvas objects are created inside the reactive block
- **Axis constraint** — each handle's off-axis coordinate is snapped back to the anchor position inside the reactive block, giving the feel of a one-dimensional slider while remaining a standard disk handle