// @name Accessors
// @category Geometry
// @group Rectangles

import {
    VisQuill, Reactive, Values, Rectangles, Points,
    type RvgGroup, type Real, Circles, Pins, Segments
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 280
const cy = 270

const trackHalfW = 65
const sliderBaseY = 460
const rowH        = 52

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-rect-accessors-")
    const canvas = rvg.canvas

    canvas.text.labelAt(
        "Drag the pin or sliders · Corners, sides and measurements update reactively",
        { x: 500, y: 25 },
        "instructions"
    )

    canvas.visuals.segment("divider", { x: 480, y: 50 }, { x: 480, y: 580 })

    // ─── Rectangle ────────────────────────────────────────────────────
    const pin    = canvas.handles.disk("pin-handle", [cx, cy] )
    Pins.rotateBy(pin,Math.PI / 5,pin)
    const rect   = canvas.visuals.rectangle("rect")

    const width  = buildSlider(canvas,  "width",  60, 220, 150, cx, sliderBaseY)
    const height = buildSlider(canvas,  "height", 30, 130,  80, cx, sliderBaseY + rowH)

    Reactive.do([pin, width, height], () => {
        Rectangles.centeredRectangle(pin, width.value, height.value,  rect)
    })

    // ─── Corner markers ───────────────────────────────────────────────
    const tlDot = canvas.visuals.circle("corner-dot")
    const trDot = canvas.visuals.circle("corner-dot")
    const blDot = canvas.visuals.circle("corner-dot")
    const brDot = canvas.visuals.circle("corner-dot")

    const tlLbl = canvas.text.label("topLeft",     "corner-label-tl")
    const trLbl = canvas.text.label("topRight",    "corner-label-tr")
    const blLbl = canvas.text.label("bottomLeft",  "corner-label-bl")
    const brLbl = canvas.text.label("bottomRight", "corner-label-br")

    Reactive.do([rect], () => {
        const tl = Rectangles.topLeft(rect)
        const tr = Rectangles.topRight(rect)
        const bl = Rectangles.bottomLeft(rect)
        const br = Rectangles.bottomRight(rect)

        Circles.circleAt(tl, 5, tlDot)
        Circles.circleAt(tr, 5, trDot)
        Circles.circleAt(bl, 5, blDot)
        Circles.circleAt(br, 5, brDot)

        Points.moveUp(tl,    14, tlLbl)
        Points.moveUp(tr,    14, trLbl)
        Points.moveDown(bl,  14, blLbl)
        Points.moveDown(br,  14, brLbl)
    })

    // ─── Side highlights ──────────────────────────────────────────────
    const topSeg    = canvas.visuals.segment("side-top")
    const bottomSeg = canvas.visuals.segment("side-bottom")
    const leftSeg   = canvas.visuals.segment("side-left")
    const rightSeg  = canvas.visuals.segment("side-right")

    const topLbl    = canvas.text.label("topSide",    "side-label")
    const bottomLbl = canvas.text.label("bottomSide", "side-label")
    const leftLbl   = canvas.text.label("leftSide",   "side-label")
    const rightLbl  = canvas.text.label("rightSide",  "side-label")

    Reactive.do([rect], () => {
        const ts = Rectangles.topSide(rect)
        const bs = Rectangles.bottomSide(rect)
        const ls = Rectangles.leftSide(rect)
        const rs = Rectangles.rightSide(rect)

        Segments.copy(ts, topSeg)
        Segments.copy(bs, bottomSeg)
        Segments.copy(ls, leftSeg)
        Segments.copy(rs, rightSeg)

        Points.midPoint(ts.at(0), ts.at(1), topLbl);    Points.moveUp(topLbl,    12, topLbl)
        Points.midPoint(bs.at(0), bs.at(1), bottomLbl); Points.moveDown(bottomLbl, 12, bottomLbl)
        Points.midPoint(ls.at(0), ls.at(1), leftLbl);   Points.moveLeft(leftLbl,  30, leftLbl)
        Points.midPoint(rs.at(0), rs.at(1), rightLbl);  Points.moveRight(rightLbl, 30, rightLbl)
    })

    // ─── Measurements panel ───────────────────────────────────────────
    const mW    = canvas.text.label("", "measurement")
    const mH    = canvas.text.label("", "measurement")
    const mArea = canvas.text.label("", "measurement")
    const mDiag = canvas.text.label("", "measurement")

    canvas.text.labelAt("Measurements",  { x: 640, y: 120 }, "section-title")
    canvas.text.labelAt("width()",       { x: 590, y: 165 }, "measure-key")
    canvas.text.labelAt("height()",      { x: 590, y: 215 }, "measure-key")
    canvas.text.labelAt("area()",        { x: 590, y: 265 }, "measure-key")
    canvas.text.labelAt("diagonal()",    { x: 590, y: 315 }, "measure-key")

    Reactive.do([rect], () => {
        const w = Rectangles.width(rect)
        const h = Rectangles.height(rect)
        const a = Rectangles.area(rect)
        const d = Rectangles.diagonal(rect)

        mW.value    = `${w.value.toFixed(0)} px`;    Points.copy({ x: 690, y: 165 }, mW)
        mH.value    = `${h.value.toFixed(0)} px`;    Points.copy({ x: 690, y: 215 }, mH)
        mArea.value = `${a.value.toFixed(0)} px²`;   Points.copy({ x: 690, y: 265 }, mArea)
        mDiag.value = `${d.value.toFixed(0)} px`;    Points.copy({ x: 690, y: 315 }, mDiag)
    })
}

// ─── Slider ───────────────────────────────────────────────────────────────
function buildSlider(
    canvas:  RvgGroup,
    label:   string,
    min:     number,
    max:     number,
    initial: number,
    cx:      number,
    cy:      number
): Real {
    const t      = canvas.values.real((initial - min) / (max - min))
    const value  = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")
    const valLbl = canvas.text.label("", "slider-value")

    Points.moveLeft( { x: cx, y: cy }, trackHalfW, track.at(0))
    Points.moveRight({ x: cx, y: cy }, trackHalfW, track.at(1))
    Points.moveUp(   { x: cx, y: cy }, 14, lbl)
    Points.moveDown( { x: cx, y: cy }, 18, valLbl)
    Points.placeOnSegment(track.at(0), track.at(1), t, handle)

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    Reactive.do([t], () => {
        Values.lerp(min, max, t, value)
        valLbl.value = value.value.toFixed(0)
    })

    return value
}