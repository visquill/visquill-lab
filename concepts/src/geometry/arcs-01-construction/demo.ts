// @name Construction
// @category Geometry
// @group Arcs

import { VisQuill, Arcs, Circles, Reactive, Points, Boxes, Segments, Svg } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const panelCentres: [number, number][] = [
    [170, 200],
    [510, 200],
    [170, 510],
    [510, 510],
]

const baseRadius = 110
const buttonW    = 160
const buttonH    = 34

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-arcs-construction-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag handles to reshape each arc",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── arcAt ────────────────────────────────────────────────────────
    // Three handles: center, start, end — all constrained to a circle
    // whose radius is the distance from center to the start handle.
    {
        const [cx, cy] = panelCentres[0]

        const center = canvas.handles.disk("center-handle", [cx, cy])
        const startH = canvas.handles.disk("angle-handle",  [cx + baseRadius, cy])
        const endH   = canvas.handles.disk("angle-handle",
            [cx, cy - baseRadius])

        const ghostCircle = canvas.visuals.circle("ghost-circle")
        const arc         = canvas.visuals.arc("arc")
        const label       = canvas.text.label("", "measurement-label")

        Reactive.do([center, startH, endH], () => {
            // radius = distance from center to start handle
            const r  = Points.distanceToPoint(center, startH)
            Circles.circleAt(center, r, ghostCircle)
            // keep end handle on the perimeter
            Circles.closestPoint(ghostCircle, endH, endH)

            const sa = Math.atan2(startH.y - center.y, startH.x - center.x)
            const ea = Math.atan2(endH.y   - center.y, endH.x   - center.x)
            let sw = ea - sa
            if (sw <= 0) sw += 2 * Math.PI

            Arcs.arcAt(center, r, sa, sw, arc)

            Points.copy(Points.moveDown(center,15), label)
            label.value = `r = ${r.value.toFixed(0)}  sweep = ${(sw * 180 / Math.PI).toFixed(0)}°`
        })

        const caption = canvas.text.label("arcAt(center, r, startAngle, sweepAngle)", "panel-label")
        Reactive.do([arc], () => {
            Points.moveDown(Arcs.center(arc), Arcs.radius(arc).value + 20, caption)
        })
    }

    // ─── arcBetween ───────────────────────────────────────────────────
    // Same three handles as arcAt. The toggle button shows how the same
    // start/end angles produce two different arcs depending on winding.
    {
        const [cx, cy] = panelCentres[1]

        const center = canvas.handles.disk("center-handle", [cx, cy])
        const startH = canvas.handles.disk("angle-handle",  [cx + baseRadius, cy])
        const endH   = canvas.handles.disk("angle-handle",  [cx, cy - baseRadius])

        const ghostCircle = canvas.visuals.circle("ghost-circle")
        const arc         = canvas.visuals.arc("arc")
        const label       = canvas.text.label("", "measurement-label")

        let clockwise = false

        const recompute = () => {
            const r = Points.distanceToPoint(center, startH)
            Circles.circleAt(center, r, ghostCircle)
            Circles.closestPoint(ghostCircle, endH, endH)

            const sa = Math.atan2(startH.y - center.y, startH.x - center.x)
            const ea = Math.atan2(endH.y   - center.y, endH.x   - center.x)

            Arcs.arcBetween(center, r, sa, ea, clockwise, arc)

            Points.copy(Points.moveDown(center,15), label)
            label.value = `r = ${r.value.toFixed(0)}  ${clockwise ? "CW" : "CCW"}`
        }

        Reactive.do([center, startH, endH], recompute)

        // ── Toggle button ─────────────────────────────────────────────
        const btn      = canvas.visuals.box("button-toggle")
        const btnLabel = canvas.text.label("clockwise: false", "button-label")

        Reactive.do([rvg.frame], () => {
            const mid = Points.midPoint(
                Boxes.bottomSide(rvg.frame).at(0),
                Boxes.bottomSide(rvg.frame).at(1)
            )
            const btnCenter = Points.moveUp(Points.moveRight(mid, cx - 500 / 2), 40)
            Boxes.centeredBox(btnCenter, buttonW, buttonH, btn)
            Points.copy(btnCenter, btnLabel)
        })

        Svg.get(btn).addEventListener("click", () => {
            clockwise = !clockwise
            btnLabel.value = `clockwise: ${clockwise}`
            recompute()
        })

        const caption = canvas.text.label("arcBetween(center, r, start, end, clockwise)", "panel-label")
        Reactive.do([arc], () => {
            Points.moveDown(Arcs.center(arc), Arcs.radius(arc).value + 20, caption)
        })
    }

    // ─── arcFromCircle ────────────────────────────────────────────────
    // Start handle doubles as the radius — no separate radius handle.
    // Drag start and end around a visible ghost circle to clip the arc.
    {
        const [cx, cy] = panelCentres[2]

        const startH = canvas.handles.disk("angle-handle", [cx + baseRadius, cy])
        const endH   = canvas.handles.disk("angle-handle", [cx, cy - baseRadius])
        const center = canvas.handles.disk("center-handle", [cx, cy])

        const ghostCircle = canvas.visuals.circle("ghost-circle")
        const arc         = canvas.visuals.arc("arc")
        const label       = canvas.text.label("", "measurement-label")

        Reactive.do([center, startH, endH], () => {
            const r = Points.distanceToPoint(center, startH)
            Circles.circleAt(center, r, ghostCircle)
            Circles.closestPoint(ghostCircle, endH, endH)

            const sa = Math.atan2(startH.y - center.y, startH.x - center.x)
            const ea = Math.atan2(endH.y   - center.y, endH.x   - center.x)
            let sw = ea - sa
            if (sw <= 0) sw += 2 * Math.PI

            Arcs.arcFromCircle(ghostCircle, sa, sw, arc)

            Points.copy(Points.moveDown(center,15), label)
            label.value = `r = ${r.value.toFixed(0)}  sweep = ${(sw * 180 / Math.PI).toFixed(0)}°`
        })

        const caption = canvas.text.label("arcFromCircle(circle, startAngle, sweepAngle)", "panel-label")
        Reactive.do([arc], () => {
            Points.moveDown(Arcs.center(arc), Arcs.radius(arc).value + 20, caption)
        })
    }

    // ─── arcFromSagitta ───────────────────────────────────────────────
    // Chord is kept horizontal so the sagitta is simply sagH.y - mid.y,
    // eliminating all normal-vector math. p1 and p2 move only on x;
    // sagH moves only on y.
    {
        const [cx, cy] = panelCentres[3]

        const p1   = canvas.handles.disk("point-handle",   [cx - baseRadius, cy])
        const p2   = canvas.handles.disk("point-handle",   [cx + baseRadius, cy])
        const sagH = canvas.handles.disk("sagitta-handle", [cx, cy - 60])

        const chord  = canvas.visuals.segment("chord-line")
        const sagSeg = canvas.visuals.segment("sagitta-line")
        const arc    = canvas.visuals.arc("arc")
        const label  = canvas.text.label("", "measurement-label")

        Reactive.do([p1, p2, sagH], () => {
            // Keep chord horizontal: lock y coordinates
            p1.y   = cy
            p2.y   = cy
            // Keep sagitta handle centred on chord midpoint x
            sagH.x = (p1.x + p2.x) / 2

            const midX = sagH.x
            const sag  = sagH.y-cy     // positive = downward = left of p1→p2

            Arcs.arcFromSagitta(p1, p2, sag, arc)

            Points.copy(p1,   chord.at(0))
            Points.copy(p2,   chord.at(1))
            sagSeg.at(0).x = midX ;  sagSeg.at(0).y = cy
            sagSeg.at(1).x = midX ;  sagSeg.at(1).y = sagH.y

            Points.copy(Points.moveDown(Arcs.midPoint(arc),10), label)
            label.value = `sagitta = ${sag.toFixed(0)}`
        })

        const caption = canvas.text.label("arcFromSagitta(start, end, sagitta)", "panel-label")
        Reactive.do([arc], () => {
            Points.moveDown(Segments.midPoint(chord), 20, caption)
        })
    }
}