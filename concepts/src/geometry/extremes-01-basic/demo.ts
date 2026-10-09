// @name Basic
// @category Geometry
// @group Extremes

import {VisQuill, Reactive, Extremes, Points, Segments, Circles, Boxes} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Starting positions for the draggable point cloud.
const cloudPoints: [number, number][] = [
    [320, 200], [480, 160], [600, 240], [660, 360],
    [580, 480], [420, 520], [270, 440], [200, 300],
    [380, 300], [520, 380], [440, 240], [310, 390],
]

// Starting position of the reference handle for closest/farthest.
const referenceStart: [number, number] = [750, 300]

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-extremes-")
    const canvas = rvg.canvas

    // ─── Instructions ─────────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag any point or the reference handle · Left: directional extremes · Right: closest & farthest",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Divider ──────────────────────────────────────────────────────
    canvas.visuals.segment("divider",
        canvas.values.point([700, 60]),
        canvas.values.point([700, 580])
    )

    // ─── Point cloud (shared) ─────────────────────────────────────────
    // All handles are shared between both panels.
    const handles = cloudPoints.map(pos =>
        canvas.handles.disk("cloud-handle", pos)
    )

    // ─── Left panel: directional extremes ─────────────────────────────
    // Four result markers, one per direction.
    const topMarker    = canvas.visuals.circle("marker-top")
    const bottomMarker = canvas.visuals.circle("marker-bottom")
    const leftMarker   = canvas.visuals.circle("marker-left")
    const rightMarker  = canvas.visuals.circle("marker-right")

    const topLabel    = canvas.text.label("top",    "extreme-label-top")
    const bottomLabel = canvas.text.label("bottom", "extreme-label-bottom")
    const leftLabel   = canvas.text.label("left",   "extreme-label-left")
    const rightLabel  = canvas.text.label("right",  "extreme-label-right")

    Reactive.do(handles, () => {
        const top    = Extremes.topMost(handles)
        const bottom = Extremes.bottomMost(handles)
        const left   = Extremes.leftMost(handles)
        const right  = Extremes.rightMost(handles)

        Circles.circleAt(top,    10, topMarker)
        Circles.circleAt(bottom, 10, bottomMarker)
        Circles.circleAt(left,   10, leftMarker)
        Circles.circleAt(right,  10, rightMarker)

        Points.moveUp(top,       18, topLabel)
        Points.moveDown(bottom,  18, bottomLabel)
        Points.moveLeft(left,    28, leftLabel)
        Points.moveRight(right,  28, rightLabel)
    })

    canvas.text.labelAt("topMost · bottomMost · leftMost · rightMost", { x: 350, y: 560 }, "panel-label")

    // ─── Right panel: closest & farthest ─────────────────────────────
    const reference    = canvas.handles.disk("reference-handle", referenceStart)
    const closestLine  = canvas.visuals.segment("closest-line")
    const farthestLine = canvas.visuals.segment("farthest-line")
    const closestMarker  = canvas.visuals.circle("marker-closest")
    const farthestMarker = canvas.visuals.circle("marker-farthest")
    const closestLabel   = canvas.text.label("closest",  "extreme-label-closest")
    const farthestLabel  = canvas.text.label("farthest", "extreme-label-farthest")
    const closestDist    = canvas.text.label("", "distance-label")
    const farthestDist   = canvas.text.label("", "distance-label")

    Reactive.do([reference, ...handles], () => {
        const closest  = Extremes.closestTo(handles,  reference)
        const farthest = Extremes.farthestFrom(handles, reference)

        Circles.circleAt(closest,  10, closestMarker)
        Circles.circleAt(farthest, 10, farthestMarker)

        Points.copy(closest,  closestLine.at(0))
        Points.copy(reference, closestLine.at(1))
        Points.copy(farthest, farthestLine.at(0))
        Points.copy(reference, farthestLine.at(1))

        Points.moveUp(closest,   18, closestLabel)
        Points.moveUp(farthest,  18, farthestLabel)

        Points.midPoint(closest,  reference, closestDist)
        Points.midPoint(farthest, reference, farthestDist)
        closestDist.value  = `${Points.distanceToPoint(closest,  reference).value.toFixed(0)}px`
        farthestDist.value = `${Points.distanceToPoint(farthest, reference).value.toFixed(0)}px`
    })

    canvas.text.labelAt("closestTo · farthestFrom", { x: 850, y: 560 }, "panel-label")
}