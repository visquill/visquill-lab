// @name Vertex Orientations
// @category Geometry
// @group Polygons

import {
    VisQuill, Reactive, Boxes, Segments, Points, Vectors,
    Polygons,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx            = 440
const cy            = 240
const polygonRadius = 160
const vertexCount   = 6

const initialVertices: [number, number][] = Array.from(
    { length: vertexCount },
    (_, i) => {
        const angle = (i / vertexCount) * Math.PI * 2 - Math.PI / 2
        return [
            Math.round(cx + polygonRadius * Math.cos(angle)),
            Math.round(cy + polygonRadius * Math.sin(angle)),
        ]
    }
)

const arrowLength = 50

/**
 * Demonstrates `VertexOrientation` and `VertexNormal` on a draggable polygon.
 *
 * Each vertex shows both its tangent bisector (green, orientation) and its
 * outward normal (purple) simultaneously.  Drag any vertex to create a sharp
 * corner and observe that the bisector splits the angle evenly while the
 * normal stays perpendicular to it.  At near-180° turns the bisector falls
 * back to the outgoing edge direction.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-polygon-vertex-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag vertices to reshape · green = orientation · purple = normal",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Vertex handles ────────────────────────────────────────────────
    const handles = initialVertices.map(pos =>
        canvas.handles.disk("vertex", pos)
    )

    // ─── Polygon visual ────────────────────────────────────────────────
    const polygon = canvas.visuals.polygon("polygon")

    // ─── Per-vertex orientation arrows (green) ─────────────────────────
    const oriStarts = Array.from({ length: vertexCount }, () => canvas.values.point())
    const oriEnds   = Array.from({ length: vertexCount }, () => canvas.values.point())
    Array.from({ length: vertexCount }, (_, i) =>
        canvas.visuals.segment("arrow-orientation", oriStarts[i], oriEnds[i])
    )

    // ─── Per-vertex normal arrows (purple) ────────────────────────────
    const nrmStarts = Array.from({ length: vertexCount }, () => canvas.values.point())
    const nrmEnds   = Array.from({ length: vertexCount }, () => canvas.values.point())
    Array.from({ length: vertexCount }, (_, i) =>
        canvas.visuals.segment("arrow-normal", nrmStarts[i], nrmEnds[i])
    )

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do([...handles], () => {
        Polygons.polygon(handles, polygon)

        for (let i = 0; i < vertexCount; i++) {
            const vertex = handles[i]!
            const pt = { x: vertex.x, y: vertex.y }

            const ori = Polygons.vertexOrientation(polygon, i)
            Points.copy(pt, oriStarts[i])
            Vectors.add(pt, Vectors.scale(ori, arrowLength), oriEnds[i])

            const nrm = Polygons.vertexNormal(polygon, i, true)
            Points.copy(pt, nrmStarts[i])
            Vectors.add(pt, Vectors.scale(nrm, arrowLength), nrmEnds[i])
        }
    }, true)
}