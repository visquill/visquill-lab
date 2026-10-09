# Reactive Values

A plain value from `canvas.values.real` is a sender, just like a handle.

## How it works

`count` is the only state. Three reactions list it as their sender and each updates one thing: the number, the bar, the status text. They don't know about each other. The buttons only write `count.value`; they never touch a label or the bar.

```ts
const count = canvas.values.real(0)
// …
Reactive.do([count], () => {
    numberLabel.value = String(Math.round(count.value))
})
// …
Svg.get(btnPlus).addEventListener("click", () => {
    if (count.value < MAX_COUNT) count.value += 1
})
```

The bar reaction turns the count into a height and writes the box with `Boxes.spannedBox`. The status reaction picks its text with an `if`/`else` chain: a reaction is a plain function.

## API

- `canvas.values.real`: creates a reactive number
- `Reactive.do`: runs a function now and whenever its senders change
- `Boxes.spannedBox`: writes the box spanned by two corners
- `Boxes.centeredBox`: writes a box of given size around a center
- `Svg.get`: the SVG element of a visual, for DOM events

## See also

- `reactions/reactions-04-chain`
