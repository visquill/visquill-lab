# Boxes - Inflate & Pad

Two ways to expand or shrink a box, shown simultaneously so the difference is immediately clear.

## What you see

A dashed grey source box in the centre. The blue box is the `inflate` result; the orange box is the `pad` result. Both are live — drag the sliders and both update at once. Negative values shrink.

## Key concepts

- **`Boxes.inflate(box, dx, dy)`** — expands by `dx` on *each* horizontal side and `dy` on *each* vertical side; the expansion is always symmetric. A dx of 20 makes the box 40 pixels wider.
- **`Boxes.pad(box, left, top, right, bottom)`** — expands each side independently; the four values can differ and can have opposite signs. Useful for asymmetric insets such as leaving extra room on one side for a label.
- The key distinction: `inflate` has 2 parameters and is always symmetric; `pad` has 4 parameters and each side is controlled separately.