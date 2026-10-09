// @name Positioned
// @category Geometry
// @group Segments

import {
    VisQuill, Reactive, Values, Segments, Points, Vectors,
    type RvgGroup, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// alongSegment panel
const alongP1: [number, number] = [120, 170]
const alongP2: [number, number] = [600, 170]

// segmentAtPoint panel
const atPointStart: [number, number] = [300, 740]

const trackHalfW = 65

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-segments-positioned-")
    const canvas = rvg.canvas

    canvas.text.labelAt(
        "Drag the handles or sliders to explore the two positioning methods",
        { x: 500, y: 25 },
        "instructions"
    )

    // ─── alongSegment ─────────────────────────────────────────────────
    // Places a result segment along the base segment, offset
    // perpendicularly by `distance`, with optional start/end padding.
    {
        const p1 = canvas.handles.disk("base-endpoint", alongP1)
        const p2 = canvas.handles.disk("base-endpoint", alongP2)
        canvas.visuals.segment("base-segment", p1, p2)

        const result = canvas.visuals.segment("along-result")

        const distance     = buildSlider(canvas, "distance",     0, 80,  30, 130, 310)
        const paddingStart = buildSlider(canvas, "paddingStart", 0, 150, 20, 310, 310)
        const paddingEnd   = buildSlider(canvas, "paddingEnd",   0, 150, 20, 490, 310)
        // left/right side shown by toggling the handle below the sliders
        const sideToggle   = canvas.handles.disk("side-toggle", [310, 360])
        const sideLbl      = canvas.text.label("side: left", "toggle-label")
        Points.moveUp(sideToggle, 14, sideLbl)

        Reactive.do([p1, p2, distance, paddingStart, paddingEnd, sideToggle], () => {
            // Left or right of p1 → p2, from the toggle handle's position
            // (negative cross product = left on screen).
            const leftSide = Vectors.crossProduct(Vectors.direction(p1, p2), Vectors.direction(p1, sideToggle)).value < 0
            sideLbl.value  = `side: ${leftSide ? "left" : "right"}`
            Segments.alongSegment(
                p1, p2,
                leftSide,
                distance.value,
                paddingStart.value,
                paddingEnd.value,
                result
            )
        })

        canvas.text.labelAt("alongSegment(p1, p2, side, distance, paddingStart, paddingEnd)", { x: 370, y: 280 }, "panel-label")
    }

    // ─── segmentAtPoint ───────────────────────────────────────────────
    // Constructs a segment at a given distance from a reference point,
    // oriented along a direction, with a ratio controlling placement.
    {
        const point  = canvas.handles.disk("point-handle", atPointStart)
        const dirPt  = canvas.handles.disk("dir-handle",   [atPointStart[0] + 80, atPointStart[1] - 60])
        canvas.visuals.segment("dir-line", point, dirPt)

        const result = canvas.visuals.segment("at-point-result")
        const distanceLine = canvas.visuals.segment("distance-line")

        const distance = buildSlider(canvas,  "distance", 0,  80, 30, 200, 530)
        const ratio    = buildSlider(canvas,  "ratio",    0,   1, 0.5, 400, 530)
        const sideToggle2 = canvas.handles.disk("side-toggle", [300, 535])
        const sideLbl2    = canvas.text.label("side: left", "toggle-label")
        Points.moveUp(sideToggle2, 14, sideLbl2)

        Reactive.do([point, dirPt, distance, ratio, sideToggle2], () => {
            // UI only: toggle handle left of the point = left side
            const leftSide = sideToggle2.x < point.x
            sideLbl2.value = `side: ${leftSide ? "left" : "right"}`

            Segments.segmentAtPoint(
                point,
                distance.value,
                Vectors.direction(point, dirPt),
                ratio.value,
                leftSide,
                result
            )

            // Show the perpendicular offset line from point to segment
            Points.copy(point, distanceLine.at(0))
            Segments.pointAt(result, ratio.value, distanceLine.at(1))
        })

        canvas.text.labelAt("segmentAtPoint(point, distance, dir, ratio, side)", { x: 370, y: 595 }, "panel-label")
    }
}

// ─── Slider ───────────────────────────────────────────────────────────────
function buildSlider(
    canvas:  RvgGroup,
    label:   string,
    min:     number,
    max:     number,
    initial: number,
    cx:      number,
    cy:      number
): Real {
    const t      = canvas.values.real((initial - min) / (max - min))
    const value  = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")
    const valLbl = canvas.text.label("", "slider-value")

    // Fixed position sliders — these panels have a fixed layout
    Points.moveLeft( { x: cx, y: cy }, trackHalfW, track.at(0))
    Points.moveRight({ x: cx, y: cy }, trackHalfW, track.at(1))
    Points.moveUp(   { x: cx, y: cy }, 14, lbl)
    Points.moveDown( { x: cx, y: cy }, 20, valLbl)
    Points.placeOnSegment(track.at(0), track.at(1), t, handle)

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    Reactive.do([t], () => {
        Values.lerp(min, max, t, value)
        valLbl.value = value.value.toFixed(1)
    })

    return value
}