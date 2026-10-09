// @name Mirror
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points, Polylines,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 300
const cy = 300

// Asymmetric arrow shape, same proportions as the orientate demo.
const arrowVertices: [number, number][] = [
    [  80,   0 ],
    [  10,  40 ],
    [  10,  18 ],
    [ -60,  18 ],
    [ -60, -28 ],
    [  10, -28 ],
    [  10, -40 ],
].map(([x, y]) => [cx + x, cy + y])

// Two points that define the initial reflection axis — a vertical line.
const axisP1Start: [number, number] = [530, 120]
const axisP2Start: [number, number] = [530, 480]

/**
 * Demonstrates `Shapes.mirror()` — reflecting a shape across the
 * infinite line defined by two draggable points.
 *
 * The original shape is shown on the left.  A mirrored copy appears on
 * the other side of the axis.  Drag either axis handle to rotate or
 * translate the reflection axis and watch both shapes update.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-shapes-mirror-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the axis handles to rotate or reposition the reflection axis",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Axis handles ─────────────────────────────────────────────────
    const hP1 = canvas.handles.disk("handle-axis", axisP1Start)
    const hP2 = canvas.handles.disk("handle-axis", axisP2Start)

    // ─── Axis line ────────────────────────────────────────────────────
    // Extended visual line through the two handle points.
    const axisLine = canvas.visuals.polyline("axis-line")

    // ─── Original shape ───────────────────────────────────────────────
    const original = canvas.visuals.polygon("original", arrowVertices)

    // ─── Mirrored shape ───────────────────────────────────────────────
    const mirrored = canvas.visuals.polygon("mirrored")

    // ─── Label for each shape ─────────────────────────────────────────
    const labelOriginal = canvas.text.label("original", "shape-label")
    const labelMirrored = canvas.text.label("mirrored", "shape-label-mirrored")

    // ─── Reactive block ───────────────────────────────────────────────
    Reactive.do([hP1, hP2], () => {
        // Mirror across the line p1 → p2.
        Shapes.mirror(original, hP1, hP2, mirrored)

        // Extend the axis line 80 px beyond both handles for clarity.
        Polylines.extend([hP1, hP2], 80, 80, axisLine)

        // Labels below the centroid of each shape.
        Points.moveDown(Shapes.centroid(original), 60, labelOriginal)
        Points.moveDown(Shapes.centroid(mirrored), 60, labelMirrored)
    }, true)
}