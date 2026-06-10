// @name Smoothing
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Polylines,
    type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Draggable control points — fewer than previous demos so the corner-cutting
// effect is clearly visible at low iteration counts.
const initialPoints: [number, number][] = [
    [ 80, 350],
    [180, 120],
    [300, 400],
    [420, 100],
    [540, 380],
    [660, 140],
    [820, 350],
]

// Iteration counts to display, one curve each.
const iterationLevels = [0, 1, 2, 4, 8]

const sliderHalfWidth = 100
const sliderBottomOffset = 55

/**
 * Demonstrates `Polylines.smooth()` — Chaikin corner-cutting.
 *
 * Seven draggable handles define a coarse polyline.  Five overlaid curves
 * show the same polyline smoothed at 0, 1, 2, 4, and 8 iterations,
 * fading from dark (few passes) to light (many passes).  Drag any handle
 * and all five curves update instantly.
 *
 * A slider at the bottom controls a single "highlight" iteration level
 * so the user can isolate and inspect one curve at a time.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polyline-smoothing-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag handles · slide to highlight an iteration level",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Draggable control-point handles ──────────────────────────────
    const handles = initialPoints.map((pt) =>
        canvas.handles.disk("handle", pt)
    )

    // ─── One smoothed polyline per iteration level ─────────────────────
    // Each is a reactive polyline visual updated whenever any handle moves.
    const curves = iterationLevels.map(n =>
        canvas.visuals.polyline(`curve-${n}`)
    )

    // ─── Top-left info labels ──────────────────────────────────────────
    const labelIter    = canvas.text.label("highlight: 0 iterations", "info-label")
    const labelVertices = canvas.text.label("vertices: —",             "info-label")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20, 60, labelIter)
        Points.move(topLeft, 20, 80, labelVertices)
    })

    // ─── Highlight slider (0–4 selecting into iterationLevels) ────────
    const highlight = canvas.values.real(0)

    // ─── Reactive smoothing ────────────────────────────────────────────
    // Rebuild all curves whenever any handle moves.
    Reactive.do(handles, () => {
        const raw = Polylines.polyline(handles)

        iterationLevels.forEach((n, i) => {
            Polylines.smooth(raw, n, curves[i])
        })
    })

    // Update info labels and visual highlight when the slider changes.
    Reactive.do([highlight], () => {
        const idx  = Math.round(highlight.value * (iterationLevels.length - 2))+1
        const n    = iterationLevels[idx]
        const verts = Math.pow(2, n) * (initialPoints.length - 1) + 1

        labelIter.value     = `highlight: ${n} iteration${n === 1 ? "" : "s"}`
        labelVertices.value = `vertices: ~${verts}`

        // Raise z-index of the highlighted curve, dim the rest.
        iterationLevels.forEach((_, i) => {
            curves[i].visible.value = i === idx || i == 0
        })
    })

    // ─── Slider ────────────────────────────────────────────────────────
    buildSlider(canvas, rvg, highlight)
}

function buildSlider(
    canvas: ReturnType<typeof VisQuill.create>["canvas"],
    rvg:    ReturnType<typeof VisQuill.create>,
    value:  Real
) {
    const track = canvas.visuals.segment("slider-track")

    Reactive.do([rvg.frame], () => {
        const bottom = Boxes.bottomSide(rvg.frame)
        const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
        Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
        Points.moveRight(mid, sliderHalfWidth, track.at(1))
    })

    const trackLabel = canvas.text.label("Smoothing iterations", "slider-label")
    Reactive.do([rvg.frame], () => {
        Points.moveUp(Segments.midPoint(track), 18, trackLabel)
    })

    const handle = canvas.handles.disk("slider-handle")
    Points.placeOnSegment(track.at(0), track.at(1), value, handle)

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, value)
    })
}