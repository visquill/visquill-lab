# Contributing

VisQuill Lab is a workshop, not a product. Contributions are welcome, but expectations are intentionally low-key.

## What's welcome

- New concepts or blueprints that demonstrate something genuinely useful
- Fixes for things that are broken or misleading
- Improvements to existing examples — cleaner code, better patterns, missing parameters
- Documentation corrections

## What to expect

There is no formal review process and no guaranteed response time. PRs may sit for a while. If something is clearly useful and doesn't break anything, it will likely get merged eventually.

If you're unsure whether something fits, open an issue first.

## Guidelines

- Follow the existing folder and naming conventions — each demo lives in its own folder, with a `demo.ts` entry point and optional `styles.css`/`styles.scss` and a markdown description
- Add `// @name` and `// @category` metadata at the top of `demo.ts` so the explorer picks it up correctly
- Keep examples focused — one idea per demo
- MIT license applies to everything here; your contributions will be under the same license

## Writing a README

Each demo folder has a `README.md`. It is shown next to the demo in the explorer and on visquill.com,
so it should teach the one idea of the demo, not describe the screen.

Concepts use this structure:

```md
# Title

One sentence: the GDK idea this demo teaches.

## How it works
A few sentences of plain prose, then the key lines copied from demo.ts (use `// …` for cuts).

## API
- `Qualified.name`: what it does, in one line

## Notes        (optional: real gotchas only)
## See also     (optional: `category/folder` of related demos)
```

Blueprints use `## Usage` (a short example) and `## Options` instead of How it works and API.

Rules:
- At most 180 words outside code blocks.
- Don't describe what is visible; the reader is looking at it.
- Qualify every GDK name (`Circles.pointAt`, not `pointAt()`), and only list names the demo uses.
- Every statement must be true of the code next to it. Snippets are copied, not paraphrased.
- Plain words: no dashes as separators, no "seamlessly", "instantly", "powerful" and the like.

## Reporting issues

If something is broken, file an issue with enough detail to reproduce it. No special template required.