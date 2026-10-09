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

const initialVertices = Array.from({ length: vertexCount }, (_, i) =>
    Points.placeOnCircle([cx, cy], polygonRadius, (i / vertexCount) * Math.PI * 2 - Math.PI / 2)
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

    // ─── Per-vertex arrows: orientation (green) and normal (purple) ────
    const oriArrows = handles.map(() => canvas.visuals.segment("arrow-orientation"))
    const nrmArrows = handles.map(() => canvas.visuals.segment("arrow-normal"))

    // ─── Reactive block ────────────────────────────────────────────────
    Reactive.do(handles, () => {
        Polygons.polygon(handles, polygon)

        handles.forEach((vertex, i) => {
            const ori = Polygons.vertexOrientation(polygon, i)
            Points.copy(vertex, oriArrows[i].at(0))
            Vectors.add(vertex, Vectors.scale(ori, arrowLength), oriArrows[i].at(1))

            const nrm = Polygons.vertexNormal(polygon, i, true)
            Points.copy(vertex, nrmArrows[i].at(0))
            Vectors.add(vertex, Vectors.scale(nrm, arrowLength), nrmArrows[i].at(1))
        })
    }, true)
}