# Custom Extreme

Find the most extreme point in any direction using a custom comparison function.

## What you see

A cloud of draggable points on the left and a direction arrow on the right. The angle slider rotates the direction vector through a full 360°. The purple ring highlights whichever point is most extreme in the current direction — equivalent to finding the support point of a convex hull in that direction. A dashed line extends from the winning point along the direction to make the geometry clear.

## Key concepts

- **`Extremes.extreme(points, comparison)`** — applies a custom comparator to find the most extreme point; the comparison receives two points and returns a negative number when the first is considered more extreme than the second
- **Direction-based comparison** — `extreme` is used here with `(p, q) => dot(q, dir) - dot(p, dir)`, which selects the point with the largest projection onto `dir`; this is the general form that `topMost`, `bottomMost`, `leftMost`, and `rightMost` are all special cases of