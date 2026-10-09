# Data Layers

Draw many points with MapLibre's own circle layers and keep only the interface in the SVG overlay.

## How it works

Each point drawn as SVG is an element in the page. For dense data, MapLibre draws circles on its WebGL canvas instead. `map.addGroup` (in `maps/utils`) creates an empty circle layer with a style and a `minZoom`; `map.setGroupPoints` fills it. Layers can be added only after the map style has loaded.

```ts
map.map!.once("load", () => {
    map.addGroup("capitals", {
        color:   "#6366f1",
        radius:  7,
        opacity: 0.9,
        minZoom: 3,
    });
    // …
    map.setGroupPoints("capitals", CAPITALS);
    map.setGroupPoints("cities",   CITIES);
});
```

The cities layer has `minZoom` 6, so MapLibre shows it only from zoom 6 on; no code switches it. The zoom label is a VisQuill label, updated with `map.onMove`.

## API

- `Reactive.do`: places the zoom label
- `Vectors.copy`: the label position

## Notes

The map tiles come from OpenFreeMap and need the network.

## See also

- `maps/04-load-screen`
