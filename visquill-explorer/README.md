# visquill-explorer

The browser-based viewer for VisQuill Lab. Scans the `concepts`, `blueprints`, and `home-screen` packages at build time, generates manifests, and bundles each demo as a standalone ES module.

## Running locally

From the repo root:

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000/visquill-explorer/`.

## Building

From the repo root:

```bash
npm run build
```

Output goes to `visquill-explorer/dist/`. The build runs three things in order: manifest generation, main app bundling, and per-demo compilation.

## Preview the production build

From the repo root:

```bash
npm run preview
```