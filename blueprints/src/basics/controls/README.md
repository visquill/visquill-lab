# Controls

SVG buttons, toggle buttons that cycle through values, and a panel of toggles.

## Usage

```ts
import { Controls, Options } from "@visquill/visquill-blueprints"

Controls.button(group, {
    bottomLeft: { x: 50, y: 100 },
    width: 120,
    height: 40,
    label: { text: "Click me" },
    onClick: () => console.log("clicked"),
})

const radii = new Options.Pixels({ values: [80, 100, 120], title: "Radius", animationTime: 1000 })
const radius = radii.bind(canvas.values.real())   // follows every click

Controls.optionsPanel(group, { anchor: { x: 10, y: 40 }, entries: [radii] })
```

## Options

`Controls.button(group, options)`:

| Option | Meaning |
|---|---|
| `bottomLeft` | corner the button grows right and up from |
| `width`, `height` | size, number or `Real` |
| `style` | class of the rectangle |
| `label` | `text`, `style`, `anchorX`, `anchorY` |
| `onClick` | click handler |

`Controls.toggleButton` takes `toggle` (an `Options` object) instead of `label`; each click calls `next()` and updates the label.

`Controls.optionsPanel` stacks one toggle per entry. `anchor` is the bottom-left corner of the first button; `gap` (default 30) is the step down.

`Options.Pixels`, `Radians`, `Integers` animate bound `Real` values when `animationTime` is set. `Strings`, `Booleans` and `Points` set their values directly.
