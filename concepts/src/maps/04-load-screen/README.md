# Async Data & Loading Screen

Showing a loading overlay while the map style and data load in parallel, then dismissing it with `layer.mounted`.

## What you see

A light overlay with a "Loading…" label covers the map while two things happen in parallel: the MapLibre style loads and the capital data is prepared (simulated with a 1.2 s delay). Once both are ready the overlay disappears and European capitals appear as MapLibre circle markers.

## Key concepts

- **`layer.mounted`** — setting `loadingLayer.mounted.value = false` removes the entire layer from the SVG tree in one line. Both the pane and the label disappear together without needing to track them individually. This is the idiomatic way to show and hide groups of elements in VisQuill.

- **Layer z-order** — `contentLayer` is created before `loadingLayer`, so it renders below. The overlay sits on top purely by virtue of creation order. Content can be fully built and wired up behind the overlay before data arrives.

- **`Promise.all` for parallel loading** — the map `"load"` event and the data are independent; `Promise.all([mapReady, dataReady])` waits for both before dismissing the overlay and calling `buildScene`. If data arrives before the style (or vice versa) neither races ahead — `addGroup` requires the style to be loaded.

- **`map.map!.once("load")`** — MapLibre requires its style to be fully loaded before sources and layers can be added. Wrapping it in a Promise integrates cleanly with `Promise.all`.

- **`loadCapitals()` as the swap point** — the simulated delay lives entirely inside `loadCapitals()`. Replacing `setTimeout` with a real `fetch()` requires no other changes; the rest of the demo is identical.