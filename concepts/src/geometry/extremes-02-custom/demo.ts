// @name Custom Extreme
// @category Geometry
// @group Extremes

import {
    VisQuill, Reactive, Extremes, Points, Boxes, Segments,
    type RvgGroup, type RvgGraphic, type Real, Circles
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cloudPoints: [number, number][] = [
    [320, 200], [480, 160], [600, 240], [660, 360],
    [580, 480], [420, 520], [270, 440], [200, 300],
    [380, 300], [520, 380], [440, 240], [310, 390],
]

// Centre of the direction indicator arrow.
const arrowCx = 820
const arrowCy = 320
const arrowLength = 60

const trackHalfW    = 80
const sliderBottomY = 60

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-extremes-custom-")
    const canvas = rvg.canvas

    // ─── Instructions ─────────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the angle slider · The highlighted point is most extreme in that direction",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Divider ──────────────────────────────────────────────────────
    canvas.visuals.segment("divider",
        canvas.values.point([720, 60]),
        canvas.values.point([720, 580])
    )

    // ─── Point cloud ──────────────────────────────────────────────────
    const handles = cloudPoints.map(pos =>
        canvas.handles.disk("cloud-handle", pos)
    )

    // ─── Extreme marker & projection line ─────────────────────────────
    const marker      = canvas.visuals.circle("marker")
    const projLine    = canvas.visuals.segment("projection-line")
    const markerLabel = canvas.text.label("extreme", "marker-label")

    // ─── Direction arrow ──────────────────────────────────────────────
    // Shows the current direction vector used by extreme().
    const arrowTip  = canvas.visuals.circle("arrow-tip")
    const arrowShaft = canvas.visuals.segment("arrow-shaft")
    canvas.text.labelAt("direction", { x: arrowCx, y: arrowCy + arrowLength + 24 }, "arrow-label")

    // ─── Angle slider ─────────────────────────────────────────────────
    // Maps 0→1 to 0→2π, giving a full rotation.
    const angle = buildSlider(canvas, rvg, "angle (0 – 2π)", 0, Math.PI * 2, 0, sliderBottomY)

    // ─── Reactive update ──────────────────────────────────────────────
    Reactive.do([angle, ...handles], () => {
        const a  = angle.value
        const dx = Math.cos(a)
        const dy = Math.sin(a)

        // extreme() selects the point that maximises dot(p, direction).
        const result = Extremes.extreme(handles, (p, q) => {
            const dotP = p.x * dx + p.y * dy
            const dotQ = q.x * dx + q.y * dy
            return dotQ - dotP   // negative when p is more extreme
        })

        // Highlight the winning point.
        Circles.circleAt(result, 12, marker)
        Points.moveUp(result, 20, markerLabel)

        // Project a line from the winning point along the direction.
        Points.copy(result, projLine.at(0))
        Points.move(result, dx * 200, dy * 200, projLine.at(1))

        // Update the direction arrow.
        Points.copy({ x: arrowCx, y: arrowCy }, arrowShaft.at(0))
        Points.move({ x: arrowCx, y: arrowCy }, dx * arrowLength, dy * arrowLength, arrowShaft.at(1))
        Circles.circleAt({ x: arrowCx, y: arrowCy}, 4, arrowTip)
    })

    canvas.text.labelAt("extreme(points, comparison)", { x: 370, y: 560 }, "panel-label")
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
        valLbl.value = `${value.value.toFixed(2)} rad`
    })

    return value
}