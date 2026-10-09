// @name Geometric Matching
// @category Geometry
// @group Match

import { VisQuill, Reactive, Match, Points, Boxes, Segments } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// set1 has more points than set2 to demonstrate that multiple set1 points
// can match to the same set2 point.
const set1Positions: [number, number][] = [
    [180, 180],
    [220, 320],
    [160, 440],
    [300, 260],
    [260, 400],
    [340, 160],
]

const set2Positions: [number, number][] = [
    [560, 200],
    [680, 340],
    [560, 440],
    [760, 180],
]

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-match-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag any point · each set2 point gets its own set1 partner, with the smallest total distance",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Section labels ───────────────────────────────────────────────
    canvas.text.labelAt(`set1  (${set1Positions.length} points)`, { x: 250, y: 80 }, "set-label-1")
    canvas.text.labelAt(`set2  (${set2Positions.length} points)`, { x: 660, y: 80 }, "set-label-2")


    // ─── Point handles ────────────────────────────────────────────────
    const handles1 = set1Positions.map(pos => canvas.handles.disk("point-1", pos))
    const handles2 = set2Positions.map(pos => canvas.handles.disk("point-2", pos))

    // ─── Match connectors ─────────────────────────────────────────────
    // One segment per set2 point (the smaller set), updated whenever any
    // handle moves.
    const connectors = handles2.map(() => canvas.visuals.segment("connector"))

    Reactive.do([...handles1, ...handles2], () => {
        // indices[i] is the index in handles1 of the partner of handles2[i]
        const indices = Match.pointsWithPoints(handles2, handles1)

        indices.forEach((matchIdx, i) => {
            Segments.segment(handles1[matchIdx], handles2[i], connectors[i])
        })
    })
}