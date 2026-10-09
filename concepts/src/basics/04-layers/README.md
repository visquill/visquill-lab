# Layers

A layer has its own coordinate system, placed and turned by its anchor.

## How it works

Shapes on a layer are drawn around the layer's local `[0, 0]`. The anchor decides where that origin is on the canvas. All three badges use the same local coordinates; only the anchors differ.

```ts
const layerA = canvas.layer("layer-a-")
Vectors.copy(LAYER_POSITIONS[0], layerA.anchor)

layerA.visuals.box("badge", [-BADGE_HALF, -BADGE_HALF], [BADGE_HALF, BADGE_HALF])
```

A layer created on another layer is placed in its parent's coordinates, and `zIndex` orders layers. The anchor is a pin, so its orientation turns the whole layer:

```ts
const subLayer = layerB.layer("sub-")
Vectors.copy([55, 55], subLayer.anchor)
// …
layerB.zIndex.value = 2
// …
Pins.withOrientation(layerRot.anchor, Vectors.fromAngle(Math.PI / 6), layerRot.anchor)
```

## API

- `canvas.layer`: creates a child layer, optionally with a class prefix (`layerB.layer` on a layer)
- `Vectors.copy`: sets a point or pin from coordinates
- `Pins.withOrientation`: sets a pin's direction
- `Vectors.fromAngle`: a unit vector for an angle in radians

## Notes

The layer prefix is added after the parent's: the sub-layer's `"badge"` gets the class `demos-basics-layers-layer-b-sub-badge`.

## See also

- `basics/03-rvg-frame`
- `basics/05-attach`
