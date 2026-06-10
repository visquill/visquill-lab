# Point Matching

Optimal one-to-one assignment between a set of sites and a set of ports on an offset polygon.

## What you see

Twenty draggable sites. Their convex hull is offset outward and evenly-spaced ports are distributed around the offset boundary. Each site is connected to its assigned port by a leader line. Drag any site or the slider and the assignments recompute — leader lines never cross unnecessarily.

## Key concepts

- **`Distribute.pointsOnPolygon(ports, polygon)`** — places a fixed number of points evenly around a polygon's perimeter; the ports array is pre-allocated and written in-place
- **`Match.pointsWithPoints(sites, ports)`** — returns an index array solving the optimal one-to-one assignment that minimises total distance; `assignment[i]` is the port index for site `i`
- **Mixed dependency array** — `Reactive.do([...sites, distance], ...)` combines an array spread with a scalar value; the block fires when any site moves or the distance changes
- **Pipeline composition** — hull → offset → distribute → match all run sequentially inside one reactive block, keeping the data flow explicit and easy to follow