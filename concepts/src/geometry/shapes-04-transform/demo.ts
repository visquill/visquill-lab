// @name Transform
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points, Pins, Vectors,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 0
const cy = 0

// Asymmetric arrow shape centred at origin so the pin transform is
// applied cleanly around (0, 0) before being placed on canvas.
const arrowVertices: [number, number][] = [
    [  80,   0 ],
    [  10,  40 ],
    [  10,  18 ],
    [ -60,  18 ],
    [ -60, -28 ],
    [  10, -28 ],
    [  10, -40 ],
].map(([x, y]) => [cx + x, cy + y])

// Initial pin: anchor at centre, tip 90px to the right (angle=0, scale=1).
const anchorStart: [number, number] = [cx, cy]
const tipStart:    [number, number] = [cx + 90, cy]

/**
 * Demonstrates `Shapes.transform()` — applying a similarity transform
 * encoded in a `Pin` to a shape.
 *
 * A pin combines translation (its location), rotation (the angle of its
 * orientation vector), and uniform scale (the length of its orientation
 * vector).  All three are controlled by two draggable handles:
 *
 *  - **Anchor handle** (white) — sets the pin's location, i.e. the
 *    translation.  The tip handle moves with it so rotation and scale
 *    are preserved.
 *  - **Tip handle** (purple) — sets the orientation vector endpoint.
 *    Dragging it changes both rotation (angle from anchor) and scale
 *    (distance from anchor, relative to the reference length).
 *
 * A ghost shows the original unmodified shape for reference.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-shapes-transform-")
    const canvas = rvg.canvas
    const content = canvas.layer()
    content.handles.defaultZIndex = 1


    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag anchor to translate · Drag tip to rotate and scale",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
        Vectors.copy(rvg.center,content.anchor)
    })

    // ─── Handles ──────────────────────────────────────────────────────
    const hAnchor = content.handles.disk("handle-anchor", anchorStart)
    const hTip    = content.handles.disk("handle-tip",    tipStart)

    // ─── Ghost shape ──────────────────────────────────────────────────
    const ghost = content.visuals.polygon("ghost")

    // ─── Transformed shape ────────────────────────────────────────────
    const arrow = content.visuals.polygon("arrow")

    // ─── Pin axis line (anchor → tip) ─────────────────────────────────
    const axis = content.visuals.segment("axis")

    // ─── Anchor dot (centre of pin location) ──────────────────────────
    const anchorDot = content.visuals.point("anchor-dot")

    // ─── Tip dot ──────────────────────────────────────────────────────
    const tipDot = content.visuals.point("tip-dot")

    // ─── Info labels (top-left) ───────────────────────────────────────
    const infoLeft  = 20
    const infoTop   = 55
    const infoLineH = 20

    const labelAngle  = canvas.text.label("", "info-label")
    const labelScale  = canvas.text.label("", "info-label")
    const labelTransX = canvas.text.label("", "info-label")
    const labelTransY = canvas.text.label("", "info-label")

    Reactive.do([rvg.frame], () => {
        const tl = Boxes.topSide(rvg.frame).at(0)
        Points.moveRight(Points.moveDown(tl, infoTop + 0 * infoLineH), infoLeft, labelAngle)
        Points.moveRight(Points.moveDown(tl, infoTop + 1 * infoLineH), infoLeft, labelScale)
        Points.moveRight(Points.moveDown(tl, infoTop + 2 * infoLineH), infoLeft, labelTransX)
        Points.moveRight(Points.moveDown(tl, infoTop + 3 * infoLineH), infoLeft, labelTransY)
    })

    // ─── Reference pin length (scale = 1) ────────────────────────────
    // The initial distance from anchor to tip defines "scale = 1".
    const refLen = Math.hypot(
        tipStart[0] - anchorStart[0],
        tipStart[1] - anchorStart[1]
    )
    Pins.withLength(hAnchor,refLen,hAnchor)

    // ─── Reactive block — anchor moved ────────────────────────────────
    // When the anchor moves, shift the tip by the same delta so the
    // orientation vector (and therefore rotation + scale) is unchanged.
    Reactive.do([hAnchor], () => {
        Pins.moveForward(hAnchor,Pins.len(hAnchor).value,hTip)
    })

    Reactive.do([hTip],()=>{
        Pins.withOrientation(hAnchor,Vectors.direction(hAnchor,hTip),hAnchor)
    })

    // ─── Reactive block — full recompute ──────────────────────────────
    Reactive.do([hAnchor, hTip], () => {
        // Derive readable values.
        const pin = Pins.withLength(hAnchor,Pins.len(hAnchor).value/refLen)
        const angleDeg = (Pins.angle(pin).value * 180 / Math.PI).toFixed(1)
        const scale    = (Pins.len(pin).value).toFixed(2)

        // Ghost stays at original position.
        const base = canvas.shapes.polygon(arrowVertices)
        Shapes.copy(base, ghost)

        // Apply the similarity transform.
        const result = Shapes.transform(base, pin)
        Shapes.copy(result, arrow)

        // Axis line.
        Points.copy(hAnchor, axis.at(0))
        Points.copy(hTip,    axis.at(1))

        // Dots.
        Points.copy(hAnchor, anchorDot)
        Points.copy(hTip,    tipDot)

        // Info panel.
        labelAngle.value  = `angle:   ${angleDeg}°`
        labelScale.value  = `scale:   ${scale}×`
        labelTransX.value = `trans x: ${hAnchor.x.toFixed(1)} px`
        labelTransY.value = `trans y: ${hAnchor.y.toFixed(1)} px`
    }, true)
}