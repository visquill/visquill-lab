// @name Point Placement
// @category Geometry
// @group Points

import {
    VisQuill, Reactive, Values, Points, Circles, Boxes, Segments, Vectors,
    type RvgGroup, type RvgGraphic, type Real
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cols = [200, 500, 800]
const cy   = 280
const r    = 100

const trackHalfW = 70
const sliderY    = 80   // distance up from bottom

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-point-placement-")
    const canvas = rvg.canvas

    const instructions = canvas.text.label(
        "Drag sliders to move the orange point along each shape",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── placeOnCircle ────────────────────────────────────────────────
    // Places a point on a circle's circumference at a given angle (radians).
    {
        const cx = cols[0]
        Circles.circleAt([cx, cy], r, canvas.visuals.circle("shape"))

        const dot  = canvas.visuals.circle("dot")
        const line = canvas.visuals.segment("guide-line")
        const lbl  = canvas.text.label("", "value-label")

        const angle = buildSlider(canvas, rvg, "angle  0 → 2π", 0, Math.PI * 2, 0, cx, sliderY)

        Reactive.do([angle], () => {
            const pt = Points.placeOnCircle([cx, cy], r, angle.value)
            Circles.circleAt(pt, 6, dot)
            Points.copy([cx, cy], line.at(0))
            Points.copy(pt, line.at(1))
            lbl.value = `${angle.value.toFixed(2)} rad`
            Points.moveUp(Points.midPoint([cx, cy], pt), 12, lbl)
        })

        canvas.text.labelAt("placeOnCircle(center, r, angle)", { x: cx, y: cy - r - 20 }, "panel-label")
    }

    // ─── placeOnArc ───────────────────────────────────────────────────
    // Places a point at a normalised ratio (0–1) along an arc defined
    // by a start direction, end direction, and winding.
    {
        const cx = cols[1]
        const startDir = Vectors.normalize([1, -0.5])
        const endDir   = Vectors.normalize([-1, -0.5])

        // Static arc drawn as a polyline for reference.
        const arcPts: [number, number][] = []
        for (let i = 0; i <= 48; i++) {
            const pt = Points.placeOnArc([cx, cy], r, startDir, endDir, i / 48, false)
            arcPts.push([pt.x, pt.y])
        }
        canvas.visuals.polyline("shape", arcPts)

        // Start and end markers.
        Circles.circleAt(Points.placeOnArc([cx, cy], r, startDir, endDir, 0, false), 5,
            canvas.visuals.circle("arc-endpoint"))
        Circles.circleAt(Points.placeOnArc([cx, cy], r, startDir, endDir, 1, false), 5,
            canvas.visuals.circle("arc-endpoint"))

        const dot  = canvas.visuals.circle("dot")
        const line = canvas.visuals.segment("guide-line")
        const lbl  = canvas.text.label("", "value-label")

        const ratio = buildSlider(canvas, rvg, "ratio  0 → 1", 0, 1, 0.5, cx, sliderY)

        Reactive.do([ratio], () => {
            const pt = Points.placeOnArc([cx, cy], r, startDir, endDir, ratio.value, false)
            Circles.circleAt(pt, 6, dot)
            Points.copy([cx, cy], line.at(0))
            Points.copy(pt, line.at(1))
            lbl.value = `ratio ${ratio.value.toFixed(2)}`
            Points.moveUp(Points.midPoint([cx, cy], pt), 12, lbl)
        })

        canvas.text.labelAt("placeOnArc(center, r, start, end, ratio, cw)", { x: cx, y: cy - r - 20 }, "panel-label")
    }

    // ─── placeBesideSegment ───────────────────────────────────────────
    // Places a point perpendicular to a segment at a given ratio and
    // fixed distance.  `left` is relative to the A→B direction.
    {
        const cx = cols[2]
        const p1: [number, number] = [cx - 85, cy + 55]
        const p2: [number, number] = [cx + 85, cy - 55]
        const dist = 45

        canvas.visuals.segment("shape", p1, p2)
        Circles.circleAt(p1, 5, canvas.visuals.circle("arc-endpoint"))
        Circles.circleAt(p2, 5, canvas.visuals.circle("arc-endpoint"))

        const dot      = canvas.visuals.circle("dot")
        const perpLine = canvas.visuals.segment("guide-line")
        const lbl      = canvas.text.label("", "value-label")

        const ratio = buildSlider(canvas, rvg, "ratio  0 → 1", 0, 1, 0.5, cx, sliderY)

        Reactive.do([ratio], () => {
            const onSeg = Points.placeOnSegment(p1, p2, ratio.value)
            const beside = Points.placeBesideSegment(p1, p2, ratio.value, dist, true)
            Circles.circleAt(beside, 6, dot)
            Points.copy(onSeg,  perpLine.at(0))
            Points.copy(beside, perpLine.at(1))
            lbl.value = `ratio ${ratio.value.toFixed(2)},  d = ${dist}`
            Points.moveUp(beside, 16, lbl)
        })

        canvas.text.labelAt("placeBesideSegment(p1, p2, ratio, dist, left)", { x: cx, y: cy - r - 20 }, "panel-label")
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