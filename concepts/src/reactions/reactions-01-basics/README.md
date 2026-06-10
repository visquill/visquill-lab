# Basics

The minimal reactive setup — two draggable handles and a derived midpoint that updates automatically.

## What you see

Two colored dots on a horizontal track and another green point between them. Drag either dot left or right: its coordinate label updates, and the green points slides to the average position of the two.

## Key concepts

- **`Reactive.do([sender], fn)`** — registers a block that re-runs whenever the sender changes; the block watching a single handle updates that handle's label
- **Multiple senders** — passing both handles as the dependency array means the midpoint block fires when *either* one moves; this is the core "fan-in" pattern
- **Handles as reactive values** — a handle's position is itself a reactive value, so it can be both a drag target and a dependency in a `Reactive.do()` block