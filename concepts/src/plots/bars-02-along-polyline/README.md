# Bars Along Polyline

One bar per segment of an open path.

## What you see

Seven draggable vertices connected by six segments. A bar grows from each segment, sized by a fixed set of values. Drag any vertex to reshape its adjacent segments and watch the two bars on either side follow immediately. Because the path is open, there is no bar on a closing edge — only the six segments between consecutive vertices carry one.

## Key concepts

- **`Bars.fromSegment(p1, p2, value, left, result)`** — constructs a bar whose baseline is the segment from p1 to p2; orientation and width are derived entirely from the segment, so bars follow automatically when vertices move