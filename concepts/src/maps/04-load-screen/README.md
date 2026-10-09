# Async Data & Loading Screen

Cover the map with a loading layer until the map style and the data are both ready, then remove the layer in one step.

## How it works

The overlay is its own layer: a box over the whole frame and a label in its centre.

```ts
const loadingPane  = loadingLayer.visuals.box("pane");
const loadingLabel = loadingLayer.text.label("Loading…", "label");

Reactive.do([rvg.frame], () => {
    Boxes.copy(rvg.frame, loadingPane);
    Vectors.copy(rvg.center, loadingLabel);
});
```

Two things load at the same time: the MapLibre style (`"load"` event) and the data (`loadCapitals`, a simulated 1.2 s fetch). `Promise.all` waits for both. Then the points are added and `mounted` is set to false, which takes the whole layer out of the page.

```ts
const mapReady  = new Promise<void>(resolve => map.map!.once("load", () => resolve()));
const dataReady = loadCapitals();

Promise.all([mapReady, dataReady]).then(([, capitals]) => {
    buildScene(capitals);
    loadingLayer.mounted.value = false;
});
```

## API

- `canvas.layer`: the overlay layer; its `mounted` value shows or removes it
- `Boxes.copy`, `Vectors.copy`: size the pane and centre the label

## See also

- `maps/03-point-layer`
