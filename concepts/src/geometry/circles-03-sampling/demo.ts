// @name Sampling
// @category Geometry
// @group Circles

import {
    VisQuill, Circles, Pins, Reactive, Points, Boxes, Segments,
    type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 340
const cy = 270

const baseRadius    = 130
const arrowLen      = 50
const trackHalfW    = 120
const sliderBottomY = 60

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-circles-sampling-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag handles to reshape the circle · Drag the slider to move along it",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Circle (center + one perimeter handle) ───────────────────────
    // The perimeter handle is also the ratio=0 point — the place where
    // sampling starts — so it does double duty as radius and start marker.
    const center  = canvas.handles.disk("center-handle",   [cx, cy])
    const perimH  = canvas.handles.disk("perimeter-handle", [cx + baseRadius, cy])

    const circle  = canvas.visuals.circle("circle")

    Reactive.do([center, perimH], () => {
        const r = Points.distanceToPoint(center, perimH)
        Circles.circleAt(center, r, circle)
    })

    // ─── Sampled point, direction arrow, normal arrow ─────────────────
    // Everything is derived from a single Circles.pinAt call.
    // The normal is Vectors.rotateLeft applied to the pin's orientation.
    const dot         = canvas.visuals.circle("sample-dot")
    const dirArrow    = canvas.visuals.segment("direction-arrow")
    const normalArrow = canvas.visuals.segment("normal-arrow")
    const cwLabel     = canvas.text.label("", "winding-label")

    const ratio = buildSlider(canvas, rvg, "ratio", 0, 1, 0.25, sliderBottomY)

    Reactive.do([circle, ratio], () => {
        const pin    = Circles.pinAt(circle, ratio)
        const target = Pins.moveForward(pin,arrowLen)


        Circles.circleAt(pin, 5, dot)
        Points.copy(pin, dirArrow.at(0))
        Pins.getPosition(target,dirArrow.at(1))

        Points.copy(pin, normalArrow.at(0))
        Pins.getPosition(Pins.moveForward(Pins.rotateLeft(pin),arrowLen),normalArrow.at(1))

        // Winding direction — changes when you drag the perimeter handle
        // past the center relative to the construction winding order
        const isCW = Circles.isClockwise(circle)
        Points.moveRight(center, 20, cwLabel)
        cwLabel.value = isCW.value ? "CW" : "CCW"
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
        value.value = min + t.value * (max - min)
        valLbl.value = value.value.toFixed(2)
    })

    return value
}