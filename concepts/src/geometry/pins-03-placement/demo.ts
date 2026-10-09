// @name Placement & Orientation
// @category Geometry
// @group Pins

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins, Circles, type RvgGroup, type Pin
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const hAPos          = [200, 280]
const hBPos          = [800, 280]
const besideDistance = 60    // perpendicular offset for "beside" variants
const arrowLength    = 30    // length of orientation indicator on each placed pin
const dotRadius      = 6

// lookAt source pin — fixed position in the lower half of the canvas.
const lookAtOrigin   = [500, 480]
const lookAtInitial  = [650, 380]   // initial target handle position

// Slider geometry
const sliderHalfW    = 150
const sliderY        = 80    // distance up from bottom

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-pins-placement-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag endpoints to reshape the segment · Drag the slider to change ratio · Drag the target for lookAt",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Segment ──────────────────────────────────────────────────────
    const hA  = canvas.handles.disk("handle-endpoint", hAPos)
    const hB  = canvas.handles.disk("handle-endpoint", hBPos)

    const segLine = canvas.visuals.segment("segment-line")
    Reactive.do([hA, hB], () => {
        Points.copy(hA, segLine.at(0))
        Points.copy(hB, segLine.at(1))
    })

    // ─── Ratio slider ─────────────────────────────────────────────────
    const ratio = canvas.values.real(0.5)
    const track = canvas.visuals.segment("slider-track")

    Reactive.do([rvg.frame], () => {
        const mid = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        const base = Points.moveUp(mid, sliderY)
        Points.moveLeft(base,  sliderHalfW, track.at(0))
        Points.moveRight(base, sliderHalfW, track.at(1))
    })

    const sliderLabel = canvas.text.label("ratio", "slider-label")
    Reactive.do([rvg.frame], () => {
        Points.moveUp(
            Points.midPoint(track.at(0), track.at(1)),
            18,
            sliderLabel
        )
    })

    const ratioLabel = canvas.text.label("", "ratio-value")
    const hSlider = canvas.handles.disk("slider-handle")
    Points.placeOnSegment(track.at(0), track.at(1), ratio, hSlider)

    Reactive.do([hSlider], () => {
        Points.closestPointOnSegment(hSlider, track, hSlider)
        Points.relativePositionOnSegment(hSlider, track, ratio)
        ratioLabel.value = ratio.value.toFixed(2)
        Points.moveDown(
            Points.midPoint(track.at(0), track.at(1)),
            18,
            ratioLabel
        )
    })

    // ─── Placed pins ──────────────────────────────────────────────────
    // Four variants shown simultaneously.  The "place only" variants
    // keep their initial orientation (pointing right) so the
    // difference from the "place+align" variants is immediately visible.

    // 1. placeOnSegment — position on segment, orientation unchanged
    buildPlacedPin(canvas, "place-on", p => {
        Pins.placeOnSegment(hA, hB, ratio, p)
        Pins.withLength(p, arrowLength, p)
    }, [hA, hB, ratio])

    // 2. placeAndAlignOnSegment — position on segment, oriented along it
    buildPlacedPin(canvas, "align-on", p => {
        Pins.placeAndAlignOnSegment(hA, hB, ratio, p)
        Pins.withLength(p, arrowLength, p)
    }, [hA, hB, ratio])

    // 3. placeBesideSegment — offset from segment, orientation unchanged
    buildPlacedPin(canvas, "place-beside", p => {
        Pins.placeBesideSegment(hA, hB, ratio, besideDistance, true, p)
        Pins.withLength(p, arrowLength, p)
    }, [hA, hB, ratio])

    // 4. placeAndAlignBesideSegment — offset from segment, oriented along it
    buildPlacedPin(canvas, "align-beside", p => {
        Pins.placeAndAlignBesideSegment(hA, hB, ratio, besideDistance, true, p)
        Pins.withLength(p, arrowLength, p)
    }, [hA, hB, ratio])

    // ─── lookAt ───────────────────────────────────────────────────────
    // A fixed-position pin that always faces a draggable target handle.
    const hTarget = canvas.handles.disk("handle-target", lookAtInitial)

    const lookPin = canvas.values.pin(lookAtOrigin)
    Pins.withLength(lookPin, arrowLength, lookPin)

    const lookDot   = canvas.visuals.circle("lookat-dot")
    const lookShaft = canvas.visuals.segment("lookat-shaft")
    const lookLabel = canvas.text.label("lookAt", "lookat-label")

    // Dashed connector from pin to target so the relationship is clear.
    const lookConnector = canvas.visuals.segment("lookat-connector")

    Reactive.do([hTarget], () => {
        Pins.lookAt(lookPin, hTarget, lookPin)
        Pins.withLength(lookPin, arrowLength, lookPin)

        const tip = Pins.moveForward(lookPin, 40)
        Circles.circleAt(lookPin, dotRadius, lookDot)
        Points.copy(lookPin, lookShaft.at(0))
        Points.copy(tip,     lookShaft.at(1))
        Points.copy(lookPin, lookConnector.at(0))
        Points.copy(hTarget, lookConnector.at(1))
        Points.moveDown(lookPin, 18, lookLabel)
    })

    // Target marker
    const targetDot   = canvas.visuals.circle("target-dot")
    const targetLabel = canvas.text.label("target", "target-label")
    Reactive.do([hTarget], () => {
        Circles.circleAt(hTarget, dotRadius, targetDot)
        Points.moveDown(hTarget, 18, targetLabel)
    })
}

// ─── Helper ───────────────────────────────────────────────────────────────
/**
 * Builds a placed-pin visual: a dot at the pin's position and a short
 * shaft showing its orientation.  `update` is called inside a reactive
 * block so the pin recomputes whenever `deps` change.
 */
function buildPlacedPin(
    canvas:  RvgGroup,
    cls:     string,
    update:  (pin: Pin) => void,
    deps:    any[]
) {
    const pin   = canvas.values.pin([0, 0])
    // Initialise with a rightward orientation so "place only" methods
    // (which leave orientation unchanged) have a non-zero vector to
    // work with.  withLength would silently no-op on a zero vector.
    Pins.withOrientation(pin, [1, 0], pin)
    const dot   = canvas.visuals.circle(`${cls}-dot`)
    const shaft = canvas.visuals.segment(`${cls}-shaft`)

    Reactive.do(deps, () => {
        update(pin)
        const tip = Pins.moveForward(pin, 40)
        Circles.circleAt(pin, 6, dot)
        Points.copy(pin, shaft.at(0))
        Points.copy(tip, shaft.at(1))
    })
}