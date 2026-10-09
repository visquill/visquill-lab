// @name Inflate & Scale
// @category Geometry
// @group Circles

import {
    VisQuill, Circles, Reactive, Values, Points, Boxes, Segments,
    type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 500
const cy = 280

const baseRadius = 100

const trackHalfW    = 80
const sliderBottomY = 80
const rowH          = 60

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-circles-inflate-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Blue: inflate (additive) · Orange: scale (multiplicative) · Drag sliders to adjust",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Base circle (fixed) ──────────────────────────────────────────
    const baseCircle = Circles.circleAt([cx, cy], baseRadius, canvas.visuals.circle("base-circle"))
    canvas.text.labelAt(`base r = ${baseRadius}`, { x: cx, y: cy }, "base-label")

    // ─── Inflate ──────────────────────────────────────────────────────
    // inflate(delta) adds `delta` to the radius — same on all sides.
    // Negative values shrink the circle.
    const inflatedCircle = canvas.visuals.circle("inflated-circle")
    const inflateLabel   = canvas.text.label("", "measurement-label")

    const delta = buildSlider(canvas, rvg, "delta", -80, 100, 0, -90, sliderBottomY + rowH)

    Reactive.do([delta], () => {
        Circles.inflate(baseCircle, delta.value, inflatedCircle)
        const ir = Circles.radius(inflatedCircle)
        Points.moveUp({ x: cx, y: cy }, ir.value + 18, inflateLabel)
        inflateLabel.value = `inflate(${delta.value.toFixed(0)})  r = ${ir.value.toFixed(0)}`
    })

    // ─── Scale ────────────────────────────────────────────────────────
    // scale(factor) multiplies the radius — same on all sides.
    // Unlike inflate, the result depends on the current radius.
    const scaledCircle = canvas.visuals.circle("scaled-circle")
    const scaleLabel   = canvas.text.label("", "measurement-label")

    const factor = buildSlider(canvas, rvg, "factor", 0.2, 2.5, 1.0, 90, sliderBottomY + rowH)

    Reactive.do([factor], () => {
        Circles.scale(baseCircle, factor.value, scaledCircle)
        const sr = Circles.radius(scaledCircle)
        Points.moveDown({ x: cx, y: cy }, sr.value + 18, scaleLabel)
        scaleLabel.value = `scale(×${factor.value.toFixed(2)})  r = ${sr.value.toFixed(0)}`
    })

    // ─── Section labels ───────────────────────────────────────────────
    const lblInflate = canvas.text.label("inflate(delta)", "section-label-inflate")
    const lblScale   = canvas.text.label("scale(factor)",  "section-label-scale")

    Reactive.do([rvg.frame], () => {
        const bottom = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        Points.moveLeft( Points.moveUp(bottom, sliderBottomY + rowH * 2 + 12), 90, lblInflate)
        Points.moveRight(Points.moveUp(bottom, sliderBottomY + rowH * 2 + 12), 90, lblScale)
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
    xOffset: number,
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
        const center = xOffset >= 0
            ? Points.moveRight(Points.moveUp(bottom, yOffset), xOffset)
            : Points.moveLeft( Points.moveUp(bottom, yOffset), -xOffset)

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
        valLbl.value = `${value.value.toFixed(2)}`
    })

    return value
}