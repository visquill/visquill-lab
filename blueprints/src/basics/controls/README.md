# Controls

Reusable SVG buttons for VisQuill graphics: plain buttons, styled buttons, interactive buttons with click handlers, toggle buttons that cycle through values, and an options panel for stacking toggles.

## What it gives you

A `button()` function that creates a rectangle with an optional text label, anchored at its bottom-left corner. A `toggleButton()` that cycles through a set of values on each click and updates its label automatically. An `optionsPanel()` that stacks multiple toggle buttons with shared layout settings.

Buttons are standard SVG elements — attach click handlers via `Svg.get(btn.frame).addEventListener("click", ...)`.

## Basic usage

```typescript
import { Controls } from "@visquill/visquill-blueprints"
import { Svg } from "@visquill/visquill-gdk"

const btn = Controls.button(group, {
    bottomLeft: { x: 50, y: 100 },
    width: 120,
    height: 40,
    label: { text: "Click me" }
})

Svg.get(btn.frame).addEventListener("click", () => {
    // handle click
})
```

## Options

**`Controls.button(group, options)`**

| Option | Type | Description |
|---|---|---|
| `bottomLeft` | `Point` | Anchor point — button grows right and up from here |
| `width` | `number` | Button width in canvas units |
| `height` | `number` | Button height in canvas units |
| `style` | `string` | CSS class for the rectangle (default: inline dark-blue fill) |
| `label.text` | `string` | Label text (omit for no label) |
| `label.style` | `string` | CSS class for the label |
| `label.anchorX` | `"left" \| "center" \| "right"` | Horizontal text anchor within the button |
| `label.anchorY` | `"top" \| "center" \| "bottom"` | Vertical text anchor within the button |

**`Controls.toggleButton(group, options)`**

Same as `button` plus a `toggle` field — an `Options` instance (`Strings`, `Pixels`, `Radians`, `Booleans`) that manages the cycling value and label text.

**`Controls.optionsPanel(group, options)`**

| Option | Type | Description |
|---|---|---|
| `anchor` | `Point` | Top-left origin of the stack |
| `entries` | `Options[]` | One toggle button per entry |
| `gap` | `number` | Vertical spacing between buttons |
| `width`, `height`, `style` | | Shared across all buttons in the panel |