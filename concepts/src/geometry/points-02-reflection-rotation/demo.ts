// @name Reflection & Rotation
// @category Geometry
// @group Points

import {
    VisQuill, Reactive, Values, Points, Circles, Boxes, Segments,
    type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cols = [200, 500, 800]
const cy   = 280

const trackHalfW = 70
const sliderY    = 80

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-points-reflect-")
    const canvas = rvg.canvas

    const instructions = canvas.text.label(
        "Drag the blue handles · Drag the slider to rotate",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── reflect ──────────────────────────────────────────────────────
    {
        const cx = cols[0]

        const source    = canvas.handles.disk("source-handle", [cx - 60, cy - 60])
        const pivot     = canvas.handles.disk("pivot-handle",  [cx,      cy])
        const result    = canvas.visuals.circle("result-dot")
        const line      = canvas.visuals.segment("guide-line")
        const pivotMark = canvas.visuals.circle("pivot-mark")

        const lblSource = canvas.text.label("source", "point-label")
        const lblPivot  = canvas.text.label("pivot",  "point-label")
        const lblResult = canvas.text.label("result", "result-label")

        Reactive.do([source, pivot], () => {
            const r = Points.reflect(source, pivot)
            Circles.circleAt(r, 8, result)
            Points.copy(source, line.at(0))
            Points.copy(r,      line.at(1))
            Circles.circleAt(pivot, 5, pivotMark)
            Points.moveUp(source, 16, lblSource)
            Points.moveUp(pivot,  16, lblPivot)
            Points.moveUp(r,      16, lblResult)
        })

        canvas.text.labelAt("reflect(point, pivot)", { x: cx, y: cy - 140 }, "panel-label")
    }

    // ─── reflectOverLine ──────────────────────────────────────────────
    {
        const cx = cols[1]

        const source = canvas.handles.disk("source-handle", [cx - 70, cy - 50])
        const lineA  = canvas.handles.disk("line-handle",   [cx - 50, cy + 70])
        const lineB  = canvas.handles.disk("line-handle",   [cx + 60, cy - 70])
        const result = canvas.visuals.circle("result-dot")
        const mirror = canvas.visuals.segment("mirror-line")
        const perp   = canvas.visuals.segment("guide-line")

        const lblSource = canvas.text.label("source", "point-label")
        const lblLineA  = canvas.text.label("line A", "point-label")
        const lblLineB  = canvas.text.label("line B", "point-label")
        const lblResult = canvas.text.label("result", "result-label")

        Reactive.do([source, lineA, lineB], () => {
            Segments.segment(lineA, lineB, mirror)
            const r = Points.reflectOverLine(source, mirror)
            Circles.circleAt(r, 8, result)
            Points.copy(source, perp.at(0))
            Points.copy(r,      perp.at(1))
            Points.moveUp(source, 16, lblSource)
            Points.moveUp(lineA,  16, lblLineA)
            Points.moveUp(lineB,  16, lblLineB)
            Points.moveUp(r,      16, lblResult)
        })

        canvas.text.labelAt("reflectOverLine(point, line)", { x: cx, y: cy - 140 }, "panel-label")
    }

    // ─── rotateAround ─────────────────────────────────────────────────
    {
        const cx = cols[2]

        const source    = canvas.handles.disk("source-handle", [cx - 80, cy])
        const pivot     = canvas.handles.disk("pivot-handle",  [cx,      cy])
        const result    = canvas.visuals.circle("result-dot")
        const radA      = canvas.visuals.segment("guide-line")
        const radB      = canvas.visuals.segment("guide-line")
        const pivotMark = canvas.visuals.circle("pivot-mark")

        const lblSource = canvas.text.label("source", "point-label")
        const lblPivot  = canvas.text.label("pivot",  "point-label")
        const lblResult = canvas.text.label("result", "result-label")

        const angle = buildSlider(canvas, rvg, "angle  0 → 2π", 0, Math.PI * 2, Math.PI * 0.75, cx, sliderY)

        Reactive.do([source, pivot, angle], () => {
            const r = Points.rotateAround(source, pivot, angle.value)
            Circles.circleAt(r, 8, result)
            Points.copy(pivot,  radA.at(0))
            Points.copy(source, radA.at(1))
            Points.copy(pivot,  radB.at(0))
            Points.copy(r,      radB.at(1))
            Circles.circleAt(pivot, 5, pivotMark)
            Points.moveUp(source, 16, lblSource)
            Points.moveUp(pivot,  16, lblPivot)
            Points.moveUp(r,      16, lblResult)
        })

        canvas.text.labelAt("rotateAround(point, pivot, angle)", { x: cx, y: cy - 140 }, "panel-label")
    }
}

// ─── Slider ───────────────────────────────────────────────────────────────
function buildSlider(
    canvas:  RvgGroup,
    rvg:     RvgGraphic,
    label:   string,
    min:     number,
    max:     number,
    initial: number,
    cx:      number,
    yOffset: number
): Real {
    const t      = canvas.values.real((initial - min) / (max - min))
    const value  = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")

    Reactive.do([rvg.frame], () => {
        const bottom = Segments.midPoint(Boxes.bottomSide(rvg.frame))
        const center = Points.move(bottom, cx - 500, -yOffset)
        Points.moveLeft( center, trackHalfW, track.at(0))
        Points.moveRight(center, trackHalfW, track.at(1))
        Points.moveUp(center, 14, lbl)
        Points.placeOnSegment(track.at(0), track.at(1), t, handle)
    })

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    Reactive.do([t], () => {
        Values.lerp(min, max, t, value)
    })

    return value
}