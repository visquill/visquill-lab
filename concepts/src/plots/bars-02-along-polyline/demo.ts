// @name Bars Along Polyline
// @category Plots
// @group Bars

import {
    VisQuill, Reactive, Boxes, Segments, Points, Bars, type Rectangle,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// 7 vertices → 6 segments → 6 bars.
const pathPoints: [number, number][] = [
    [120, 310], [280, 155], [470, 120], [660, 175],
    [800, 300], [750, 420], [350, 440],
]

const values = [55, 80, 45, 90, 60, 75].map(v => ({ value: v }))

/**
 * Demonstrates bars placed along a polyline, one per segment.
 *
 * Each bar is attached to the segment between two adjacent vertices via
 * `Bars.fromSegment`.  Dragging any vertex reshapes the segment it belongs
 * to and its bar follows.  The path is open — there is no bar on a closing
 * edge because no closing edge exists.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-bars-polyline-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag vertices to reshape · one bar per segment",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Vertex handles ────────────────────────────────────────────────
    const handles = pathPoints.map(pos => canvas.handles.disk("vertex", pos))

    // ─── Connector segments ────────────────────────────────────────────
    for (let i = 0; i < handles.length - 1; i++)
        canvas.visuals.segment("baseline", handles[i], handles[i + 1])

    // ─── Bar visuals — one per segment ─────────────────────────────────
    const barVisuals = Array.from({ length: values.length }, () =>
        canvas.visuals.polygon("bar")
    )

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([...handles], () => {
        for (let i = 0; i < values.length; i++)
            Bars.fromSegment(handles[i], handles[i + 1], values[i], true, barVisuals[i] as Rectangle)
    }, true)
}