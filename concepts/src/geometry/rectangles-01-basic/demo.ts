// @name Construction
// @category Geometry
// @group Rectangles
import {
    VisQuill, Reactive, Rectangles, Points,
    type RvgGroup, type Real, Pins, Circles
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const leftX   = 165
const midX    = 500
const rightX  = 835
const panelY  = 260

const trackHalfW = 60
const rowH       = 52
const sliderBaseY = 460  // y position of the top slider row

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-rect-construction-")
    const canvas = rvg.canvas

    canvas.text.labelAt(
        "Drag handles and sliders — rectangles follow the pin orientation",
        { x: 500, y: 25 },
        "instructions"
    )

    canvas.visuals.segment("divider", { x: 333, y: 50 }, { x: 333, y: 580 })
    canvas.visuals.segment("divider", { x: 666, y: 50 }, { x: 666, y: 580 })

    // ─── centeredRectangle ────────────────────────────────────────────
    {
        const pin    = canvas.handles.disk("pin-handle", [leftX, panelY])
        Pins.rotateBy(pin,Math.PI / 8,pin)
        const result = canvas.visuals.rectangle("rect")

        const width  = buildSlider(canvas,  "width",  40, 200, 120, leftX, sliderBaseY)
        const height = buildSlider(canvas,  "height", 20, 120,  60, leftX, sliderBaseY + rowH)

        Reactive.do([pin, width, height], () => {
            Rectangles.centeredRectangle(pin, width, height,  result)
        })

        canvas.text.labelAt("centeredRectangle", { x: leftX, y: 555 }, "panel-label")
    }

    // ─── anchoredRectangle ────────────────────────────────────────────
    // xRatio=0 anchors the left edge at the pin; xRatio=1 the right.
    // yRatio=0 anchors the top;  yRatio=1 the bottom.
    {
        const pin    = canvas.handles.disk("pin-handle", [midX, panelY])
        Pins.rotateBy(pin,-Math.PI / 8,pin)
        const result = canvas.visuals.rectangle("rect")
        const dot    = canvas.visuals.circle("anchor-dot")

        const width  = buildSlider(canvas,  "width",  40, 200, 120, midX, sliderBaseY)
        const height = buildSlider(canvas,  "height", 20, 120,  60, midX, sliderBaseY + rowH)
        const xRatio = buildSlider(canvas,  "xRatio",  0,   1, 0.5, midX, sliderBaseY + rowH * 2)
        const yRatio = buildSlider(canvas,  "yRatio",  0,   1, 0.5, midX, sliderBaseY + rowH * 3)

        Reactive.do([pin, width, height, xRatio, yRatio], () => {
            Rectangles.anchoredRectangle(pin, xRatio, yRatio, width, height,  result)
            Circles.circleAt(pin,5,dot)
        })

        canvas.text.labelAt("anchoredRectangle", { x: midX, y: 755 }, "panel-label")
    }

    // ─── alongSegment ─────────────────────────────────────────────────
    // Two-handle baseline; height slider; side toggle handle.
    {
        const p1     = canvas.handles.disk("endpoint", [rightX - 100, panelY + 60])
        const p2     = canvas.handles.disk("endpoint", [rightX + 100, panelY - 60])
        const result = canvas.visuals.rectangle("rect")
        canvas.visuals.segment("base-seg", p1, p2)

        const height = buildSlider(canvas,  "height", 10, 120, 50, rightX, sliderBaseY)

        // Side toggle: drag above/below the midpoint of the base segment.
        const toggle  = canvas.handles.disk("side-toggle", [rightX, panelY - 80])
        const sideLbl = canvas.text.label("side: left", "toggle-label")
        Reactive.do([toggle], () => {
            Points.moveUp(toggle, 16, sideLbl)
        })

        Reactive.do([p1, p2, height, toggle], () => {
            const my    = (p1.y + p2.y) / 2
            const left  = toggle.y < my
            sideLbl.value = `side: ${left ? "left" : "right"}`
            Rectangles.alongSegment(p1, p2, height, left, result)
        })

        canvas.text.labelAt("alongSegment (baseline)", { x: rightX, y: 555 }, "panel-label")
    }
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
        value.value = min + t.value * (max - min)
        valLbl.value = value.value.toFixed(1)
    })

    return value
}