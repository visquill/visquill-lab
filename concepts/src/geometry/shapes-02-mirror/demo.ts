// @name Mirror
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points,
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
    const axisLine = canvas.visuals.segment("axis-line")

    // ─── Original shape ───────────────────────────────────────────────
    const original = canvas.visuals.polygon("original")

    // ─── Mirrored shape ───────────────────────────────────────────────
    const mirrored = canvas.visuals.polygon("mirrored")

    // ─── Label for each shape ─────────────────────────────────────────
    const labelOriginal = canvas.text.label("original", "shape-label")
    const labelMirrored = canvas.text.label("mirrored", "shape-label-mirrored")

    // ─── Reactive block ───────────────────────────────────────────────
    Reactive.do([hP1, hP2], () => {
        const baseShape = canvas.shapes.polygon(arrowVertices)

        // Original shape is always the base.
        Shapes.copy(baseShape, original)

        // Mirror across the line p1 → p2.
        const reflected = Shapes.mirror(baseShape, hP1, hP2)
        Shapes.copy(reflected, mirrored)

        // Extend the axis line well beyond the handles for clarity.
        const dx = hP2.x - hP1.x
        const dy = hP2.y - hP1.y
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const ext = 600
        const nx  = dx / len
        const ny  = dy / len
        Points.copy({ x: hP1.x - nx * ext, y: hP1.y - ny * ext }, axisLine.at(0))
        Points.copy({ x: hP2.x + nx * ext, y: hP2.y + ny * ext }, axisLine.at(1))

        // Labels: centroid of each shape.
        const origCentroid = Shapes.centroid(baseShape)
        const reflCentroid = Shapes.centroid(reflected)
        Points.moveDown(origCentroid, 60, labelOriginal)
        Points.moveDown(reflCentroid, 60, labelMirrored)
    }, true)
}