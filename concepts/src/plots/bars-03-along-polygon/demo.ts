// @name Bars Along Polygon
// @category Plots
// @group Bars

import {
    VisQuill, Reactive, Boxes, Segments, Points, Bars, type Rectangle, type Point,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Regular hexagon — 6 vertices → 6 segments → 6 bars, including the
// closing edge from the last vertex back to the first.
const cx          = 450
const cy          = 255
const radius      = 160
const vertexCount = 6

// First vertex at 12 o'clock (angle −π/2), then clockwise.
const polygonPoints: Point[] = Array.from(
    { length: vertexCount },
    (_, i) => Points.placeOnCircle([cx, cy], radius, (i / vertexCount) * Math.PI * 2 - Math.PI / 2)
)

const values = [55, 80, 45, 90, 60, 75].map(v => ({ value: v }))

/**
 * Demonstrates bars placed along a polygon, one per edge.
 *
 * Each bar is attached to an edge via `Bars.fromSegment`, including the
 * closing edge from the last vertex back to the first.  Dragging any vertex
 * reshapes its two adjacent edges and their bars follow.  The key contrast
 * with the polyline variant: the closing edge always carries a bar.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-bars-polygon-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag vertices to reshape · one bar per edge including the closing edge",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Vertex handles ────────────────────────────────────────────────
    const handles = polygonPoints.map(pos => canvas.handles.disk("vertex", pos))

    // ─── Edge segments (including closing) ────────────────────────────
    for (let i = 0; i < vertexCount; i++)
        canvas.visuals.segment("baseline", handles[i], handles[(i + 1) % vertexCount])

    // ─── Bar visuals — one per edge ────────────────────────────────────
    const barVisuals = Array.from({ length: vertexCount }, () =>
        canvas.visuals.polygon("bar")
    )

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([...handles], () => {
        for (let i = 0; i < vertexCount; i++)
            Bars.fromSegment(handles[i], handles[(i + 1) % vertexCount], values[i], true, barVisuals[i] as Rectangle)
    }, true)
}