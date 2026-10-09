// @name Along Polyline
// @category Plots
// @group Curves

import {
    VisQuill, Reactive, Boxes, Segments, Points, Circles, Polylines, Curves, Values,
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
    const baseline = canvas.visuals.polyline(
        "baseline",
        Polylines.smooth(baselinePoints, smoothingIterations)
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

        for (let i = 0; i < valueCount; i++)
            Circles.circleAt(basePins[i], 4, sampleDots[i])

        Curves.alongPolyline(baseline, positions, values, shift, true, curve)

        shiftLabel.value = `shift: ${Math.round(shift.value)} px`
    }, true)

    // ─── Slider ────────────────────────────────────────────────────────
    createSlider(shift)

    function createSlider(value: typeof shift) {
        const track      = canvas.visuals.segment("slider-track")
        const trackLabel = canvas.text.label("Shift", "slider-label")
        const handle     = canvas.handles.disk("slider-handle")
        const ratio      = canvas.values.real(0.5)

        // Track, label and handle follow the frame; the handle keeps its ratio.
        Reactive.do([rvg.frame], () => {
            const bottom = Boxes.bottomSide(rvg.frame)
            const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
            Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
            Points.moveRight(mid, sliderHalfWidth, track.at(1))
            Points.moveUp(mid, 18, trackLabel)
            Segments.pointAt(track, ratio, handle)
        })

        // The middle of the track is no shift; the ends shift by half the
        // baseline length in either direction.
        Reactive.do([handle], () => {
            Points.closestPointOnSegment(handle, track, handle)
            Points.relativePositionOnSegment(handle, track, ratio)
            const half = Polylines.len(baseline).value / 2
            Values.lerp(-half, half, ratio, value)
        })
    }
}