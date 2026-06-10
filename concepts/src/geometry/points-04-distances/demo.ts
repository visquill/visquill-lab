// @name Distance Types
// @category Geometry
// @group Points

import {
    VisQuill, Reactive, Points, Circles, Boxes, Segments
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cols = [200, 500, 800]
const cy   = 280

const seg1Start: [number, number] = [120, 330]
const seg1End:   [number, number] = [280, 230]
const seg2Start: [number, number] = [420, 330]
const seg2End:   [number, number] = [580, 230]

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-distance-types-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    const instructions = canvas.text.label(
        "Drag the blue point — watch how each distance changes",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── distanceToSegment ────────────────────────────────────────────
    {
        const cx = cols[0]

        canvas.visuals.segment("shape-segment", seg1Start, seg1End)
        Circles.circleAt(seg1Start, 5, canvas.visuals.circle("endpoint"))
        Circles.circleAt(seg1End,   5, canvas.visuals.circle("endpoint"))

        const p         = canvas.handles.disk("point-handle", [cx + 20, cy - 60])
        const dot       = canvas.visuals.circle("point-dot")
        const connector = canvas.visuals.segment("connector-segment")
        const lbl       = canvas.text.label("", "distance-label")

        Reactive.do([p], () => {
            const seg     = canvas.shapes.segment(seg1Start, seg1End)
            const closest = Points.closestPointOnSegment(p, seg)
            const dist    = Points.distanceToSegment(p, seg)
            Circles.circleAt(p, 7, dot)
            Points.copy(p,       connector.at(0))
            Points.copy(closest, connector.at(1))
            Points.moveUp(Points.midPoint(p, closest), 5, lbl)
            lbl.value = `${dist.value.toFixed(1)} px`
        })

        canvas.text.labelAt("distanceToSegment", { x: cx, y: cy - 140 }, "panel-label")
        canvas.text.labelAt("clamps to endpoints", { x: cx, y: cy - 124 }, "panel-sub")
    }

    // ─── distanceToLine ───────────────────────────────────────────────
    {
        const cx = cols[1]

        // Extended dashed line shows the infinite extent.
        const extA: [number, number] = [
            seg2Start[0] - (seg2End[0] - seg2Start[0]) * 1.5,
            seg2Start[1] - (seg2End[1] - seg2Start[1]) * 1.5,
        ]
        const extB: [number, number] = [
            seg2End[0] + (seg2End[0] - seg2Start[0]) * 1.5,
            seg2End[1] + (seg2End[1] - seg2Start[1]) * 1.5,
        ]
        canvas.visuals.segment("extended-line", extA, extB)
        canvas.visuals.segment("shape-segment", seg2Start, seg2End)
        Circles.circleAt(seg2Start, 5, canvas.visuals.circle("endpoint"))
        Circles.circleAt(seg2End,   5, canvas.visuals.circle("endpoint"))

        const p         = canvas.handles.disk("point-handle", [cx + 20, cy - 60])
        const dot       = canvas.visuals.circle("point-dot")
        const connector = canvas.visuals.segment("connector-line")
        const lbl       = canvas.text.label("", "distance-label")

        Reactive.do([p], () => {
            const seg     = canvas.shapes.segment(seg2Start, seg2End)
            const closest = Points.closestPointOnLine(p, seg,null)
            const dist    = Points.distanceToLine(p, seg)
            Circles.circleAt(p, 7, dot)
            Points.copy(p,       connector.at(0))
            Points.copy(closest, connector.at(1))
            Points.moveUp(Points.midPoint(p, closest), 5, lbl)
            lbl.value = `${dist.value.toFixed(1)} px`
        })

        canvas.text.labelAt("distanceToLine", { x: cx, y: cy - 140 }, "panel-label")
        canvas.text.labelAt("extends beyond endpoints", { x: cx, y: cy - 124 }, "panel-sub")
    }

    // ─── horizontalDistance & verticalDistance ────────────────────────
    {
        const cx = cols[2]

        const pA    = canvas.handles.disk("point-handle", [cx - 70, cy - 70])
        const pB    = canvas.handles.disk("point-handle", [cx + 60, cy + 50])
        const hLine = canvas.visuals.segment("h-line")
        const vLine = canvas.visuals.segment("v-line")
        const diagLine = canvas.visuals.segment("guide-line")
        const corner = canvas.visuals.circle("corner-dot")
        const hLbl   = canvas.text.label("", "h-label")
        const vLbl   = canvas.text.label("", "v-label")
        const dLbl   = canvas.text.label("", "distance-label")

        Reactive.do([pA, pB], () => {
            const c = { x: pB.x, y: pA.y }
            Points.copy(pA, hLine.at(0))
            Points.copy(c,  hLine.at(1))
            Points.copy(c,  vLine.at(0))
            Points.copy(pB, vLine.at(1))
            Points.copy(pA, diagLine.at(0))
            Points.copy(pB, diagLine.at(1))
            Circles.circleAt(c, 4, corner)

            const hd = Points.horizontalDistance(pA, pB)
            const vd = Points.verticalDistance(pA, pB)
            const ed = Points.distanceToPoint(pA, pB)

            Points.moveUp(Points.midPoint(pA, c), 10, hLbl)
            hLbl.value = `h = ${hd.value.toFixed(1)}`

            Points.moveRight(Points.midPoint(c, pB), 28, vLbl)
            vLbl.value = `v = ${vd.value.toFixed(1)}`

            Points.moveUp(Points.midPoint(pA, pB), 14, dLbl)
            dLbl.value = `d = ${ed.value.toFixed(1)}`
        })

        canvas.text.labelAt("horizontalDistance · verticalDistance", { x: cx, y: cy - 140 }, "panel-label")
    }
}