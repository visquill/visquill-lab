# Point Set Analysis

Four properties of a point cloud, all updating live as you drag.

## What you see

A scatter of blue draggable points and one orange reference handle. The **green dot** is the centroid. The **purple dashed line** is the diagonal — the segment connecting the two farthest-apart points in the cloud. The **green dashed line** connects the reference to the nearest point; the **red dashed line** to the farthest. Drag any blue point to reshape the cloud, or drag the orange reference to change which points are nearest and farthest.

## Key concepts

- **`centroid(points)`** — the geometric average (mean x, mean y) of all points in the set
- **`diagonal(points)`** — returns a segment whose endpoints are the two points with the greatest mutual distance; useful as a quick bounding measure
- **`pointWithMinDistance(ref, points)`** — returns the point in the set closest to `ref`
- **`pointWithMaxDistance(ref, points)`** — returns the point in the set farthest from `ref`