// @name Interpolation
// @category Geometry
// @group Pins

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins, Circles, type Pin
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const pinAOrigin = [220, 300]
const pinATip    = [280, 240]
const pinBOrigin = [780, 300]
const pinBTip    = [840, 360]

const arrowLength  = 50    // length of all orientation indicators
const dotRadius    = 7
const ghostCount   = 9     // number of ghost pins in the trail
const ghostRadius  = 4

const sliderHalfW  = 180
const sliderBottomY = 60

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-pins-interp-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag origin/tip handles to reshape each pin · Drag the slider to interpolate",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Pin A ────────────────────────────────────────────────────────
    const hAOrigin = canvas.handles.disk("handle-a-origin", pinAOrigin)
    const hATip    = canvas.handles.disk("handle-a-tip",    pinATip)

    const pinA = canvas.values.pin(pinAOrigin)
    Pins.withLength(pinA, arrowLength, pinA)

    Reactive.do([hAOrigin, hATip], () => {
        Pins.placeAt(pinA, hAOrigin, pinA)
        Pins.alignToSegment(pinA, hAOrigin, hATip, pinA)
        Pins.withLength(pinA, arrowLength, pinA)
    })

    buildSourceArrow(canvas, pinA, "arrow-a", [pinA])

    // ─── Pin B ────────────────────────────────────────────────────────
    const hBOrigin = canvas.handles.disk("handle-b-origin", pinBOrigin)
    const hBTip    = canvas.handles.disk("handle-b-tip",    pinBTip)

    const pinB = canvas.values.pin(pinBOrigin)
    Pins.withLength(pinB, arrowLength, pinB)

    Reactive.do([hBOrigin, hBTip], () => {
        Pins.placeAt(pinB, hBOrigin, pinB)
        Pins.alignToSegment(pinB, hBOrigin, hBTip, pinB)
        Pins.withLength(pinB, arrowLength, pinB)
    })

    buildSourceArrow(canvas, pinB, "arrow-b", [pinB])

    // ─── Slider ───────────────────────────────────────────────────────
    const t     = canvas.values.real(0.5)
    const track = canvas.visuals.segment("slider-track")

    Reactive.do([rvg.frame], () => {
        const mid  = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        const base = Points.moveUp(mid, sliderBottomY)
        Points.moveLeft(base,  sliderHalfW, track.at(0))
        Points.moveRight(base, sliderHalfW, track.at(1))
    })

    const sliderLabel = canvas.text.label("t", "slider-label")
    const tValueLabel = canvas.text.label("", "t-value")

    Reactive.do([rvg.frame], () => {
        Points.moveUp(Points.midPoint(track.at(0), track.at(1)), 18, sliderLabel)
        Points.moveDown(Points.midPoint(track.at(0), track.at(1)), 18, tValueLabel)
    })

    const hSlider = canvas.handles.disk("slider-handle")
    Points.placeOnSegment(track.at(0), track.at(1), t, hSlider)

    Reactive.do([hSlider], () => {
        Points.closestPointOnSegment(hSlider, track, hSlider)
        Points.relativePositionOnSegment(hSlider, track, t)
        tValueLabel.value = `t = ${t.value.toFixed(2)}`
    })

    // ─── Ghost trail ──────────────────────────────────────────────────
    // A row of faint pins at evenly spaced t values gives an overview
    // of the full interpolation — both position and orientation blend.
    for (let i = 1; i <= ghostCount; i++) {
        const ghostT   = i / (ghostCount + 1)
        const ghostDot = canvas.visuals.circle("ghost-dot")
        const ghostShaft = canvas.visuals.segment("ghost-shaft")

        Reactive.do([pinA, pinB], () => {
            const p = Pins.interpolate(pinA, pinB, ghostT)
            const tip = Pins.moveForward(p, 1)
            Circles.circleAt(p, ghostRadius, ghostDot)
            Points.copy(p,   ghostShaft.at(0))
            Points.copy(tip, ghostShaft.at(1))
        })
    }

    // ─── Interpolated pin (at slider t) ───────────────────────────────
    const interpDot   = canvas.visuals.circle("interp-dot")
    const interpShaft = canvas.visuals.segment("interp-shaft")
    const interpLabel = canvas.text.label("interpolate(a, b, t)", "interp-label")

    Reactive.do([pinA, pinB, t], () => {
        const p   = Pins.interpolate(pinA, pinB, t)
        const tip = Pins.moveForward(p, 40)
        Circles.circleAt(p, dotRadius, interpDot)
        Points.copy(p,   interpShaft.at(0))
        Points.copy(tip, interpShaft.at(1))
        Points.moveUp(p, 20, interpLabel)
    })
}

// ─── Helper ───────────────────────────────────────────────────────────────
function buildSourceArrow(
    canvas: ReturnType<typeof VisQuill.create>["canvas"],
    pin:    Pin,
    cls:    string,
    deps:   any[]
) {
    const dot   = canvas.visuals.circle(`${cls}-dot`)
    const shaft = canvas.visuals.segment(`${cls}-shaft`)

    Reactive.do(deps, () => {
        const tip = Pins.moveForward(pin, 40)
        Circles.circleAt(pin, 7, dot)
        Points.copy(pin, shaft.at(0))
        Points.copy(tip, shaft.at(1))
    })
}