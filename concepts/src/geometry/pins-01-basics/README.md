# Basics

A pin is a position plus an orientation vector; the `Pins` functions turn, scale and move it.

## How it works

The pin is a value from `canvas.values.pin()`. Each button calls one `Pins` function and writes the result back into the same pin. The pin is a sender, so the arrow and the info panel update after every click:

```ts
const pin = canvas.values.pin(startPosition)
Pins.withLength(pin, initialLength, pin)
// …
{ label: "rotateBy 45°", apply: () => Pins.rotateBy(pin, Math.PI / 4, pin)     },
{ label: "flipX",        apply: () => Pins.flipX(pin, pin)                      },
{ label: "moveLeft",     apply: () => Pins.moveLeft(pin, moveStep, pin)         },
```

The move functions work in the pin's own frame: after a rotation, `Pins.moveLeft` goes to the left of the arrow, not to the left of the screen. They move by a distance in pixels; the orientation's length does not matter.

## API

- `Pins.rotateLeft`, `Pins.rotateRight`, `Pins.rotateBy`, `Pins.reverse`: turn the orientation
- `Pins.flipX`, `Pins.flipY`: negate the orientation's x or y
- `Pins.scaleBy`, `Pins.withLength`: change the orientation's length
- `Pins.moveForward`, `Pins.moveBackward`, `Pins.moveLeft`, `Pins.moveRight`: move relative to the orientation
- `Pins.getPosition`, `Pins.getOrientation`, `Pins.angle`, `Pins.len`: read the pin

## See also

- `geometry/pins-02-movement`
