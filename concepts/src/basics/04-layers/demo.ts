// @name Layers
// @category Basics

// Demonstrates the layer system: how layers nest, how their anchors position
// and orient everything drawn on them, and how z-order is controlled.

import { VisQuill, Reactive, Vectors, Pins, Boxes, Points, Segments, type RvgGroup } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cy = 200

// The three layer anchor positions.
const LAYER_POSITIONS: [number, number][] = [
    [200, cy],
    [500, cy],
    [800, cy],
]

const BADGE_HALF = 40   // half-size of the badge rectangle drawn on each layer

/**
 * Demonstrates the VisQuill layer system.
 *
 * Three layers are created on the same canvas.  Each contains identical
 * shapes drawn at local coordinates [-BADGE_HALF, BADGE_HALF] — but their
 * anchors put them at different positions on the canvas.
 *
 * A sub-layer nested inside Layer B shows how coordinate spaces stack:
 * drawing at [60, 60] inside the sub-layer places the shape at
 * layerB.anchor + [60, 60] on the canvas.
 *
 * A fourth layer at the bottom demonstrates orientation: setting the
 * anchor's direction rotates the entire local coordinate space, so an
 * axis-aligned rectangle appears rotated on the canvas.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-basics-layers-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Same local coordinates on every layer — the anchor places each one on the canvas",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Layer A ──────────────────────────────────────────────────────
    // A named layer. The prefix "layer-a-" is appended to the canvas
    // prefix for every class name used on this layer.
    // Drawing at (-BADGE_HALF, -BADGE_HALF) → (BADGE_HALF, BADGE_HALF)
    // centres the badge on the anchor, which is local (0, 0).
    const layerA = canvas.layer("layer-a-")
    Vectors.copy(LAYER_POSITIONS[0], layerA.anchor)

    layerA.visuals.box("badge", [-BADGE_HALF, -BADGE_HALF], [BADGE_HALF, BADGE_HALF])
    layerA.text.labelAt("Layer A", [0, 0], "badge-label")
    buildCrosshair(layerA, "crosshair")

    // Anchor label lives on the parent canvas at the world position.
    canvas.text.labelAt("← anchor", [LAYER_POSITIONS[0][0] + BADGE_HALF + 8, LAYER_POSITIONS[0][1]], "anchor-label")

    // ─── Layer B (z-index raised) ─────────────────────────────────────
    // Identical local content. z-index 2 means it renders on top of
    // A and C if they happen to overlap.
    const layerB = canvas.layer("layer-b-")
    Vectors.copy(LAYER_POSITIONS[1], layerB.anchor)
    layerB.zIndex.value = 2

    layerB.visuals.box("badge", [-BADGE_HALF, -BADGE_HALF], [BADGE_HALF, BADGE_HALF])
    layerB.text.labelAt("Layer B", [0, 0], "badge-label")
    buildCrosshair(layerB, "crosshair")
    canvas.text.labelAt("← anchor", [LAYER_POSITIONS[1][0] + BADGE_HALF + 8, LAYER_POSITIONS[1][1]], "anchor-label")

    // ─── Sub-layer nested inside Layer B ─────────────────────────────
    // Created on layerB, not canvas. Its anchor coordinates are in
    // layerB's local space: [55, 55] means 55 px right and 55 px down
    // from layerB's anchor — which is itself at LAYER_POSITIONS[1].
    const subLayer = layerB.layer("sub-")
    Vectors.copy([55, 55], subLayer.anchor)

    subLayer.visuals.box("badge", [-20, -20], [20, 20])
    subLayer.text.labelAt("sub", [0, 0], "sub-label")
    buildCrosshair(subLayer, "sub-crosshair")

    // ─── Layer C (default z-index) ────────────────────────────────────
    const layerC = canvas.layer("layer-c-")
    Vectors.copy(LAYER_POSITIONS[2], layerC.anchor)

    layerC.visuals.box("badge", [-BADGE_HALF, -BADGE_HALF], [BADGE_HALF, BADGE_HALF])
    layerC.text.labelAt("Layer C", [0, 0], "badge-label")
    buildCrosshair(layerC, "crosshair")
    canvas.text.labelAt("← anchor", [LAYER_POSITIONS[2][0] + BADGE_HALF + 8, LAYER_POSITIONS[2][1]], "anchor-label")

    // ─── Rotated layer ────────────────────────────────────────────────
    // Anchor orientation rotates the entire local coordinate space.
    // The rectangle below is axis-aligned in local coordinates, but
    // appears at 30° on the canvas because the layer is rotated.
    const layerRot = canvas.layer("layer-rot-")
    Vectors.copy([500, 370], layerRot.anchor)
    Pins.withOrientation(layerRot.anchor, Vectors.fromAngle(Math.PI / 6), layerRot.anchor)

    layerRot.visuals.box("badge-rotated", [-55, -22], [55, 22])
    layerRot.text.labelAt("rotated", [0, 0], "badge-label-rotated")
    buildCrosshair(layerRot, "crosshair-rotated")

    canvas.text.labelAt(
        "Anchor orientation rotates the whole local coordinate space",
        [500, 440],
        "caption"
    )
}

// ─── Helper ───────────────────────────────────────────────────────────────
/**
 * Draws a small crosshair centred on the layer's local origin (0, 0),
 * which is where the anchor lives.
 */
function buildCrosshair(layer: RvgGroup, cls: string) {
    const arm = 14
    layer.visuals.segment(cls, [-arm, 0], [arm, 0])
    layer.visuals.segment(cls, [0, -arm], [0,  arm])
}