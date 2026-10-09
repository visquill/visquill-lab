// @name Batch Sampling
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins, Values,
    Circles, Polylines,
    type Real, type RvgGraphic, type RvgGroup
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const polylinePoints: [number, number][] = [
    [ 60, 300],
    [130, 160],
    [220, 380],
    [310, 120],
    [400, 280],
    [480,  90],
    [560, 320],
    [650, 170],
    [740, 340],
    [820, 200],
    [880, 310],
]

const smoothingIterations = 3
const arrowLength         = 36
const maxSamples          = 20
const sliderHalfWidth     = 100
const sliderBottomOffset  = 55

/**
 * Demonstrates batch polyline sampling via `PinsAt`.
 *
 * A slider controls N (3–20).  At each step, `PinsAt` computes N evenly
 * spaced pins along the smooth curve in a single walk.  Each pin is
 * rendered as an orange dot with a green tangent arrow, so the orientation
 * consistency across all samples is immediately visible.
 *
 * Increasing N densifies the samples without changing their positions
 * relative to the curve — the batch nature means all N results share a
 * single edge walk regardless of how large N gets.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-polyline-batch-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the slider to change the number of samples",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Polyline ──────────────────────────────────────────────────────
    canvas.visuals.polyline("polyline-guide", polylinePoints)

    const polyline = canvas.visuals.polyline(
        "polyline-smooth",
        Polylines.smooth(polylinePoints, smoothingIterations)
    )

    // ─── Pre-allocate sample markers ───────────────────────────────────
    // All maxSamples slots are created up front; unused ones are hidden
    // by setting their radius / stroke to none in CSS and toggling
    // visibility via opacity in the reactive block.
    const dots:       ReturnType<typeof canvas.visuals.circle>[]  = []
    const arrowSegs:  ReturnType<typeof canvas.visuals.segment>[] = []
    const arrowStarts = Array.from({ length: maxSamples }, () => canvas.values.point())
    const arrowEnds   = Array.from({ length: maxSamples }, () => canvas.values.point())

    for (let i = 0; i < maxSamples; i++) {
        dots.push(canvas.visuals.circle("sample-dot"))
        arrowSegs.push(canvas.visuals.segment("arrow-tangent", arrowStarts[i], arrowEnds[i]))
    }

    // ─── Count value and label ─────────────────────────────────────────
    const countVal  = canvas.values.real(8)
    const countLabel = canvas.text.label("N = 8", "count-label")

    Reactive.do([rvg.frame], () => {
        Points.move(Boxes.topLeft(rvg.frame), 20, 55, countLabel)
    })

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([countVal], () => {
        const n       = Math.round(countVal.value)
        const ratios  = Array.from({ length: n }, (_, i) => ({value: i / (n - 1)}))
        // Evenly spaced ratios from 0 to 1, sampled in one walk
        const pins = Polylines.pinsAt(polyline, ratios)

        for (let i = 0; i < maxSamples; i++) {
            if (i < n) {
                const pin = pins[i]!
                Circles.circleAt(pin, 5, dots[i])
                Points.copy(pin, arrowStarts[i])
                Pins.getPosition(Pins.moveForward(pin, arrowLength), arrowEnds[i])

                dots[i].visible.value = true
                arrowSegs[i].visible.value = true
            } else {
                dots[i].visible.value = false
                arrowSegs[i].visible.value = false
            }
        }

        countLabel.value = `N = ${n}`
    }, true)

    // ─── Slider ────────────────────────────────────────────────────────
    buildSlider(canvas, rvg, countVal, 3, maxSamples)
}

function buildSlider(
    canvas:   RvgGroup  ,
    rvg:      RvgGraphic,
    value:    Real,
    min:      number,
    max:      number,
) {
    const track = canvas.visuals.segment("slider-track")

    Reactive.do([rvg.frame], () => {
        const bottom = Boxes.bottomSide(rvg.frame)
        const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
        Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
        Points.moveRight(mid, sliderHalfWidth, track.at(1))
    })

    const trackLabel = canvas.text.label("Number of samples", "slider-label")
    Reactive.do([rvg.frame], () => {
        Points.moveUp(Segments.midPoint(track), 18, trackLabel)
    })

    const handle = canvas.handles.disk("slider-handle")
    Points.placeOnSegment(track.at(0), track.at(1), (value.value - min) / (max - min), handle)

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        const t = Points.relativePositionOnSegment(handle, track)
        value.value = Math.round(Values.lerp(min, max, t).value)
    })
}