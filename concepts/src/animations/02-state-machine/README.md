# Simple State Machine

Sequencing animations through a reactive integer that advances on each completion callback.

## What you see

A dot and a small blue box tracing a square path, looping continuously. The motion alternates between translating along one axis and rotating 90°, with smooth easing on each step.

## Key concepts

- **State as a reactive `Real`** — an integer value drives the current animation step; when `Reactive.do([state], ...)` fires, it looks up the step in an array and calls `Animate.eased()`
- **`onComplete` as the state transition** — each animation advances `state.value` by 1 when it finishes, which triggers the reactive block again for the next step; the cycle resets automatically when state exceeds the last index
- **Separation of data and display** — `x`, `y`, and `angle` are plain reactive `Real` values; a second `Reactive.do([x, y, angle], ...)` block reads them and updates the visual position and rotation; the state machine only writes values, never touches visuals directly
- **`Pins.orientate()`** — rotates a group anchor to face a given direction vector; `Vectors.fromAngle(angle)` converts the scalar angle into the direction vector it expects