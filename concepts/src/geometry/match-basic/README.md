# Geometric Matching

Pair the points of two sets one-to-one so that the total distance is as small as possible.

## How it works

`Match.pointsWithPoints(set1, set2)` returns one index per point of `set1`: the index of its partner in `set2`. No partner is used twice, and the pairing has the smallest sum of distances of all possible pairings. The demo passes the smaller set first, so every one of its points gets a partner and two points of the larger set stay unmatched.

```ts
Reactive.do([...handles1, ...handles2], () => {
    // indices[i] is the index in handles1 of the partner of handles2[i]
    const indices = Match.pointsWithPoints(handles2, handles1)

    indices.forEach((matchIdx, i) => {
        Segments.segment(handles1[matchIdx], handles2[i], connectors[i])
    })
})
```

Because the total counts, a point is not always paired with its nearest neighbour.

## API

- `Match.pointsWithPoints`: an optimal one-to-one pairing of two point sets
- `Segments.segment`: writes the connector between two points

## See also

- `geometry/match-separated`
