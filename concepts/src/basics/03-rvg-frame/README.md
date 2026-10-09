# Frame and Center

`rvg.frame` and `rvg.center` describe the graphic's own bounds and follow the container when it is resized.

## How it works

`rvg.frame` is a reactive box. A `Reactive.do` on it copies the box and its corners into visuals each time the size changes. The labels are attached to the corner points, so they move with them.

```ts
Reactive.do([rvg.frame], () => {
    Boxes.copy(rvg.frame, frame);
    Boxes.topLeft(rvg.frame, topLeft);
    Boxes.topRight(rvg.frame, topRight);
    Boxes.bottomLeft(rvg.frame, bottomLeft);
    Boxes.bottomRight(rvg.frame, bottomRight);
}, true);
```

`rvg.center` is a point that is already kept at the middle of the frame. The crosshair is drawn around `[0, 0]` on its own layer, and the layer's anchor is attached to the center:

```ts
const centerGroup = canvas.layer();
// …
Attach.pointToPoint(centerGroup.anchor, center);
```

## API

- `Reactive.do`: runs a function now and whenever one of its senders changes
- `Boxes.copy`: copies one box into another
- `Boxes.topLeft`, `Boxes.topRight`, `Boxes.bottomLeft`, `Boxes.bottomRight`: corners of a box
- `Attach.pointToPoint`: keeps a point, a label or a layer anchor on another point

## See also

- `basics/04-layers`
