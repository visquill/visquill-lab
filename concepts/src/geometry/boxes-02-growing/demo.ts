// @name Inflate & Pad
// @category Geometry
// @group Boxes
import {
    VisQuill, Reactive, Values, Boxes, Segments, Points, type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const sourceTopLeft     = [280, 180]
const sourceBottomRight = [720, 440]

const trackHalfW  = 70
const sliderBottomY = 160  // distance up from bottom for the bottom row of sliders
const rowH        = 64

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-boxes-inflate-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Blue: inflate (symmetric) · Orange: pad (per side) · Drag sliders to adjust",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Source box (fixed) ───────────────────────────────────────────
    const source    = canvas.shapes.box()
    Boxes.spannedBox(sourceTopLeft, sourceBottomRight, source)
    const sourceVis = canvas.visuals.box("source-box")
    Boxes.copy(source, sourceVis)

    // ─── Inflate result ───────────────────────────────────────────────
    // inflate(dx, dy) expands the box by dx on EACH horizontal side and
    // dy on EACH vertical side — the expansion is symmetric.
    const inflateResult = canvas.visuals.box("inflate-result")

    const dx = buildSlider(canvas, rvg, "dx", -80, 80, 0, -250, sliderBottomY + rowH)
    const dy = buildSlider(canvas, rvg, "dy", -80, 80, 0, -90,  sliderBottomY + rowH)

    Reactive.do([dx, dy], () => {
        Boxes.inflate(source, dx.value, dy.value, inflateResult)
    })

    // ─── Pad result ───────────────────────────────────────────────────
    // pad(left, top, right, bottom) expands each side independently —
    // negative values shrink that side inward.
    const padResult = canvas.visuals.box("pad-result")

    const padL = buildSlider(canvas, rvg, "left",   -60, 60, 0,  70,  sliderBottomY + rowH)
    const padT = buildSlider(canvas, rvg, "top",    -60, 60, 0,  220, sliderBottomY + rowH)
    const padR = buildSlider(canvas, rvg, "right",  -60, 60, 0,  220, sliderBottomY)
    const padB = buildSlider(canvas, rvg, "bottom", -60, 60, 0,   70,  sliderBottomY)

    Reactive.do([padL, padT, padR, padB], () => {
        Boxes.pad(source, padL.value, padT.value, padR.value, padB.value, padResult)
    })

    // ─── Section labels ───────────────────────────────────────────────
    const lblInflate = canvas.text.label("inflate(dx, dy)", "section-label-inflate")
    const lblPad     = canvas.text.label("pad(left, top, right, bottom)", "section-label-pad")

    Reactive.do([rvg.frame], () => {
        const bottom = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        Points.moveLeft( Points.moveUp(bottom, sliderBottomY + rowH * 2 + 12), 145, lblInflate)
        Points.moveRight(Points.moveUp(bottom, sliderBottomY + rowH * 2 + 12), 145, lblPad)
    })
}

// ─── Slider ───────────────────────────────────────────────────────────────
/**
 * A horizontal slider returning a reactive Real that maps 0-1 → [min, max].
 * `xOffset` is signed distance from the frame horizontal center;
 * `yOffset` is distance up from the frame bottom.
 */
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
        valLbl.value = `${value.value.toFixed(0)}`
    })

    return value
}