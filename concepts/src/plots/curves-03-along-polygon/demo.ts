// @name Along Polygon
// @category Plots
// @group Curves

import {
    VisQuill, Reactive, Boxes, Segments, Points, Circles, Polygons, Curves, Values, type Point,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Regular octagon centred on the canvas — guarantees convexity.
const cx           = 450
const cy           = 250
const radius       = 170
const vertexCount  = 8

// First vertex at 12 o'clock (angle −π/2), then clockwise.
const polygonPoints: Point[] = Array.from(
    { length: vertexCount },
    (_, i) => Points.placeOnCircle([cx, cy], radius, (i / vertexCount) * Math.PI * 2 - Math.PI / 2)
)

const valueCount = 20
const amplitude  = 60
const sliderHalfWidth    = 280
const sliderBottomOffset = 55

// Sine wave data — goes both above and below the baseline.
const values = Array.from({ length: valueCount }, (_, i) => ({
    value: amplitude * Math.sin((i / valueCount) * Math.PI * 4),
}))

/**
 * Demonstrates `Curves.alongPolygon` with explicit sampling positions and shift.
 *
 * The baseline is a convex regular octagon.  Grey dots mark the sampling
 * positions on the boundary; the orange curve connects the offset points.
 * Dragging the slider shifts all positions by a distance in path-length units,
 * wrapping around past vertex 0 — something only possible on a closed baseline.
 *
 * The wrap-around is the key difference from the polyline variant: once the
 * shift exceeds the perimeter the samples loop back to the start, so the
 * curve never runs out of baseline to follow.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-curves-polygon-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the slider to shift sampling positions · they wrap around the polygon",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Baseline polygon ──────────────────────────────────────────────
    const baseline = canvas.visuals.polygon("baseline")
    Polygons.polygon(polygonPoints, baseline)

    // ─── Sample position markers (on the boundary) ─────────────────────
    const sampleDots = Array.from({ length: valueCount }, () =>
        canvas.visuals.circle("sample-dot")
    )

    // ─── Offset curve ──────────────────────────────────────────────────
    const curve = canvas.visuals.polygon("curve")

    // ─── Info labels ───────────────────────────────────────────────────
    const shiftLabel     = canvas.text.label("shift: 0 px",       "info-label")
    const perimeterLabel = canvas.text.label("perimeter: 0 px",   "info-label")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20, 55, shiftLabel)
        Points.move(topLeft, 20, 75, perimeterLabel)
    })

    // ─── Shift value ───────────────────────────────────────────────────
    const shift = canvas.values.real(0)

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([shift], () => {
        const perimeter = Polygons.perimeter(baseline).value
        const spacing   = perimeter / valueCount

        const positions = Array.from({ length: valueCount }, (_, i) => ({
            value: i * spacing,
        }))

        // Sample positions on the boundary for the grey dots — shifted and
        // wrapped around, since this is a closed path.
        const basePins = Polygons.pinsAtDistances(baseline, positions.map(p => ({
            value: p.value + shift.value,
        })), true)

        for (let i = 0; i < valueCount; i++)
            Circles.circleAt(basePins[i], 4, sampleDots[i])

        Curves.alongPolygon(baseline, positions, values, shift, true, curve)

        shiftLabel.value     = `shift: ${Math.round(shift.value)} px`
        perimeterLabel.value = `perimeter: ${Math.round(perimeter)} px`
    }, true)

    // ─── Slider ────────────────────────────────────────────────────────
    createSlider(shift)

    function createSlider(value: typeof shift) {
        const track      = canvas.visuals.segment("slider-track")
        const trackLabel = canvas.text.label("Shift (wraps around)", "slider-label")
        const handle     = canvas.handles.disk("slider-handle")
        const ratio      = canvas.values.real(0)

        // Track, label and handle follow the frame; the handle keeps its ratio.
        Reactive.do([rvg.frame], () => {
            const bottom = Boxes.bottomSide(rvg.frame)
            const mid    = Points.moveUp(Segments.midPoint(bottom), sliderBottomOffset)
            Points.moveLeft(mid,  sliderHalfWidth, track.at(0))
            Points.moveRight(mid, sliderHalfWidth, track.at(1))
            Points.moveUp(mid, 18, trackLabel)
            Segments.pointAt(track, ratio, handle)
        })

        Reactive.do([handle], () => {
            Points.closestPointOnSegment(handle, track, handle)
            Points.relativePositionOnSegment(handle, track, ratio)
            // Map [0, 1] to [0, perimeter] so one full drag = one full lap.
            Values.lerp(0, Polygons.perimeter(baseline), ratio, value)
        })
    }
}