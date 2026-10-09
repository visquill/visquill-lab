// @name Point Attachments
// @category Reactions
// @group Attach

import {
    VisQuill, Reactive, Attach, Points, Circles, Boxes, Segments,
    Values, type RvgGroup, type RvgGraphic, type Real, Rectangles
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cols = [160, 420, 680, 900]
const cy   = 300

const trackHalfW = 65
const sliderY    = 80

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-attach-point-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    const instructions = canvas.text.label(
        "Drag shapes or sliders — attached points follow reactively",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── pointToSegment ───────────────────────────────────────────────
    // A pin placed at a ratio along a draggable segment, offset
    // perpendicularly by `distance` on the left side.
    {
        const cx = cols[0]

        const segA = canvas.handles.disk("seg-handle", [cx - 60, cy + 80])
        const segB = canvas.handles.disk("seg-handle", [cx + 60, cy - 80])
        canvas.visuals.segment("shape-seg", segA, segB)

        const pin     = canvas.values.pin()
        const pinMark = canvas.visuals.circle("pin-mark")
        const dirLine = canvas.visuals.segment("dir-line")

        const position = buildSlider(canvas, rvg, "position", 0, 1, 0.5, cx, sliderY + 20)
        const distance = buildSlider(canvas, rvg, "distance", 0, 60, 20, cx, sliderY - 20)

        Attach.pointToSegment(pin, canvas.shapes.segment(segA, segB), {
            position: position,
            distance: distance,
            side: "left",
            orientation: "relative",
        })

        Reactive.do([pin], () => {
            Circles.circleAt(pin, 7, pinMark)
            Segments.ray(pin,20,dirLine)
        })

        canvas.text.labelAt("pointToSegment", { x: cx, y: cy - 130 }, "panel-label")
        canvas.text.labelAt("position + distance + side", { x: cx, y: cy - 114 }, "panel-sub")
    }

    // ─── pointToCircle ────────────────────────────────────────────────
    // A pin placed on a circle's edge at a given angle, with a radial
    // distance offset.
    {
        const cx = cols[1]

        const center = canvas.handles.disk("center-handle", [cx, cy])
        const circle = canvas.visuals.circle("shape-circle")
        Attach.circleCenterToPoint(circle, center)
        Attach.circleRadiusToValue(circle, 80)

        const pin     = canvas.values.pin()
        const pinMark = canvas.visuals.circle("pin-mark")
        const dirLine = canvas.visuals.segment("dir-line")

        const angle    = buildSlider(canvas, rvg, "angle (rad)", 0, Math.PI * 2, 0, cx, sliderY + 20)
        const distance = buildSlider(canvas, rvg, "distance", -30, 40, 10, cx, sliderY - 20)

        Attach.pointToCircle(pin, circle, {
            angle:    angle,
            distance: distance,
            orientation: "relative",
        })

        Reactive.do([pin], () => {
            Circles.circleAt(pin, 7, pinMark)
            Segments.ray(pin,20,dirLine)
        })

        canvas.text.labelAt("pointToCircle", { x: cx, y: cy - 130 }, "panel-label")
        canvas.text.labelAt("angle + distance", { x: cx, y: cy - 114 }, "panel-sub")
    }

    // ─── pointToRectangleEdge ─────────────────────────────────────────
    // A pin placed on one edge of a rectangle at a given ratio.
    // Drag the rectangle's corner handle to resize; the pin follows.
    {
        const cx = cols[2]

        const corner = canvas.handles.disk("corner-handle", [cx + 60, cy + 50])
        const rect   = canvas.visuals.rectangle("shape-rect")
        const pin     = canvas.values.pin()
        const pinMark = canvas.visuals.circle("pin-mark")
        const dirLine = canvas.visuals.segment("dir-line")

        const anchorPos = buildSlider(canvas, rvg, "anchorPosition", 0, 1, 0.5, cx, sliderY)

        Reactive.do([corner], () => {
            Rectangles.centeredRectangle({x: cx, y: cy, dx:1, dy:0}, Math.abs(corner.x - cx) * 2, Math.abs(corner.y - cy) * 2,rect)
        })

        Attach.pointToRectangleEdge(pin, rect, {
            placement:      "top",
            anchorPosition: anchorPos,
            distance:       0,
            orientation:    "relative",
        })

        Reactive.do([pin], () => {
            Circles.circleAt(pin, 7, pinMark)
            Segments.ray(pin,20,dirLine)
        })

        canvas.text.labelAt("pointToRectangleEdge", { x: cx, y: cy - 130 }, "panel-label")
        canvas.text.labelAt("placement: \"top\", anchorPosition", { x: cx, y: cy - 114 }, "panel-sub")
    }

    // ─── pointToPoint ─────────────────────────────────────────────────
    // A point that follows another with a fixed vector offset.
    // Drag the source handle; the follower stays offset.
    {
        const cx = cols[3]

        const source   = canvas.handles.disk("source-handle", [cx, cy])
        const follower = canvas.values.point()
        const followerMark = canvas.visuals.circle("pin-mark")
        canvas.visuals.segment("dir-line", source, follower)
        const sourceMark   = canvas.visuals.circle("source-mark")

        Attach.pointToPoint(follower, source, { offset: [40, -50] })

        Reactive.do([follower, source], () => {
            Circles.circleAt(follower, 7, followerMark)
            Circles.circleAt(source,   7, sourceMark)
        })

        canvas.text.labelAt("pointToPoint", { x: cx, y: cy - 130 }, "panel-label")
        canvas.text.labelAt("offset: [40, −50]", { x: cx, y: cy - 114 }, "panel-sub")
    }
}

// ─── Slider ───────────────────────────────────────────────────────────────
function buildSlider(
    canvas:  RvgGroup,
    rvg:     RvgGraphic,
    label:   string,
    min:     number,
    max:     number,
    initial: number,
    cx:      number,
    yOffset: number
): Real {
    const t      = canvas.values.real((initial - min) / (max - min))
    const value  = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")

    Reactive.do([rvg.frame], () => {
        const bottom = Segments.midPoint(Boxes.bottomSide(rvg.frame))
        const center = Points.move(bottom, cx - 500, -yOffset)
        Points.moveLeft( center, trackHalfW, track.at(0))
        Points.moveRight(center, trackHalfW, track.at(1))
        Points.moveUp(center, 14, lbl)
        Points.placeOnSegment(track.at(0), track.at(1), t, handle)
    })

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    Reactive.do([t], () => {
        Values.lerp(min, max, t, value)
    })

    return value
}