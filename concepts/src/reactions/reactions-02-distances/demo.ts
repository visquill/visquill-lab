// @name Distances
// @category Reactions
// @group Reactive
import { VisQuill, Reactive, Points, Circles } from "@visquill/visquill-gdk"
import "./styles.css"

/**
 * Three distance measurements, each recomputed by a reaction:
 * point to point, point to segment, point to circle.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-reactions-distances-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // Instructions
    canvas.text.labelAt("Drag the handles to see distances update in real-time", { x: 250, y: 30 }, "instructions")

    // ─── Point to Point ───────────────────────────────────────────────────

    canvas.text.labelAt("Point to Point", { x: 250, y: 100 }, "section-title")

    const pointA = canvas.handles.disk("handle-a", { x: 150, y: 150 })
    const pointB = canvas.handles.disk("handle-b", { x: 350, y: 150 })

    canvas.visuals.segment("connection-line", pointA, pointB)

    const distanceAB = canvas.values.real()
    const labelAB = canvas.text.label("", false, 0, 0, true, "distance-label")

    Reactive.do([pointA, pointB], () => {
        Points.distanceToPoint(pointA, pointB, distanceAB)
        Points.midPoint(pointA, pointB, labelAB)
        labelAB.value = `${distanceAB.value.toFixed(1)} px`
    }, true)

    // ─── Point to Segment ─────────────────────────────────────────────────

    canvas.text.labelAt("Point to Segment", { x: 250, y: 220 }, "section-title")

    const lineStart = canvas.handles.disk("handle-line-start", { x: 100, y: 350 })
    const lineEnd = canvas.handles.disk("handle-line-end", { x: 400, y: 350 })
    canvas.visuals.segment("the-line", lineStart, lineEnd)

    const pointC = canvas.handles.disk("handle-c", { x: 250, y: 250 })

    const closestOnLine = canvas.visuals.point("closest-point")
    canvas.visuals.segment("perpendicular-line", pointC, closestOnLine)

    const distanceToLine = canvas.values.real()
    const labelPerp = canvas.text.label("", false, 0, 0, false, "distance-label")
    const segment = canvas.shapes.segment(lineStart, lineEnd)

    Reactive.do([pointC, lineStart, lineEnd], () => {
        Points.closestPointOnSegment(pointC, segment, closestOnLine)
        Points.distanceToSegment(pointC, segment, distanceToLine)
        Points.midPoint(pointC, closestOnLine, labelPerp)
        labelPerp.value = `${distanceToLine.value.toFixed(1)} px`
    }, true)

    // ─── Point to Circle ──────────────────────────────────────────────────

    canvas.text.labelAt("Point to Circle", { x: 250, y: 450 }, "section-title")

    const circleRadius = canvas.values.real(60)
    const circle = canvas.visuals.circle("the-circle")

    const pointD = canvas.handles.disk("handle-d", { x: 300, y: 500 })
    const circleCenter = canvas.handles.disk("handle-circle-center", { x: 150, y: 550 })

    const closestOnCircle = canvas.visuals.point("circle-edge-point")
    canvas.visuals.segment("circle-line", pointD, closestOnCircle)

    const distanceCircleEdge = canvas.values.real()
    const labelCircle = canvas.text.label("", false, 0, -15, false, "distance-label")

    Reactive.do([pointD, circleCenter, circleRadius], () => {
        Circles.circleAt(circleCenter, circleRadius, circle)
        Circles.closestPoint(circle, pointD, closestOnCircle)
        Circles.distanceTo(circle, pointD, distanceCircleEdge)

        Points.midPoint(pointD, closestOnCircle, labelCircle)
        labelCircle.value = `${distanceCircleEdge.value.toFixed(1)} px`
    }, true)
}