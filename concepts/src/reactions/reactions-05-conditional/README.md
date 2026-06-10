# Conditional Reactive

A probe handle that changes colour and triggers a state switch when it gets close to a segment — all decided inside a single reactive callback.

## What you see

    Two endpoint handles define a segment. An orange probe handle can be dragged anywhere on the canvas. A dashed connector shows the shortest distance from the probe to the segment. When the probe enters the threshold circle, everything switches: the probe turns red, the connector goes solid, and the status label changes.

## Key concepts

    - **Plain JavaScript inside callbacks** — a `Reactive.do` callback is just a function; `if/else`, arithmetic, string formatting — all of it works exactly as you'd expect
    - **One block, one responsibility** — all geometry and all conditional switching live in a single block that watches three dependencies; it fires once whenever any of them changes and decides the full visual state from scratch
    - **Writing different values conditionally** — the branch doesn't show or hide separate visuals; it writes different values (colour, opacity, text) to the *same* visuals; this avoids managing two sets of DOM elements
    - **`canvas.shapes.*` vs `canvas.values.*` inside `Reactive.do`** — `canvas.shapes.segment()` is a plain data constructor and is safe to call inside a callback; `canvas.values.real()` creates a reactive node and must always be called outside