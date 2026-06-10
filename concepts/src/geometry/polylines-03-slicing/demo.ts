// @name Slicing
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Polylines,
    type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const polylinePoints: [number, number][] = [
    [ 60, 300],
    [130, 160],
    [200, 380],
    [290, 120],
    [370, 260],
    [440,  80],
    [520, 320],
    [600, 150],
    [680, 340],
    [760, 180],
    [840, 300],
]

const smoothingIterations = 3

// Initial positions of the two slider handles (A < B).
const initialA = 0.25
const initialB = 0.75

const sliderHalfWidth = 150
const sliderBottomOffset = 55

/**
 * Demonstrates polyline slicing methods.
 *
 * Two slider handles A and B define a range along the curve.  Three
 * coloured segments are drawn simultaneously:
 *
 *  - `Polylines.prefix()`  — from the start to A (blue).
 *  - `Polylines.slice()`   — from A to B (orange, the selected region).
 *  - `Polylines.suffix()`  — from B to the end (blue).
 *
 * Info labels in the top-left corner show the current values of A, B,
 * and the length of the slice relative to the full curve.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polyline-slicing-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag A and B to define the slice",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Base polyline (invisible — source for all three segments) ─────
    const polyline = Polylines.smooth(
        canvas.visuals.polyline("polyline-raw", polylinePoints),
        smoothingIterations
    )

    // ─── Three coloured output segments ───────────────────────────────
    // All three are recomputed together whenever A or B changes.
    const segPrefix = canvas.visuals.polyline("seg-prefix")
    const segSlice  = canvas.visuals.polyline("seg-slice")
    const segSuffix = canvas.visuals.polyline("seg-suffix")

    // ─── Slider values ─────────────────────────────────────────────────
    const posA = canvas.values.real(initialA)
    const posB = canvas.values.real(initialB)

    // ─── Top-left info labels ──────────────────────────────────────────
    const labelA      = canvas.text.label("A = 0.25",        "info-label")
    const labelB      = canvas.text.label("B = 0.75",        "info-label")
    const labelLength = canvas.text.label("slice: 50%",      "info-label")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20,  60, labelA)
        Points.move(topLeft, 20,  80, labelB)
        Points.move(topLeft, 20, 100, labelLength)
    })

    // ─── Reactive slicing ──────────────────────────────────────────────
    Reactive.do([posA, posB], () => {
        // Keep A ≤ B so the slice is always valid.
        const a = Math.min(posA.value, posB.value)
        const b = Math.max(posA.value, posB.value)

        Polylines.slicePrefix(polyline, a, segPrefix)
        Polylines.slice(polyline,  a, b, segSlice)
        Polylines.sliceSuffix(polyline, b, segSuffix)

        labelA.value      = `A = ${a.toFixed(2)}`
        labelB.value      = `B = ${b.toFixed(2)}`
        labelLength.value = `slice: ${Math.round((b - a) * 100)}%`
    })

    // ─── Two sliders on a shared track ────────────────────────────────
    buildSlider(canvas, rvg, posA, posB)
}

// ─── Slider helper ────────────────────────────────────────────────────────
/**
 * Two handles on a single track, each writing to its own Real.
 * The handles are free to cross; the reactive block above clamps A ≤ B.
 */
function buildSlider(
    canvas: ReturnType<typeof VisQuill.create>["canvas"],
    rvg:    ReturnType<typeof VisQuill.create>,
    posA:   Real,
    posB:   Real
) {
    const track = canvas.visuals.segment("slider-track")

    Reactive.do([rvg.frame], () => {
        const bottom = Boxes.bottomSide(rvg.frame)
        const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
        Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
        Points.moveRight(mid, sliderHalfWidth, track.at(1))
    })

    const trackLabel = canvas.text.label("Drag A and B along the track", "slider-label")
    Reactive.do([rvg.frame], () => {
        Points.moveUp(Segments.midPoint(track), 18, trackLabel)
    })

    for (const [value, cls] of [[posA, "handle-a"], [posB, "handle-b"]] as const) {
        const handle = canvas.handles.disk(cls)
        Points.placeOnSegment(track.at(0), track.at(1), value, handle)
        Reactive.do([handle], () => {
            Points.closestPointOnSegment(handle, track, handle)
            Points.relativePositionOnSegment(handle, track, value)
        })
    }
}