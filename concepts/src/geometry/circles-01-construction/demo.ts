// @name Construction
// @category Geometry
// @group Circles

import { VisQuill, Circles, Reactive, Points } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const panelCentres: [number, number][] = [
    [165, 200],
    [500, 200],
    [(165+500)/2, 500],
]

const startRadius = 120

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-circles-construction-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── circleAt ─────────────────────────────────────────────────────
    // The simplest construction: a fixed centre and a draggable radius.
    {
        const [cx, cy] = panelCentres[0]

        const center       = canvas.handles.disk("center-handle", [cx, cy])
        const radiusHandle = canvas.handles.disk("radius-handle", [cx + startRadius, cy])

        const circle       = canvas.visuals.circle("circle")
        canvas.visuals.segment("radius-line", center, radiusHandle)
        const label        = canvas.text.label("", "measurement-label")

        Reactive.do([center, radiusHandle], () => {
            const r = Points.distanceToPoint(center, radiusHandle)
            Circles.circleAt(center, r, circle)
            Points.midPoint(center, radiusHandle, label)
            label.value = `r = ${r.value.toFixed(0)}`
        })

        const caption = canvas.text.label("circleAt(center, radius)",  "panel-label")
        Reactive.do([circle],()=>{
            Points.moveDown(Circles.center(circle),Circles.radius(circle).value+20,caption)
        })
    }

    // ─── circle2P ─────────────────────────────────────────────────────
    // Two points define the diameter endpoints.
    {
        const [cx, cy] = panelCentres[1]

        const p1     = canvas.handles.disk("point-handle", [cx - startRadius, cy])
        const p2     = canvas.handles.disk("point-handle", [cx + startRadius, cy])

        const circle = canvas.visuals.circle("circle")
        canvas.visuals.segment("diameter-line", p1, p2)
        const label  = canvas.text.label("", "measurement-label")

        Reactive.do([p1, p2], () => {
            Circles.circle2P(p1, p2, circle)
            Points.midPoint(p1, p2, label)
            const d = Points.distanceToPoint(p1, p2)
            label.value = `d = ${d.value.toFixed(0)}`
        })

        const caption = canvas.text.label("circle2P(p1, p2)",  "panel-label")
        Reactive.do([circle],()=>{
            Points.moveDown(Circles.center(circle),Circles.radius(circle).value+20,caption)
        })
    }

    // ─── circle3P ─────────────────────────────────────────────────────
    // Three points uniquely define a circle — the circumscribed circle.
    // Dragging a point to be collinear with the other two makes the
    // circle degenerate (infinite radius).
    {
        const [cx, cy] = panelCentres[2]

        const p1     = canvas.handles.disk("point-handle", [cx,               cy - startRadius])
        const p2     = canvas.handles.disk("point-handle", [cx + startRadius, cy + startRadius * 0.6])
        const p3     = canvas.handles.disk("point-handle", [cx - startRadius, cy + startRadius * 0.6])
        const circle = canvas.visuals.circle("circle")
        canvas.visuals.segment("triangle-edge", p1, p2)
        canvas.visuals.segment("triangle-edge", p2, p3)
        canvas.visuals.segment("triangle-edge", p3, p1)
        const cLabel = canvas.text.label("", "measurement-label")

        Reactive.do([p1, p2, p3], () => {
            Circles.circle3P(p1, p2, p3, circle)
            Circles.center(circle, cLabel)
            const r = Circles.radius(circle)
            cLabel.value = `r = ${r.value.toFixed(0)}`
        })

        const caption = canvas.text.label("circle3P(p1, p2, p3)",  "panel-label")
        Reactive.do([circle],()=>{
            Points.moveDown(Circles.center(circle),Circles.radius(circle).value+20,caption)
        })
    }
}