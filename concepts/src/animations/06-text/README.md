# Text Animation

`Animate.string.animate` changes a label's text into another string, character by character.

## How it works

`currentIndex` selects the string to show. It starts at -1, and the reaction is registered with `false` as its last argument, so it does not run until the Start button sets the index to 0. From then on, every change of the index animates the label to the next string:

```ts
Animate.string.animate(label, strings[currentIndex.value], 100, {
    onComplete: () => Animate.after(500,advance),
    durationMode: RvgTextDurationMode.PerCharacter,
    skipWhitespace: true
})
```

With `PerCharacter`, the 100 ms apply to each character, so longer strings take longer. `skipWhitespace` spends no time on spaces. When a string is complete, `Animate.after` waits 500 ms and calls `advance`, which moves to the next string until the last one is shown.

## API

- `Animate.string.animate`: animates a text from its current string to a new one
- `Animate.after`: calls a function after a delay
- `RvgTextDurationMode.PerCharacter`: the duration is per character, not for the whole text
- `Reactive.do`: runs a function whenever its inputs change

## See also

- `animations/02-state-machine`
