// @name Circle Attachments
// @category Reactions
// @group Attach
import {
    VisQuill, Reactive, Attach, Points,  Boxes, Segments,
    type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cols = [200, 500, 800]
const cy   = 300

const baseRadius = 90

const trackHalfW = 70
const sliderY    = 80

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-attach-circle-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    const instructions = canvas.text.label(
        "Drag the handles to resize or move the circle",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── circleToCircle ───────────────────────────────────────────────
    // An outer circle that maintains a fixed radial gap from the inner.
    // Drag the radius handle to resize the inner circle.
    {
        const cx = cols[0]

        const radiusHandle = canvas.handles.disk("radius-handle", [cx + baseRadius, cy])
        const inner  = canvas.visuals.circle("inner-circle")
        const outer    = canvas.visuals.circle("outer-circle")

        Attach.circleCenterToPoint(inner, canvas.values.point([cx, cy]))
        Attach.circleRadiusToValue(inner, canvas.values.real(baseRadius))

        Reactive.do([radiusHandle], () => {
            const r = Math.max(20, Points.distanceToPoint({ x: cx, y: cy }, radiusHandle).value)
            Attach.circleRadiusToValue(inner, r)
        })

        Attach.circleToCircle(outer, inner, 20)

        canvas.text.labelAt("circleToCircle(outer, inner, distance: 20)", { x: cx, y: cy - baseRadius - 50 }, "panel-label")
    }

    // ─── polygonToCircle ──────────────────────────────────────────────
    // Distributes a polygon's vertices evenly around a circle.
    // Slider controls the starting angle.
    {
        const cx = cols[1]

        const radiusHandle = canvas.handles.disk("radius-handle", [cx + baseRadius, cy])
        const circle  = canvas.visuals.circle("inner-circle")
        const polygon = canvas.visuals.polygon("polygon",5)

        Attach.circleCenterToPoint(circle, canvas.values.point([cx, cy]))

        Reactive.do([radiusHandle], () => {
            const r = Math.max(20, Points.distanceToPoint({ x: cx, y: cy }, radiusHandle).value)
            Attach.circleRadiusToValue(circle, r)
        })

        const angle = buildSlider(canvas, rvg, "start angle", 0, Math.PI * 2, 0, cx, sliderY)

        Attach.polygonToCircle(polygon, circle, { angle })

        canvas.text.labelAt("polygonToCircle(polygon, circle, { angle })", { x: cx, y: cy - baseRadius - 50 }, "panel-label")
    }

    // ─── polylineToCircle ─────────────────────────────────────────────
    // Distributes polyline vertices along a circular arc.
    // Sliders control the arc span and centre angle.
    {
        const cx = cols[2]

        const radiusHandle = canvas.handles.disk("radius-handle", [cx + baseRadius, cy])
        const circle   = canvas.visuals.circle("inner-circle")
        const polyline = canvas.visuals.polyline("arc-polyline",10)

        Attach.circleCenterToPoint(circle, canvas.values.point([cx, cy]))

        Reactive.do([radiusHandle], () => {
            const r = Math.max(20, Points.distanceToPoint({ x: cx, y: cy }, radiusHandle).value)
            Attach.circleRadiusToValue(circle, r)
        })

        const span  = buildSlider(canvas, rvg, "span (rad)", 0.5, Math.PI * 2, Math.PI, cx, sliderY + 22)
        const angle = buildSlider(canvas, rvg, "angle (rad)", 0, Math.PI * 2, 0, cx, sliderY - 22)

        Attach.polylineToCircle(polyline, circle, span, {
            angle,
            anchorPosition: "center",
            distance: 0,
        })

        canvas.text.labelAt("polylineToCircle(polyline, circle, span, { angle })", { x: cx, y: cy - baseRadius - 50 }, "panel-label")
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
        value.value = min + t.value * (max - min)
    })

    return value
}