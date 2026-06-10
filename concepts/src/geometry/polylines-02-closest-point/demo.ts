// @name Closest Point
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Circles,
    Polylines
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Same polyline as the Polyline Sampling demo so the two feel like a series.
const polylinePoints: [number, number][] = [
    [ 60, 300],
    [130, 160],
    [200, 380],
    [290, 120],
    [370, 260],
    [440,  80],
    [520, 320],
    [600, 150],
    [680, 340],
    [760, 180],
    [840, 300],
]

const smoothingIterations = 3

// Starting position for the draggable handle.
const handleStart: [number, number] = [400, 450]

/**
 * Demonstrates closest-point projection onto a polyline.
 *
 * Drag the handle anywhere on the canvas.  Three things update:
 *
 *  - `Polylines.closestPoint()`    — a red dot snaps to the nearest point
 *                                    on the curve and a dashed connector
 *                                    joins it to the handle.
 *  - `Polylines.distanceTo()`      — the length of that connector, shown
 *                                    as a label on the connector midpoint.
 *  - `Polylines.closestPosition()` — the normalised t value of the closest
 *                                    point, displayed in the info panel.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polyline-closest-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the handle · watch the closest point update",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Polyline ──────────────────────────────────────────────────────
    canvas.visuals.polyline("polyline-guide", polylinePoints)

    const polyline = canvas.visuals.polyline(
        "polyline-smooth",
        Polylines.smooth(
            canvas.visuals.polyline("polyline-raw", polylinePoints),
            smoothingIterations
        )
    )

    // ─── Draggable handle ──────────────────────────────────────────────
    const handle = canvas.handles.disk("handle", handleStart)

    // ─── Closest-point geometry ────────────────────────────────────────
    // Red dot at the closest point on the curve.
    const closestDot = canvas.values.point()
    const closestDotMarker = canvas.visuals.circle("closest-dot")

    // Dashed connector from the handle to the closest point.
    canvas.visuals.segment("connector", handle, closestDot)

    // Distance label, placed at the midpoint of the connector.
    const distLabel = canvas.text.label("0 px", "dist-label")

    // ─── Top-left info labels ──────────────────────────────────────────
    const labelDist = canvas.text.label("distance: —",  "info-label")
    const labelPos  = canvas.text.label("closest t: —", "info-label")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20, 60, labelDist)
        Points.move(topLeft, 20, 80, labelPos)
    })

    // ─── Reactive projection ───────────────────────────────────────────
    // Recompute whenever the handle moves.
    Reactive.do([handle], () => {
        // 1. Snap the red dot to the nearest point on the curve.
        Polylines.closestPoint(polyline, handle, closestDot)
        Circles.circleAt(closestDot, 6, closestDotMarker)

        // 2. Distance from the handle to the curve.
        const dist = Polylines.distanceTo(polyline, handle)

        // 3. Normalised position of that closest point along the curve.
        const pos = Polylines.closestPosition(polyline, handle)

        // Distance label on the connector midpoint.
        Points.midPoint(handle, closestDot, distLabel)
        distLabel.value = `${Math.round(dist.value)} px`

        // Info labels.
        labelDist.value = `distance: ${Math.round(dist.value)} px`
        labelPos.value  = `closest t: ${pos.value.toFixed(2)}`
    })
}