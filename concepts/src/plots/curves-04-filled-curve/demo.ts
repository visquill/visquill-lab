// @name Filled Curve
// @category Plots
// @group Curves

import {
    VisQuill, Reactive, Boxes, Segments, Points, Polylines, Curves,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const baselinePoints: [number, number][] = [
    [ 60, 310], [160, 290], [270, 320], [390, 280],
    [490, 305], [600, 270], [700, 300], [800, 275], [880, 295],
]

const smoothingIterations = 2
const valueCount           = 16
const amplitude            = 80

// All-positive values so the filled band always sits on one side.
const values = Array.from({ length: valueCount }, (_, i) => ({
    value: amplitude * (0.3 + 0.7 * Math.abs(Math.sin((i / valueCount) * Math.PI * 2.5))),
}))

/**
 * Demonstrates `Curves.filledAlongPolyline` alongside `Curves.alongPolylineUniform`.
 *
 * The light-orange filled polygon (from `filledAlongPolyline`) is the closed
 * area stitched between the baseline and its offset curve.  The darker orange
 * line (from `alongPolylineUniform`) is the offset curve itself shown on top.
 * Both are drawn simultaneously so the relationship is immediately visible.
 *
 * The baseline is shown in grey; all three layers together read as a
 * standard area chart.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-curves-filled-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Filled area (light) bounded by the baseline and the offset curve (dark)",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Baseline ──────────────────────────────────────────────────────
    const rawBaseline = canvas.visuals.polyline("baseline-raw", baselinePoints)
    const baseline    = canvas.visuals.polyline(
        "baseline",
        Polylines.smooth(rawBaseline, smoothingIterations)
    )

    // ─── Filled area (drawn first, underneath) ─────────────────────────
    const filledArea = canvas.visuals.polygon("filled-area")

    // ─── Curve outline (drawn on top of filled area) ───────────────────
    const curveOutline = canvas.visuals.polyline("curve-outline")

    // ─── Compute once — baseline and values are static ─────────────────
    Curves.filledAlongPolyline(baseline, values, true, filledArea)
    Curves.alongPolylineUniform(baseline, values, true, curveOutline)
}