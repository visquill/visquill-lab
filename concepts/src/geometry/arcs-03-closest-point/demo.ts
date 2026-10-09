// @name Closest Point
// @category Geometry
// @group Arcs

import {
    VisQuill, Arcs, Vectors, Circles, Reactive, Points, Boxes, Segments,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 340
const cy = 270

const baseRadius = 130

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-arcs-closest-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the arc handles to reshape · Drag the query point anywhere",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Arc ──────────────────────────────────────────────────────────
    const center = canvas.handles.disk("center-handle", [cx, cy])
    const startH = canvas.handles.disk("angle-handle",  [cx + baseRadius, cy])
    const endH   = canvas.handles.disk("angle-handle",  [cx, cy - baseRadius])

    const ghostCircle = canvas.visuals.circle("ghost-circle")
    const arc         = canvas.visuals.arc("arc")

    Reactive.do([center, startH, endH], () => {
        const r = Points.distanceToPoint(center, startH)
        Circles.circleAt(center, r, ghostCircle)
        Circles.closestPoint(ghostCircle, endH, endH)

        // angles on screen, measured clockwise
        const startDir = Vectors.direction(center, startH)
        const sa = Vectors.angle(startDir, true)
        const sw = Vectors.angleTo(startDir, Vectors.direction(center, endH), true)

        Arcs.arcAt(center, r, sa, sw, arc)
    })

    // ─── Query point ──────────────────────────────────────────────────
    const query = canvas.handles.disk("query-handle", [cx + 200, cy - 60])

    // ─── Closest point + connector ────────────────────────────────────
    const closestDot = canvas.visuals.circle("closest-dot")
    const connector  = canvas.visuals.segment("connector")
    const distLabel  = canvas.text.label("", "measurement-label")

    Reactive.do([arc, query], () => {
        const closest = Arcs.closestPoint(arc, query)
        const dist    = Arcs.distanceTo(arc, query)

        Circles.circleAt(closest, 5, closestDot)

        Points.copy(query,   connector.at(0))
        Points.copy(closest, connector.at(1))

        // Place distance label at the midpoint of the connector
        const mid = Points.midPoint(connector.at(0), connector.at(1))
        Points.moveLeft(mid, 24, distLabel)
        distLabel.value = `d = ${dist.value.toFixed(0)}`
    })
}