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
// The handles sit on the axes through the anchor (cx, cy).
const hXStart: [number, number] = [cx + 80,  cy]       // on the right (+x axis)
const hYStart: [number, number] = [cx,        cy + 40]  // below (+y axis)

// Distance from the anchor that means scale 1 (the handles' start positions).
const refX = hXStart[0] - cx
const refY = hYStart[1] - cy

// Range limits so scale can't go negative.
const minScale   = 0.15
const maxScale   = 4.0

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
    // The fixed point of the scaling; shown as a small dot.
    const anchor = canvas.visuals.point("anchor", [cx, cy])

    // ─── Scale handles ────────────────────────────────────────────────
    const hX = canvas.handles.disk("handle-x", hXStart)
    const hY = canvas.handles.disk("handle-y", hYStart)

    // ─── Track lines ──────────────────────────────────────────────────
    // Each handle is kept on its track, which spans minScale…maxScale.
    const trackX = canvas.visuals.segment("track-x", [cx + refX * minScale, cy], [cx + refX * maxScale, cy])
    const trackY = canvas.visuals.segment("track-y", [cx, cy + refY * minScale], [cx, cy + refY * maxScale])

    // ─── Ghost shape ──────────────────────────────────────────────────
    canvas.visuals.polygon("ghost", arrowVertices)

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
        // Keep each handle on its track.
        Points.closestPointOnSegment(hX, trackX, hX)
        Points.closestPointOnSegment(hY, trackY, hY)

        // Scale factor = distance from the anchor relative to the start distance.
        const scaleX = Points.distanceToPoint(anchor, hX).value / refX
        const scaleY = Points.distanceToPoint(anchor, hY).value / refY

        // Scale around anchor.
        Shapes.scaleBy(arrowVertices, anchor, scaleX, scaleY, scaled)

        // Handle labels.
        Points.moveRight(hX, 14, labelXHead)
        Points.moveDown(hY,  14, labelYHead)

        // Info panel readout.
        labelX.value = `scaleX: ${scaleX.toFixed(2)}`
        labelY.value = `scaleY: ${scaleY.toFixed(2)}`
    }, true)
}