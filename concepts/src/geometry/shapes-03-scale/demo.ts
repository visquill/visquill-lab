// @name Scale By
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 420
const cy = 300

// Asymmetric arrow shape centred at (cx, cy).
const arrowVertices: [number, number][] = [
    [  80,   0 ],
    [  10,  40 ],
    [  10,  18 ],
    [ -60,  18 ],
    [ -60, -28 ],
    [  10, -28 ],
    [  10, -40 ],
].map(([x, y]) => [cx + x, cy + y])

// Scale handles start at 1× in each axis.
// Drag right to grow X; drag down to grow Y.
// The handles sit on the axes of the arrow's centroid.
const hXStart: [number, number] = [cx + 80,  cy]       // on the right (+x axis)
const hYStart: [number, number] = [cx,        cy + 40]  // below (+y axis)

// Range limits so scale can't go negative.
const minScale   = 0.15
const maxScale   = 4.0
const trackLen   = 180   // reference length for computing scale factor

/**
 * Demonstrates `Shapes.scaleBy()` with independent X and Y scale factors.
 *
 * The anchor is the shape's centroid (fixed).  The horizontal handle
 * controls scaleX: drag right to stretch, left to compress.  The vertical
 * handle controls scaleY: drag down to stretch, up to compress.  Both
 * factors are shown in a live readout.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-shapes-scaleby-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the X handle left/right · Drag the Y handle up/down",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Anchor ───────────────────────────────────────────────────────
    // Fixed at the shape centroid; shown as a small dot.
    const anchorDot = canvas.visuals.point("anchor")
    const anchor    = { x: cx, y: cy }

    // ─── Scale handles ────────────────────────────────────────────────
    // X handle: only horizontal movement matters — constrain visually by
    // snapping its y back to cy in the reactive block.
    const hX = canvas.handles.disk("handle-x", hXStart)
    const hY = canvas.handles.disk("handle-y", hYStart)

    // ─── Track lines ──────────────────────────────────────────────────
    // Show the axis the handle travels along.
    const trackX = canvas.visuals.segment("track-x")
    const trackY = canvas.visuals.segment("track-y")

    // ─── Ghost shape ──────────────────────────────────────────────────
    const ghost = canvas.visuals.polygon("ghost")

    // ─── Scaled shape ─────────────────────────────────────────────────
    const scaled = canvas.visuals.polygon("scaled")

    // ─── Labels ───────────────────────────────────────────────────────
    const labelX     = canvas.text.label("scaleX: 1.00", "scale-label-x")
    const labelY     = canvas.text.label("scaleY: 1.00", "scale-label-y")
    const labelXHead = canvas.text.label("X", "handle-label")
    const labelYHead = canvas.text.label("Y", "handle-label")

    // Info panel (top-left)
    const infoLeft = 20
    const infoTop  = 55
    const infoLineH = 20
    Reactive.do([rvg.frame], () => {
        const tl = Boxes.topSide(rvg.frame).at(0)
        Points.moveRight(Points.moveDown(tl, infoTop + 0 * infoLineH), infoLeft, labelX)
        Points.moveRight(Points.moveDown(tl, infoTop + 1 * infoLineH), infoLeft, labelY)
    })

    // ─── Reactive block ───────────────────────────────────────────────
    Reactive.do([hX, hY], () => {
        // Derive scale factors from handle offset relative to anchor.
        // X handle: horizontal displacement only.
        const rawX = (hX.x - anchor.x) / trackLen
        const rawY = (hY.y - anchor.y) / trackLen

        const scaleX = Math.max(minScale, Math.max(-maxScale, rawX < 0 ? rawX : rawX))
        const scaleY = Math.max(minScale, Math.max(-maxScale, rawY < 0 ? rawY : rawY))

        // Snap handles to their respective axes (ignore off-axis drag).
        // (We mutate the reactive value to constrain the handle.)
        hX.y = anchor.y
        hY.x = anchor.x

        // Track lines along each axis.
        Points.copy({ x: anchor.x - trackLen, y: anchor.y }, trackX.at(0))
        Points.copy({ x: anchor.x + trackLen, y: anchor.y }, trackX.at(1))
        Points.copy({ x: anchor.x, y: anchor.y - trackLen }, trackY.at(0))
        Points.copy({ x: anchor.x, y: anchor.y + trackLen }, trackY.at(1))

        // Ghost.
        const base = canvas.shapes.polygon(arrowVertices)
        Shapes.copy(base, ghost)

        // Scale around anchor.
        const result = Shapes.scaleBy(base, anchor, scaleX, scaleY)
        Shapes.copy(result, scaled)

        // Anchor dot.
        Points.copy(anchor, anchorDot)

        // Handle labels.
        Points.moveRight(hX, 14, labelXHead)
        Points.moveDown(hY,  14, labelYHead)

        // Info panel readout.
        labelX.value = `scaleX: ${scaleX.toFixed(2)}`
        labelY.value = `scaleY: ${scaleY.toFixed(2)}`
    }, true)
}