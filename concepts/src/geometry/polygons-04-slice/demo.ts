// @name Slice
// @category Geometry
// @group Polygons

import { VisQuill, Reactive, Polygons, Points, Segments, Boxes } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Centre and initial radius of the polygon.
const cx            = 430
const cy            = 320
const polygonRadius = 165
const vertexCount   = 6

// Initial positions of the two slice handles.
// They start off-boundary; the reactive block snaps their markers
// to the nearest boundary point on the first run.
const handleAStart: [number, number] = [cx - 40, cy - polygonRadius - 55]
const handleBStart: [number, number] = [cx + polygonRadius + 55, cy + 50]

// ─── Initial vertex positions (regular hexagon) ───────────────────────────
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

/**
 * Demonstrates `Polygons.slice()` and its wrap-around behaviour.
 *
 * Two handles (A and B) project onto the polygon boundary via
 * `closestPosition()`.  The boundary is split into two arcs: the slice
 * from A → B (orange) and the complement from B → A (dimmed).
 *
 * The key polygon-specific concept is wrap-around: when ratioA > ratioB
 * the slice crosses past vertex 0 instead of stopping before it.  This
 * is impossible with `Polylines.slice()`, which requires a non-decreasing
 * range, but natural for a closed polygon boundary.
 *
 * Drag handle A past handle B along the boundary to see it happen.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polygon-slice-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag A and B to adjust the slice · Drag A past B to wrap around vertex 0",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Vertex handles ───────────────────────────────────────────────
    const handles = initialVertices.map(pos =>
        canvas.handles.disk("vertex", pos)
    )

    // Vertex 0 is marked so the user can see where the wrap boundary is.
    const v0Label = canvas.text.label("0", "vertex-index")
    Reactive.do([handles[0]], () => {
        Points.moveUp(handles[0], 20, v0Label)
    })

    // ─── Polygon fill ─────────────────────────────────────────────────
    // Fill-only polygon gives the shape context without drawing the
    // boundary — the two arcs below draw the boundary instead.
    const polygon = canvas.visuals.polygon("polygon")

    // ─── Boundary arcs ────────────────────────────────────────────────
    // The boundary is split into two complementary slices so the
    // selected portion and the remainder are always both visible.
    const sliceArc  = canvas.visuals.polyline("slice-arc")   // A → B (selected)
    const remainArc = canvas.visuals.polyline("remain-arc")  // B → A (remainder)

    // ─── Slice handles ────────────────────────────────────────────────
    // Freely draggable; their nearest boundary positions are shown via
    // separate markers.  Snap lines connect each handle to its marker.
    const handleA = canvas.handles.disk("handle-a", handleAStart)
    const handleB = canvas.handles.disk("handle-b", handleBStart)

    const markerA = canvas.visuals.point("marker-a")
    const markerB = canvas.visuals.point("marker-b")

    canvas.visuals.segment("snap-line-a", handleA, markerA)
    canvas.visuals.segment("snap-line-b", handleB, markerB)

    // ─── Computed ratios ──────────────────────────────────────────────
    const ratioA = canvas.values.real()
    const ratioB = canvas.values.real()

    // ─── Labels ───────────────────────────────────────────────────────
    // Ratio labels float near each drag handle so the user always
    // sees the current 0–1 value.
    const labelA    = canvas.text.label("", "handle-label-a")
    const labelB    = canvas.text.label("", "handle-label-b")

    // Wrap indicator appears near vertex 0 only when ratioA > ratioB.
    const wrapLabel = canvas.text.label("", "wrap-label")

    // ─── Reactive block ───────────────────────────────────────────────
    Reactive.do([...handles, handleA, handleB], () => {
        // Rebuild the polygon from the current vertex positions.
        Polygons.polygon(handles, polygon)

        // ── Project handles onto the boundary ──────────────────────────
        // closestPosition() finds the 0–1 ratio of the nearest boundary
        // point; pointAt() converts that ratio back to a 2-D coordinate
        // for the marker visuals.
        Polygons.closestPosition(polygon, handleA, ratioA)
        Polygons.pointAt(polygon, ratioA, markerA)

        Polygons.closestPosition(polygon, handleB, ratioB)
        Polygons.pointAt(polygon, ratioB, markerB)

        // ── Split the boundary into two complementary arcs ─────────────
        // slice(A→B) and slice(B→A) together cover the full boundary.
        // When ratioA > ratioB, the A→B arc wraps past vertex 0.
        Polygons.slice(polygon, ratioA, ratioB, sliceArc)
        Polygons.slice(polygon, ratioB, ratioA, remainArc)

        // ── Ratio labels near drag handles ─────────────────────────────
        const rA = ratioA.value
        const rB = ratioB.value
        Points.moveUp(handleA, 18, labelA)
        Points.moveUp(handleB, 18, labelB)
        labelA.value = `A: ${rA.toFixed(2)}`
        labelB.value = `B: ${rB.toFixed(2)}`

        // ── Wrap indicator near vertex 0 ───────────────────────────────
        // ratioA > ratioB means the selected arc crosses vertex 0.
        // The label appears just outside vertex 0 as a reminder.
        Points.moveUp(handles[0], 38, wrapLabel)
        wrapLabel.value = rA > rB ? "↺ wrap" : ""
    }, true)
}