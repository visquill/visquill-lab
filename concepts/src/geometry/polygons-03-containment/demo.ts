// @name Contains Point
// @category Geometry
// @group Polygons

import { VisQuill, Reactive, Polygons, Points, Segments, Boxes, Svg } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Centre and initial radius of the polygon.
const cx            = 420
const cy            = 320
const polygonRadius = 170
const vertexCount   = 6

// Initial position of the probe point — starts inside the polygon.
const probeStart: [number, number] = [cx, cy - 50]

// ─── Initial vertex positions (regular hexagon) ───────────────────────────
const initialVertices = Array.from({ length: vertexCount }, (_, i) =>
    Points.placeOnCircle([cx, cy], polygonRadius, (i / vertexCount) * Math.PI * 2 - Math.PI / 2)
)

// Colours applied to the probe depending on inside/outside state.
const colourInside  = '#10b981'
const colourOutside = '#ef4444'

/**
 * Demonstrates point-in-polygon testing alongside boundary distance and
 * closest-point projection.
 *
 * A draggable probe tests three things simultaneously as it moves:
 *  - `containsPoint()` — is the probe inside or outside?
 *  - `closestPoint()` — which point on the boundary is nearest?
 *  - `distanceTo()` — how far is the probe from the boundary?
 *
 * Drag the polygon vertices to reshape it and observe that all three
 * results update together.  Note that `distanceTo` measures distance to
 * the *boundary* regardless of whether the probe is inside or outside;
 * there is no sign flip.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polygon-contains-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the probe inside and outside · Drag vertices to reshape",
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

    // ─── Polygon visual ───────────────────────────────────────────────
    const polygon = canvas.visuals.polygon("polygon")

    // ─── Probe handle ─────────────────────────────────────────────────
    // The probe is the point being tested.  Its colour changes from
    // green (inside) to red (outside) via direct SVG style mutation
    // inside the reactive block.
    const probe    = canvas.handles.disk("probe", probeStart)
    const probeSvg = Svg.get(probe)

    // ─── Closest boundary point ───────────────────────────────────────
    // The red dot that snaps to the nearest point on the polygon edge,
    // connected to the probe by a dashed line.
    const closestPt = canvas.visuals.point("closest-point")
    canvas.visuals.segment("connector", probe, closestPt)

    // ─── Labels ───────────────────────────────────────────────────────
    // Status label floats above the probe; distance label sits at the
    // midpoint of the connector line.
    const statusLabel   = canvas.text.label("", "status-label")
    const distanceLabel = canvas.text.label("", "distance-label")

    // ─── Computed values ──────────────────────────────────────────────
    const distanceVal = canvas.values.real()
    const isInsideVal = canvas.values.bool()

    // ─── Reactive block ───────────────────────────────────────────────
    // Depends on all vertex handles and the probe so any movement
    // triggers a full recompute.
    Reactive.do([...handles, probe], () => {
        // Rebuild the polygon from the current handle positions.
        Polygons.polygon(handles, polygon)

        // ── Closest point on boundary ──────────────────────────────────
        // Always snaps to the nearest edge, regardless of inside/outside.
        Polygons.closestPoint(polygon, probe, closestPt)

        // ── Distance to boundary ───────────────────────────────────────
        // Always non-negative — no sign flip when crossing the boundary.
        Polygons.distanceTo(polygon, probe, distanceVal)

        // ── Inside / outside test ──────────────────────────────────────
        Polygons.containsPoint(polygon, probe, isInsideVal)

        // ── Reposition labels ──────────────────────────────────────────
        Points.moveUp(probe, 24, statusLabel)
        Points.midPoint(probe, closestPt, distanceLabel)

        // ── Update label text ──────────────────────────────────────────
        const inside = isInsideVal.value
        statusLabel.value   = inside ? "Inside" : "Outside"
        distanceLabel.value = `${distanceVal.value.toFixed(1)} px to boundary`

        // ── Update probe colour ────────────────────────────────────────
        probeSvg.style.fill = inside ? colourInside : colourOutside
    }, true)
}