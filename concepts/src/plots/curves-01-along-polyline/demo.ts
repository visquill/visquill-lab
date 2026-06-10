// @name Along Polyline
// @category Plots
// @group Curves

import {
    VisQuill, Reactive, Boxes, Segments, Points, Circles,  Polylines, Curves,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const baselinePoints: [number, number][] = [
    [ 60, 310], [160, 290], [270, 320], [390, 280],
    [490, 305], [600, 270], [700, 300], [800, 275], [880, 295],
]

const smoothingIterations = 2
const valueCount           = 12
const amplitude            = 70
const sliderHalfWidth      = 300
const sliderBottomOffset   = 55

// Sine wave data — goes both above and below the baseline.
const values = Array.from({ length: valueCount }, (_, i) => ({
    value: amplitude * Math.sin((i / valueCount) * Math.PI * 2),
}))

/**
 * Demonstrates `Curves.alongPolyline` with explicit sampling positions.
 *
 * Grey dots on the baseline mark the sampling positions; the orange curve
 * connects the correspondingly offset points.  Dragging the slider applies
 * a shift to every position, sliding the entire dataset along the baseline.
 * This is the distance-domain equivalent of scrolling a time series.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-curves-polyline-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the slider to shift the sampling positions along the baseline",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Baseline ──────────────────────────────────────────────────────
    const rawBaseline = canvas.visuals.polyline("baseline-raw", baselinePoints)
    const baseline    = canvas.visuals.polyline(
        "baseline",
        Polylines.smooth(rawBaseline, smoothingIterations)
    )

    // ─── Sample position markers (on the baseline) ─────────────────────
    const sampleDots = Array.from({ length: valueCount }, () =>
        canvas.visuals.circle("sample-dot")
    )

    // ─── Offset curve ──────────────────────────────────────────────────
    const curve = canvas.visuals.polyline("curve")

    // ─── Info label ────────────────────────────────────────────────────
    const shiftLabel = canvas.text.label("shift: 0 px", "info-label")
    Reactive.do([rvg.frame], () => {
        Points.move(Boxes.topLeft(rvg.frame), 20, 55, shiftLabel)
    })

    // ─── Shift value ───────────────────────────────────────────────────
    const shift = canvas.values.real(0)

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([shift], () => {
        const totalLength = Polylines.len(baseline).value
        const spacing     = totalLength / valueCount

        const positions = Array.from({ length: valueCount }, (_, i) => ({
            value: i * spacing,
        }))

        // Sample positions on the baseline for the grey dots
        const basePins = Polylines.pinsAtDistances(baseline, positions.map(p => ({
            value: p.value + shift.value,
        })))

        for (let i = 0; i < valueCount; i++) {
            const pin = basePins[i]!
            Circles.circleAt({ x: pin.x, y: pin.y }, 4, sampleDots[i])
        }

        Curves.alongPolyline(baseline, positions, values, shift, true, curve)

        shiftLabel.value = `shift: ${Math.round(shift.value)} px`
    }, true)

    // ─── Slider ────────────────────────────────────────────────────────
    createSlider(shift)

    function createSlider(value: typeof shift) {
        const track = canvas.visuals.segment("slider-track")

        Reactive.do([rvg.frame], () => {
            const bottom = Boxes.bottomSide(rvg.frame)
            const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
            Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
            Points.moveRight(mid, sliderHalfWidth, track.at(1))
        })

        const trackLabel = canvas.text.label("Shift", "slider-label")
        Reactive.do([rvg.frame], () => {
            Points.moveUp(Segments.midPoint(track), 18, trackLabel)
        })

        const handle = canvas.handles.disk("slider-handle")
        Points.placeOnSegment(track.at(0), track.at(1), 0.5, handle)

        Reactive.do([handle], () => {
            Points.closestPointOnSegment(handle, track, handle)
            const ratio = canvas.values.real()
            Points.relativePositionOnSegment(handle, track, ratio)
            const totalLength = Polylines.len(baseline).value
            value.value = (ratio.value - 0.5) * totalLength
        })
    }
}