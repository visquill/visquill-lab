# Match Points

Nearest-neighbour matching between two draggable point sets, updating live.

## What you see

Six indigo points (set1) and four orange points (set2).  Dashed lines connect each set2 point to its nearest set1 point.  Drag any point and the connectors reroute instantly.  Because set2 has fewer points than set1, some set1 points will go unmatched — drag a set2 point to shift which set1 points are left out.

## Key concepts

- **`Match.pointsWithPoints(set2, set1)`** — called here with the smaller set as the first argument; returns an index array of length `set2.length`, each entry being the index into set1 of the nearest neighbour
- **Directionality** — matching is always from the first argument *to* the second; every point in the first set gets exactly one match, but points in the second set can be matched by multiple or none at all
- **Unmatched points** — demonstrated here with 4 vs 6 points; passing the smaller set first guarantees every connector is used and the two unmatched set1 points are left without a line