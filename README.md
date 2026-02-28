# VisQuill Lab

A living repository of demos, examples, and reusable components built with the [VisQuill GDK](https://visquill.com/).

> **This is a workshop, not a product.** Things get added, changed, and refined over time. Parameters may be missing, patterns may evolve, and some examples are more finished than others. That's intentional.

**Live explorer:** [visquill.com/developers/lab](https://visquill.com/developers/lab)

---

## What's in here

The repository is a monorepo with four packages:

| Package | Description |
|---|---|
| `concepts` | Demonstrations of core GDK features — shapes, reactions, animations, geometry |
| `blueprints` | Reusable components ready to copy into your own project |
| `visquill-explorer` | The browser-based viewer that renders and browses everything |
| `home-screen` | The landing demo shown when the explorer first loads |

### Concepts

Structured to build understanding from first principles:

- **Basics** — Hello World, shapes & styles
- **Reactions** — reactive values, distances
- **Animations** — easing functions, text animation
- **Geometry** — convex hull and more

### Blueprints

Reusable components found in `blueprints/src`:

- **Controls** — buttons, toggle buttons, options panels
- **Decoration** — labels along polylines, labels at rectangle edges
- **Plots** — hedgehog bar charts along paths
- **Data Lens / Lens Kit** — interactive data lens components

Blueprints are designed to be copied and adapted. Take what's useful, make it yours.

---

## Getting started

Clone and install:

```bash
git clone https://github.com/visquill/visquill-lab.git
cd visquill-lab
npm install
```

Run the explorer locally. This compiles all TypeScript packages first, then starts the dev server:

```bash
npm run dev
```

The explorer will be available at `http://localhost:3000/visquill-explorer/`.

Build everything for deployment:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## CSS prefix chain

The prefix chain used throughout the lab is worth understanding before you start:

```
graphic prefix  +  layer prefix  +  class name you pass in
"my-graphic-"      "chart-"         "bar"
                                    ──────────────────────►
                                    → "my-graphic-chart-bar"
```

VisQuill assembles the full CSS class name automatically. Your stylesheet only needs the fully-qualified name.

---

## License

MIT © 2026 Dr. Benjamin Niedermann — copy, adapt, and use freely. See [LICENSE](./LICENSE) for the full text.