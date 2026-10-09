// @name Sampling & Directions
// @category Geometry
// @group Arcs

import {
    VisQuill, Arcs, Vectors, Circles, Pins, Reactive, Values, Points, Boxes, Segments,
    type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 340
const cy = 280

const baseRadius    = 130
const arrowLen      = 50
const trackHalfW    = 120
const sliderBottomY = 60

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-arcs-sampling-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag handles to reshape the arc · Drag the slider to move along it",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Arc ──────────────────────────────────────────────────────────
    const center = canvas.handles.disk("center-handle", [cx, cy])
    const startH = canvas.handles.disk("angle-handle",  [cx + baseRadius, cy])
    const endH   = canvas.handles.disk("angle-handle",  [cx, cy - baseRadius])

    const ghostCircle = canvas.visuals.circle("ghost-circle")
    const arc         = canvas.visuals.arc("arc")

    Reactive.do([center, startH, endH], () => {
        const r = Points.distanceToPoint(center, startH)
        Circles.circleAt(center, r, ghostCircle)
        Circles.closestPoint(ghostCircle, endH, endH)

        // angles on screen, measured clockwise
        const startDir = Vectors.direction(center, startH)
        const sa = Vectors.angle(startDir, true)
        const sw = Vectors.angleTo(startDir, Vectors.direction(center, endH), true)

        Arcs.arcAt(center, r, sa, sw, arc)
    })

    // ─── Sampled point, direction arrow, normal arrow ─────────────────
    // Everything is derived from a single Arcs.pinAt call.
    // The normal is Pins.rotateLeft on the pin, then Pins.moveForward.
    const dot         = canvas.visuals.circle("sample-dot")
    const dirArrow    = canvas.visuals.segment("direction-arrow")
    const normalArrow = canvas.visuals.segment("normal-arrow")

    const ratio = buildSlider(canvas, rvg, "ratio", 0, 1, 0.25, sliderBottomY)

    Reactive.do([arc, ratio], () => {
        const pin = Arcs.pinAt(arc, ratio)

        Circles.circleAt(pin, 5, dot)

        Points.copy(pin, dirArrow.at(0))
        Pins.getPosition(Pins.moveForward(pin, arrowLen), dirArrow.at(1))

        Points.copy(pin, normalArrow.at(0))
        Pins.getPosition(Pins.moveForward(Pins.rotateLeft(pin), arrowLen), normalArrow.at(1))
    })
}

// ─── Slider ───────────────────────────────────────────────────────────────
function buildSlider(
    canvas:  RvgGroup,
    rvg:     RvgGraphic,
    label:   string,
    min:     number,
    max:     number,
    initial: number,
    yOffset: number
): Real {
    const t      = canvas.values.real((initial - min) / (max - min))
    const value  = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")
    const valLbl = canvas.text.label("", "slider-value")

    Reactive.do([rvg.frame], () => {
        const bottom = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        const center = Points.moveUp(bottom, yOffset)
        Points.moveLeft( center, trackHalfW, track.at(0))
        Points.moveRight(center, trackHalfW, track.at(1))
        Points.moveUp(center, 14, lbl)
        Points.moveDown(center, 20, valLbl)
        Points.placeOnSegment(track.at(0), track.at(1), t, handle)
    })

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    Reactive.do([t], () => {
        Values.lerp(min, max, t, value)
        valLbl.value = value.value.toFixed(2)
    })

    return value
}