// @name Along Circle
// @category Plots
// @group Curves

import {
    VisQuill, Reactive, Boxes, Segments, Points, Circles, Curves,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx     = 450
const cy     = 250
const radius = 150

// Fixed radar-like values — irregular so the shape reads as real data.
const rawValues = [55, 90, 40, 75, 60, 95, 30, 80, 50, 70, 85, 45]
const values    = rawValues.map(v => ({ value: v }))

/**
 * Demonstrates `Curves.filledAlongCircle` and `Curves.alongCircleUniform`.
 *
 * A fixed circle serves as the baseline for a polar (radar) chart.
 * The light-blue filled area is produced by `filledAlongCircle`; the dark
 * outline on top by `alongCircleUniform`.  A handle on the circle perimeter
 * controls `angleOffset`, rotating the entire chart.  Dragging it shows how
 * the same dataset looks at different angular orientations.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-curves-circle-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the handle on the circle to rotate the chart",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Circle baseline ───────────────────────────────────────────────
    const circleVisual = canvas.visuals.circle("baseline-circle")
    const circle       = canvas.shapes.circle()
    Circles.circleAt({ x: cx, y: cy }, { value: radius }, circle)
    Circles.circleAt({ x: cx, y: cy }, { value: radius }, circleVisual)

    // ─── Filled area + outline ─────────────────────────────────────────
    const filledArea   = canvas.visuals.polygon("filled-area")
    const curveOutline = canvas.visuals.polygon("curve-outline")

    // ─── Angle offset value ────────────────────────────────────────────
    const angleOffset = canvas.values.real(0)

    // ─── Rotation handle — starts at 3 o'clock (angle = 0) ───────────
    const rotHandle = canvas.handles.disk("rot-handle", [cx + radius, cy])

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([rotHandle], () => {
        // Snap handle to circle perimeter
        const dx  = rotHandle.x - cx
        const dy  = rotHandle.y - cy
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len > 0) {
            Points.move({ x: cx, y: cy }, (dx / len) * radius, (dy / len) * radius, rotHandle)
            angleOffset.value = Math.atan2(dy, dx)
        }

        Curves.filledAlongCircle(circle, values, angleOffset, true, filledArea)
        Curves.alongCircleUniform(circle, values, angleOffset, true, curveOutline)
    }, true)
}