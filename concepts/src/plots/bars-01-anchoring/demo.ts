// @name Anchoring
// @category Plots
// @group Bars

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins, Bars, type Rectangle,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const barWidth  = { value: 160 }
const barHeight = { value: 70 }

/**
 * Demonstrates `Bars.fromAnchoredPin` with different anchor ratios on a
 * shared draggable pin.
 *
 * Three bars share the same pin (position + orientation) but differ in
 * where along their width the pin sits:
 *  - Green:  anchor 0.0 — pin is at the left edge.
 *  - Orange: anchor 0.5 — pin is at the centre.
 *  - Purple: anchor 1.0 — pin is at the right edge.
 *
 * Drag the position handle to move all three bars, or drag the direction
 * handle to rotate them.  The anchor markers (small dots) stay pinned to
 * the handle regardless of orientation.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-bars-anchoring-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the position handle · drag the direction handle to rotate",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Pin handles ───────────────────────────────────────────────────
    // The pin is defined by two draggable handles: a position and a
    // direction end-point; the pin sits on posHandle and points to dirHandle.
    const posHandle = canvas.handles.disk("pos-handle", [450, 280])
    const dirHandle = canvas.handles.disk("dir-handle", [590, 280])

    // Connector line between the two handles for clarity.
    canvas.visuals.segment("pin-connector", posHandle, dirHandle)

    // ─── Three bar visuals ─────────────────────────────────────────────
    const barLeft   = canvas.visuals.polygon("bar-left")    // anchor 0.0
    const barCenter = canvas.visuals.polygon("bar-center")  // anchor 0.5
    const barRight  = canvas.visuals.polygon("bar-right")   // anchor 1.0

    // ─── Legend labels (fixed, frame-anchored) ─────────────────────────
    const legendLeft   = canvas.text.label("anchor 0.0 — left edge",   "legend-left")
    const legendCenter = canvas.text.label("anchor 0.5 — centre",      "legend-center")
    const legendRight  = canvas.text.label("anchor 1.0 — right edge",  "legend-right")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20,  55, legendLeft)
        Points.move(topLeft, 20,  75, legendCenter)
        Points.move(topLeft, 20,  95, legendRight)
    })

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([posHandle, dirHandle], () => {
        const pin = Pins.placeAndAlignOnSegment(posHandle, dirHandle, 0)

        Bars.fromAnchoredPin(pin, { value: 0.0 }, barWidth, barHeight, true, barLeft as Rectangle)
        Bars.fromAnchoredPin(pin, { value: 0.5 }, barWidth, barHeight, true, barCenter as Rectangle)
        Bars.fromAnchoredPin(pin, { value: 1.0 }, barWidth, barHeight, true, barRight as Rectangle)
    }, true)
}