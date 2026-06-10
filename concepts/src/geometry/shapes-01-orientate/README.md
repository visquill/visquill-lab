# Shapes — Orientate

Rotate a shape by dragging a target direction handle, with a source handle defining what "forward" means.

## What you see

An asymmetric arrow shape with a fixed anchor at its centroid.  A white handle sets the source orientation — the direction the shape considers forward.  A purple handle sets the target orientation.  The shape rotates so that source aligns with target.  A faint ghost shows the original unrotated position for reference.  The angle between source and target is shown as a live readout near the anchor.

## Key concepts

- **`Shapes.orientate()`** — rotates a shape around an anchor point so that one direction vector aligns with another; both vectors are defined relative to the anchor, not as absolute angles; if either vector is zero-length the shape is returned unchanged
- **`Shapes.copy()`** — used here to write the result of `orientate()` into an existing polygon visual without creating a new canvas object on every reactive update
- **Ghost shape** — the original unmodified shape is copied once into a separate polygon visual outside the reactive block and never updated, giving a stable reference that costs nothing to maintain