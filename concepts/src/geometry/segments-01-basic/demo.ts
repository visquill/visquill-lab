// @name Basics
// @category Geometry
// @group Segments

import {VisQuill, Reactive, Segments, Points, Boxes, Circles} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const leftPanelX  = 250
const rightPanelX = 750
const panelY      = 300

const trackHalfW    = 70
const sliderBottomY = 70

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-segments-basics-")
    const canvas = rvg.canvas

    // ─── Instructions ─────────────────────────────────────────────────
    canvas.text.labelAt(
        "Left: segment with measurements · Right: directedSegment · Drag any handle",
        { x: 500, y: 25 },
        "instructions"
    )

    canvas.visuals.segment("divider",
        canvas.values.point([500, 50]),
        canvas.values.point([500, 580])
    )

    // ─── Left: segment ────────────────────────────────────────────────
    {
        const p1  = canvas.handles.disk("endpoint", [leftPanelX - 130, panelY - 80])
        const p2  = canvas.handles.disk("endpoint", [leftPanelX + 130, panelY + 80])
        canvas.visuals.segment("segment", p1, p2)

        // Midpoint marker
        const mid    = canvas.visuals.circle("midpoint-marker")
        const midLbl = canvas.text.label("mid", "mid-label")

        // Measurement labels
        const lenLbl  = canvas.text.label("", "measurement-label")
        const hLbl    = canvas.text.label("", "measurement-label")
        const vLbl    = canvas.text.label("", "measurement-label")

        // pointAt marker — driven by slider
        const ratio       = buildSlider(canvas, rvg, "ratio", 0, 1, 0.5, 0, sliderBottomY, leftPanelX)
        const pointMarker = canvas.visuals.circle("point-at-marker")
        const pointLbl    = canvas.text.label("", "point-at-label")

        Reactive.do([p1, p2], () => {
            const s  = Segments.segment(p1, p2)
            const m  = Segments.midPoint(s)
            const l  = Segments.len(s)
            const hl = Segments.horizontalLength(s)
            const vl = Segments.verticalLength(s)

            Circles.circleAt(m, 5, mid)
            Points.moveUp(m, 14, midLbl)

            // Length label above the segment midpoint
            Points.moveUp(m, 28, lenLbl)
            lenLbl.value = `len = ${l.value.toFixed(0)}px`

            // Horizontal component — shown as offset from midpoint
            Points.moveRight(m, 60, hLbl)
            hLbl.value = `h = ${hl.value.toFixed(0)}`

            // Vertical component
            Points.moveLeft(m, 60, vLbl)
            vLbl.value = `v = ${vl.value.toFixed(0)}`
        })

        Reactive.do([p1, p2, ratio], () => {
            const s   = Segments.segment(p1, p2)
            const pt  = Segments.pointAt(s, ratio.value)
            Circles.circleAt(pt, 6, pointMarker)
            Points.moveUp(pt, 16, pointLbl)
            pointLbl.value = `t=${ratio.value.toFixed(2)}`
        })

        canvas.text.labelAt("segment(p1, p2)", { x: leftPanelX, y: 555 }, "panel-label")
    }

    // ─── Right: directedSegment ───────────────────────────────────────
    {
        const origin = canvas.handles.disk("endpoint",  [rightPanelX - 60, panelY])
        const dirPt  = canvas.handles.disk("dir-handle", [rightPanelX + 100, panelY - 80])

        const seg    = canvas.visuals.segment("directed-segment")
        const arrow  = canvas.visuals.circle("dir-arrow-tip")
        canvas.visuals.segment("dir-line", origin, dirPt)

        const lenLbl = canvas.text.label("", "measurement-label")
        const dirLbl = canvas.text.label("", "measurement-label")

        Reactive.do([origin, dirPt], () => {
            // Direction vector from origin to dirPt handle
            const dx = dirPt.x - origin.x
            const dy = dirPt.y - origin.y

            const s   = Segments.directedSegment(origin, { x: dx, y: dy })
            const l   = Segments.len(s)
            const dir = Segments.direction(s)
            const m   = Segments.midPoint(s)

            // Copy computed endpoints to the visual
            Points.copy(s.at(0), seg.at(0))
            Points.copy(s.at(1), seg.at(1))

            Circles.circleAt(s.at(1), 5, arrow)

            Points.moveUp(m, 28, lenLbl)
            lenLbl.value = `len = ${l.value.toFixed(0)}px`

            Points.moveUp(m, 14, dirLbl)
            dirLbl.value = `dir (${dir.x.toFixed(2)}, ${dir.y.toFixed(2)})`
        })

        canvas.text.labelAt("directedSegment(p, dir)", { x: rightPanelX, y: 555 }, "panel-label")
    }
}

// ─── Slider ───────────────────────────────────────────────────────────────
function buildSlider(
    canvas:   any,
    rvg:      any,
    label:    string,
    min:      number,
    max:      number,
    initial:  number,
    xOffset:  number,
    yOffset:  number,
    centerX:  number
): any {
    const t      = canvas.values.real((initial - min) / (max - min))
    const value  = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")
    const valLbl = canvas.text.label("", "slider-value")

    Reactive.do([rvg.frame], () => {
        const bottom = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        const center = { x: centerX + xOffset, y: bottom.y - yOffset }
        Points.moveLeft( center, trackHalfW, track.at(0))
        Points.moveRight(center, trackHalfW, track.at(1))
        Points.moveUp(center, 14, lbl)
        Points.moveDown(center, 20, valLbl)
        Points.placeOnSegment(track.at(0), track.at(1), t, handle)
    })

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    Reactive.do([t], () => {
        value.value = min + t.value * (max - min)
        valLbl.value = value.value.toFixed(2)
    })

    return value
}