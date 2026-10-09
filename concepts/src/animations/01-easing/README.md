# Easing Functions

An easing function decides how an animated value travels from its start to its target.

## How it works

Each row has a `Real` for the length of its bar. `Attach.rectangleHeightToValue` ties the bar to that value, so the bar redraws whenever it changes. A row's button animates its value with `Animate.real.eased` and that row's easing function:

```ts
Attach.rectangleHeightToValue(bar, barValue);
// …
Animate.real.eased(barValue, targetValue, 1000, {easing: ease.fn});
```

Every animation takes 1000 ms, so the rows differ only in how they move, not in when they arrive. The targets come from one shared list, so each click takes the next value from it.

## API

- `Animate.real.eased`: animates a `Real` to a target value with an easing function
- `Attach.rectangleHeightToValue`: keeps a rectangle's height equal to a `Real`
- `Rectangles.alongSegment`: places a rectangle on a segment; here the segments are vertical, so the bars grow to the right
- `EasingFunctions.easeOutBack`: one of the eight built-in curves shown here

## See also

- `animations/08-clock`
