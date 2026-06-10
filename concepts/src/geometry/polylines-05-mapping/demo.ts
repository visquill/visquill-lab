// @name Mapping
// @category Geometry
// @group Polylines

import {
    VisQuill, Reactive, Boxes, Segments, Points, Polylines
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// The "shape" polyline — a zigzag wave defined in its own local space.
// The length proportions of its segments determine how the mapped result
// is distributed along the target path.
const initialShapePoints: [number, number][] = [
    [50+  0,  500],
    [50+ 80,  460],
    [50+160,  500],
    [50+240,  560],
    [50+320,  500],
    [50+400,  560],
    [50+480,  500],
    [50+560,  460],
    [50+640,  500],
]

// The "path" polyline — defines where the mapped result is drawn.
const initialPathPoints: [number, number][] = [
    [ 80, 300],
    [200, 150],
    [360, 380],
    [520, 120],
    [680, 300],
    [820, 200],
]

const smoothingIterations = 3

/**
 * Demonstrates `Polylines.mapOnPolyline()`.
 *
 * Two sets of draggable handles define the shape and the path.
 * The shape's segment-length proportions are projected onto the path:
 * a short segment in the shape maps to a short portion of the path,
 * a long one to a longer portion.  The perpendicular offsets of the
 * shape's vertices are preserved relative to the path's local frame.
 *
 * Drag the orange shape handles to change the pattern being mapped.
 * Drag the blue path handles to change where and how it is laid out.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polyline-map-")
    const canvas = rvg.canvas

    // ─── Instruction label ─────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Orange handles: edit shape · Blue handles: edit path",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Shape polyline + handles ──────────────────────────────────────
    // The shape stays in its original position for reference. Its segment
    // proportions — not its absolute coordinates — determine the mapping.
    const shapeHandles = initialShapePoints.map(pt =>
        canvas.handles.disk("shape-handle", pt)
    )
    const shapePolyline = canvas.visuals.polyline("shape-reference")

    // ─── Path polyline + handles ───────────────────────────────────────
    const pathHandles = initialPathPoints.map(pt =>
        canvas.handles.disk("path-handle", pt)
    )
    const pathSmooth = canvas.visuals.polyline("path-smooth")

    // ─── Mapped result ─────────────────────────────────────────────────
    // The shape bent to follow the smooth path, segment-proportions preserved.
    const mapped = canvas.visuals.polyline("mapped")

    // ─── Top-left info labels ──────────────────────────────────────────
    const labelShape = canvas.text.label("shape: drag orange handles", "info-label")
    const labelPath  = canvas.text.label("path: drag blue handles",   "info-label")
    Reactive.do([rvg.frame], () => {
        const topLeft = Boxes.topLeft(rvg.frame)
        Points.move(topLeft, 20, 60, labelShape)
        Points.move(topLeft, 20, 80, labelPath)
    })

    // ─── Reactive mapping ──────────────────────────────────────────────
    // Rebuild whenever either set of handles moves.
    Reactive.do([...shapeHandles, ...pathHandles], () => {
        // Rebuild the shape polyline from its handles.
        const rawShape = Polylines.polyline(shapeHandles)
        Polylines.copy(rawShape, shapePolyline)

        // Rebuild and smooth the path polyline.
        const rawPath = Polylines.polyline(pathHandles)
        Polylines.smooth(rawPath, smoothingIterations, pathSmooth)

        // Map: the shape's segment-length proportions are projected onto
        // the path.  Each vertex of the shape lands at the corresponding
        // normalised position along the path, offset perpendicularly by
        // the same amount it sits above/below the shape's own baseline.
        Polylines.mapOnPolyline(shapePolyline, pathSmooth, mapped)
    })
}