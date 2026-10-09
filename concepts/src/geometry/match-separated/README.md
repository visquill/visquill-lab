# External Labeling

Connect sites to ports around them with leader lines that do not cross.

## How it works

One reaction chains four steps. The convex hull of the sites is grown by `Offsets.polygon`. `Distribute.pointsOnPolygon` spreads one port per site evenly along that outline. `Match.pointsWithPoints` then pairs each site with its own port so that the total leader length is as small as possible.

```ts
Reactive.do([...sites, distance], () => {
    ConvexHulls.topStart(sites, polygon);
    Offsets.polygon(polygon, distance, true, 1, offset);
    Distribute.pointsOnPolygon(ports, offset);
    const assignment = Match.pointsWithPoints(sites, ports);
    for (let i = 0; i < sites.length; i++) {
        const p1 = ports[assignment[i]];
        const p2 = sites[i];
        Segments.segment(p1, p2, leaders[i]);
    }
}, true);
```

The ports come from `Points.array`, created once. `Distribute.pointsOnPolygon` moves them in place.

## API

- `ConvexHulls.topStart`: the convex hull of a set of points
- `Offsets.polygon`: a polygon offset from a baseline polygon
- `Distribute.pointsOnPolygon`: spreads points evenly along a polygon's edges
- `Match.pointsWithPoints`: an optimal one-to-one pairing of two point sets
- `Points.array`: a list of new points
- `Segments.segment`: writes a leader line between two points

## Notes

A pairing with the smallest total length never has two crossing leaders, since uncrossing them would make the total shorter.

## See also

- `geometry/match-basic`
- `geometry/03-offset-polygon`
