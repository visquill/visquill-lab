// @name Point Set Analysis
// @category Geometry
// @group Points

import {
    VisQuill, Reactive, Points, Circles, Boxes, Segments
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const startPositions: [number, number][] = [
    [200, 180], [380, 140], [520, 220], [650, 170],
    [720, 310], [600, 400], [430, 430], [280, 380],
    [160, 310], [350, 270], [550, 340], [480, 190],
]

// Fixed reference point for min/max distance queries.
const refStart: [number, number] = [760, 430]

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-points-analysis-")
    const canvas = rvg.canvas

    const instructions = canvas.text.label(
        "Drag any point or the reference handle (orange) to update the analysis",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Draggable point cloud ─────────────────────────────────────────
    const handles = startPositions.map(([x, y]) =>
        canvas.handles.disk("point-handle", [x, y])
    )

    // Reference point for distance queries.
    const refHandle = canvas.handles.disk("ref-handle", refStart)

    // ─── Analysis visuals ─────────────────────────────────────────────
    const centroidMark  = canvas.visuals.circle("centroid-mark")
    const diagonalLine  = canvas.visuals.segment("diagonal-line")
    const diagEndA      = canvas.visuals.circle("diagonal-endpoint")
    const diagEndB      = canvas.visuals.circle("diagonal-endpoint")
    const nearestLine   = canvas.visuals.segment("nearest-line")
    const nearestMark   = canvas.visuals.circle("nearest-mark")
    const farthestLine  = canvas.visuals.segment("farthest-line")
    const farthestMark  = canvas.visuals.circle("farthest-mark")

    const centroidLbl  = canvas.text.label("centroid",  "centroid-label")
    const nearestLbl   = canvas.text.label("nearest",   "annotation-label")
    const farthestLbl  = canvas.text.label("farthest",  "annotation-label")
    const diagLbl      = canvas.text.label("diagonal",  "annotation-label")

    Reactive.do(handles, () => {
        const pts = handles.map(h => ({ x: h.x, y: h.y }))

        // centroid — geometric average of all points
        const c = Points.centroid(pts)
        Circles.circleAt(c, 8, centroidMark)
        Points.moveUp(c, 16, centroidLbl)

        // diagonal — segment connecting the two farthest-apart points
        const diag = Points.diagonal(pts)
        Points.copy(diag.at(0), diagonalLine.at(0))
        Points.copy(diag.at(1), diagonalLine.at(1))
        Circles.circleAt(diag.at(0), 6, diagEndA)
        Circles.circleAt(diag.at(1), 6, diagEndB)
        Points.moveUp(Points.midPoint(diag.at(0), diag.at(1)), 14, diagLbl)
    })

    Reactive.do([...handles, refHandle], () => {
        const pts = handles.map(h => ({ x: h.x, y: h.y }))

        // nearest point to the reference
        const nearest = Points.pointWithMinDistance(refHandle, pts)
        Points.copy(refHandle, nearestLine.at(0))
        Points.copy(nearest,   nearestLine.at(1))
        Circles.circleAt(nearest, 8, nearestMark)
        Points.moveLeft(Points.midPoint(refHandle, nearest), 28, nearestLbl)

        // farthest point from the reference
        const farthest = Points.pointWithMaxDistance(refHandle, pts)
        Points.copy(refHandle, farthestLine.at(0))
        Points.copy(farthest,  farthestLine.at(1))
        Circles.circleAt(farthest, 8, farthestMark)
        Points.moveRight(Points.midPoint(refHandle, farthest), 30, farthestLbl)
    })
}