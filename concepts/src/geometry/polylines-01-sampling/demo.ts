// @name Sampling
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Vectors, Circles,
    Polylines,
    type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Waypoints for the polyline.  Chosen to produce a range of tangent angles
// so every sampling method shows a clearly different result as the slider
// moves across the full curve.
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

// Number of Chaikin corner-cutting passes applied to the raw waypoints.
const smoothingIterations = 3

// Length of the tangent and normal indicator arrows (pixels).
const arrowLength = 50

// Half-width of the slider track.
const sliderHalfWidth = 120

// Vertical offset from the frame bottom to the slider midpoint.
const sliderBottomOffset = 55


/**
 * Demonstrates polyline sampling methods.
 *
 * A smooth curve is generated from a set of waypoints.  A slider controls
 * a ratio t ∈ [0, 1] along the curve.  Three things update as t changes:
 *
 *  - `Polylines.pointAt()`    — a dot at the exact location on the curve.
 *  - `Polylines.directionAt()` — a green arrow along the tangent.
 *  - `Polylines.normalAt()`   — a purple arrow perpendicular to the tangent.
 *
 * Three info labels sit at fixed positions below the curve.  Their text
 * updates reactively with the slider, but their screen position is anchored
 * to the frame so they never jump around with the arrows.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polyline-sampling-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    // Create the label value, then anchor its position reactively using
    // the approved pattern: label first, placement in Reactive.do.
    const instructions = canvas.text.label(
        "Drag the slider to sample the polyline",
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
    // Faint dashed guide showing the original control points…
    canvas.visuals.polyline("polyline-guide", polylinePoints)

    // …and a smooth curve generated from them via Chaikin corner-cutting.
    // This smoothed version is what all sampling methods operate on.
    const polyline = canvas.visuals.polyline(
        "polyline-smooth",
        Polylines.smooth(
            canvas.visuals.polyline("polyline-raw", polylinePoints),
            smoothingIterations
        )
    )

    // ─── Slider value ──────────────────────────────────────────────────
    // One real drives everything: the normalised position along the curve.
    const position = canvas.values.real(0.5)

    // ─── Sampled geometry ──────────────────────────────────────────────
    // Markers updated inside the reactive block below.

    // pointAt — a dot at the sampled location.
    const sampleDot = canvas.visuals.circle("sample-dot")

    // directionAt — unit tangent arrow.
    const dirStart = canvas.values.point()
    const dirEnd   = canvas.values.point()
    canvas.visuals.segment("arrow-direction", dirStart, dirEnd)

    // normalAt — left-hand perpendicular arrow.
    const nrmStart = canvas.values.point()
    const nrmEnd   = canvas.values.point()
    canvas.visuals.segment("arrow-normal", nrmStart, nrmEnd)

    // ─── Fixed info labels ─────────────────────────────────────────────
    // These labels are positioned relative to the frame (bottom row) so
    // they stay put regardless of where the slider handle is.  Their text
    // content updates from the position reactive, not from rvg.frame.
    const labelRatio  = canvas.text.label("t = 0.50",          "info-label")
    const labelDirAng = canvas.text.label("direction:   0°",   "info-label")
    const labelNrmAng = canvas.text.label("normal:     90°",   "info-label")

    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft,  20,  60, labelRatio)
        Points.move(topLeft,  20,  80, labelDirAng)
        Points.move(topLeft,  20, 100, labelNrmAng)
    })

    // ─── Reactive sampling ────────────────────────────────────────────
    // Recompute everything whenever the slider moves.
    Reactive.do([position], () => {
        // Where on the curve is t?
        const pt = Polylines.pointAt(polyline, position)
        Circles.circleAt(pt, 6, sampleDot)

        // Tangent direction at t — unit vector along the curve.
        const dir = Polylines.directionAt(polyline, position)
        Points.copy(pt, dirStart)
        Vectors.add(pt, Vectors.scale(dir, arrowLength), dirEnd)

        // Left-hand normal at t — 90° counter-clockwise from the tangent.
        const nrm = Polylines.normalAt(polyline, position, true)
        Points.copy(pt, nrmStart)
        Vectors.add(pt, Vectors.scale(nrm, arrowLength), nrmEnd)

        // Update the fixed info labels with current angle values.
        // Vectors.angle() returns the angle in radians from the +X axis.
        const ratio  = Math.round(position.value * 100) / 100
        const dirDeg = Math.round(Vectors.angle(dir,false).value * 180 / Math.PI)
        const nrmDeg = Math.round(Vectors.angle(nrm,false).value * 180 / Math.PI)

        labelRatio.value  = `t = ${ratio.toFixed(2)}`
        labelDirAng.value = `direction: ${dirDeg}°`
        labelNrmAng.value = `normal: ${nrmDeg}°`
    })

    // ─── Slider ────────────────────────────────────────────────────────
    buildSlider(canvas, rvg, position)
}

// ─── Slider helper ────────────────────────────────────────────────────────
/**
 * Horizontal draggable slider near the bottom of the frame.
 * The handle's normalised position along the track is written back into
 * `value` via `Points.relativePositionOnSegment`.
 */
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

    const trackLabel = canvas.text.label("Position along curve", "slider-label")
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