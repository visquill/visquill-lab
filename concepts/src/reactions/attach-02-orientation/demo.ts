// @name Orientation Modes
// @category Reactions
// @group Attach
import {
    VisQuill, Reactive, Attach, Points, Boxes, Segments,
    Polylines, type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const leftCx  = 280
const rightCx = 720

// Waypoints for the path the pin travels along.
const pathWaypoints: [number, number][] = [
    [100, 420], [200, 180], [360, 340], [440, 160], [560, 360], [700, 200], [860, 400],
]
const smoothSteps = 8

// Arrow shape (triangle) used as the attached shape.
const arrowHalfW = 14
const arrowHalfH = 20

const trackHalfW = 90
const sliderY    = 70

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-attach-orientation-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    const instructions = canvas.text.label(
        "Drag the slider to move along the path",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Shared smooth trajectory ─────────────────────────────────────
    // Both panels use the same path so the only variable is orientation.
    const rawPath  = canvas.shapes.polyline(pathWaypoints)
    const smoothed = canvas.visuals.polyline("path", Polylines.smooth(rawPath, smoothSteps))

    // ─── Left panel — relative orientation ───────────────────────────
    // The rectangle rotates to align with the path tangent at the
    // current position.
    {
        const pin  = canvas.values.pin()
        const rect = canvas.visuals.rectangle("arrow-relative")

        const ratio = buildSlider(canvas, rvg, "position", 0.1, leftCx, sliderY,
            "orientation: \"relative\"", "shape rotates with the path tangent")

        Reactive.do([ratio], () => {
            Polylines.pinAt(smoothed, ratio, pin)
        })

        Attach.rectangleToPoint(rect, pin, {
            width: arrowHalfW * 2,
            height: arrowHalfH * 2,
            anchorX: "center",
            anchorY: "center",
            orientation: "relative",
        })
    }

    // ─── Right panel — absolute orientation ──────────────────────────
    // The rectangle keeps a fixed orientation regardless of path direction.
    {
        const pin  = canvas.values.pin()
        const rect = canvas.visuals.rectangle("arrow-absolute")

        const ratio = buildSlider(canvas, rvg, "position", 0.1, rightCx, sliderY,
            "orientation: \"absolute\"", "shape keeps its orientation")

        Reactive.do([ratio], () => {
            Polylines.pinAt(smoothed, ratio, pin)
        })

        Attach.rectangleToPoint(rect, pin, {
            width: arrowHalfW * 2,
            height: arrowHalfH * 2,
            anchorX: "center",
            anchorY: "center",
            orientation: "absolute",
        })
    }
}

// ─── Slider ───────────────────────────────────────────────────────────────
// Returns the handle position as a ratio from 0 to 1 along the track.
function buildSlider(
    canvas:   RvgGroup,
    rvg:      RvgGraphic,
    label:    string,
    initial:  number,
    cx:       number,
    yOffset:  number,
    caption:  string,
    subtitle: string,
): Real {

    const l1 = canvas.text.label(caption, "panel-label")
    const l2 = canvas.text.label(subtitle, "panel-sub")

    const t      = canvas.values.real(initial)
    const track  = canvas.visuals.segment("slider-track")
    const handle = canvas.handles.disk("slider-handle")
    const lbl    = canvas.text.label(label, "slider-label")

    Reactive.do([rvg.frame], () => {
        const bottom = Segments.midPoint(Boxes.bottomSide(rvg.frame))
        const center = Points.move(bottom, cx - 500, -yOffset)
        Points.moveLeft( center, trackHalfW, track.at(0))
        Points.moveRight(center, trackHalfW, track.at(1))
        Points.moveUp(center, 14, lbl)
        Points.moveUp(center,70,l1)
        Points.moveUp(center,50,l2)
        Points.placeOnSegment(track.at(0), track.at(1), t, handle)
    })

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    return t
}