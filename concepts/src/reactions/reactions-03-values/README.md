# Reactive Values

A counter driven by a single `canvas.values.real`, with three independent reactive blocks each responding to it.

## What you see

A large number display, a vertical progress bar, and a status message — all updating together when you click **+** or **−**. A reset button returns everything to zero.

## Key concepts

- **Plain values as reactive sources** — `canvas.values.real(0)` creates a reactive value just like a handle does; writing `count.value = x` triggers all downstream blocks automatically
- **Multiple independent subscribers** — three separate `Reactive.do([count], ...)` blocks each subscribe to the same value and update a different part of the UI without knowing about each other; this is how VisQuill separates concerns
- **One write, many effects** — the button handlers contain a single line (`count.value += 1`); all visual updates are handled by the reactive system, not by the button
- **Conditional logic inside `Reactive.do`** — the callback is plain JavaScript; the status block uses an `if/else` chain to produce context-sensitive text, showing that reactive blocks can contain any logic