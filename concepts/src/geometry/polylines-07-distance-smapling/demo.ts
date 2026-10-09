// @name Distance Sampling
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins,
    Circles, Polylines,
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
const sampleCount         = 10
const sliderHalfWidth     = 340
const sliderBottomOffset  = 55

/**
 * Demonstrates distance-based batch sampling via `PinsAtDistances`.
 *
 * Two handles on a ruler at the bottom define a start and end distance
 * along the polyline.  `PinsAtDistances` samples `sampleCount` evenly
 * spaced distances within that range, walking the curve once regardless
 * of how many samples are requested.
 *
 * The highlighted section of the curve and the sample dots update as the
 * handles move, making it clear that distances are in path-length units
 * (pixels along the curve), not proportional ratios.  The labels show
 * the actual start/end distances and the total polyline length for reference.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-polyline-distance-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the handles to define a distance range along the curve",
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

    const polyline    = canvas.visuals.polyline(
        "polyline-smooth",
        Polylines.smooth(polylinePoints, smoothingIterations)
    )

    // ─── Highlighted sub-section ───────────────────────────────────────
    // A second polyline drawn on top of the main one, showing the active
    // range between the two distance handles.
    const highlight = canvas.visuals.polyline("polyline-highlight")

    // ─── Pre-allocate sample markers ───────────────────────────────────
    const dots        = Array.from({ length: sampleCount }, () => canvas.visuals.circle("sample-dot"))
    const arrowStarts = Array.from({ length: sampleCount }, () => canvas.values.point())
    const arrowEnds   = Array.from({ length: sampleCount }, () => canvas.values.point())
    Array.from({ length: sampleCount }, (_, i) =>
        canvas.visuals.segment("arrow-tangent", arrowStarts[i], arrowEnds[i])
    )

    // ─── Info labels ──────────────────────────────────────────────────
    const labelStart  = canvas.text.label("start:  0 px",    "info-label")
    const labelEnd    = canvas.text.label("end:    0 px",    "info-label")
    const labelLength = canvas.text.label("length: 0 px",    "info-label")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20,  55, labelStart)
        Points.move(topLeft, 20,  75, labelEnd)
        Points.move(topLeft, 20,  95, labelLength)
    })

    // ─── Slider track ─────────────────────────────────────────────────
    const {ratioA,ratioB} = createSlider()

    // ─── Reactive sampling ─────────────────────────────────────────────
    Reactive.do([ratioA, ratioB], () => {
        const totalLength = Polylines.len(polyline).value

        const rA = Math.min(ratioA.value, ratioB.value)
        const rB = Math.max(ratioA.value, ratioB.value)

        const distA = rA * totalLength
        const distB = rB * totalLength

        // Build sorted distances within the range
        const distances = Array.from({ length: sampleCount }, (_, i) =>
            ( {value: distA + (distB - distA) * (i / (sampleCount - 1))}))


        const pins = Polylines.pinsAtDistances(polyline, distances)

        for (let i = 0; i < sampleCount; i++) {
            const pin = pins[i]!
            Circles.circleAt(pin, 5, dots[i])
            Points.copy(pin, arrowStarts[i])
            Pins.getPosition(Pins.moveForward(pin, arrowLength), arrowEnds[i])
        }

        // Update the highlighted sub-section of the polyline
        Polylines.slice(polyline, rA, rB, highlight)

        // Update info labels
        labelStart.value  = `start:  ${Math.round(distA)} px`
        labelEnd.value    = `end:    ${Math.round(distB)} px`
        labelLength.value = `length: ${Math.round(totalLength)} px`
    }, true)

    function createSlider(){
        const track = canvas.visuals.segment("slider-track")

        Reactive.do([rvg.frame], () => {
            const bottom = Boxes.bottomSide(rvg.frame)
            const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
            Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
            Points.moveRight(mid, sliderHalfWidth, track.at(1))
        })

        const trackLabel = canvas.text.label("Distance range", "slider-label")
        Reactive.do([rvg.frame], () => {
            Points.moveUp(Segments.midPoint(track), 18, trackLabel)
        })

        // ─── Two handles on the track ──────────────────────────────────────
        const handleA = canvas.handles.disk("slider-handle-a")
        const handleB = canvas.handles.disk("slider-handle-b")

        // Start handles at 0.2 and 0.7 of the track
        Points.placeOnSegment(track.at(0), track.at(1), 0.2, handleA)
        Points.placeOnSegment(track.at(0), track.at(1), 0.7, handleB)

        const ratioA = canvas.values.real(0.2)
        const ratioB = canvas.values.real(0.7)

        Reactive.do([handleA], () => {
            Points.closestPointOnSegment(handleA, track, handleA)
            Points.relativePositionOnSegment(handleA, track, ratioA)
        })

        Reactive.do([handleB], () => {
            Points.closestPointOnSegment(handleB, track, handleB)
            Points.relativePositionOnSegment(handleB, track, ratioB)
        })
        return {ratioA,ratioB}
    }
}