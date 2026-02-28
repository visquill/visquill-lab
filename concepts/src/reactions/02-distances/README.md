# Distances

Three live distance measurements — point-to-point, point-to-segment, and point-to-circle — updating as you drag.

## What you see

Three setups arranged vertically. Drag the blue handles to move the measured points, the green handles to reposition the segment, or the orange handle to move the circle center. Distance values and connector lines update in real time.

## Key concepts

- **`Points.distanceToPoint()`**, **`Points.distanceToSegment()`** — compute distances inside a `Reactive.do()` block and write the result directly into a label value
- **`Points.closestPointOnSegment()`** — finds the nearest point on the segment, which is what the dashed connector line connects to
- **Explicit visual updates** — visual elements like circles don't auto-update when reactive values change; they must be recalculated inside the reactive block that owns them
- **`Points.midPoint()`** — used to position distance labels at the midpoint of each measurement so they stay readable as handles move