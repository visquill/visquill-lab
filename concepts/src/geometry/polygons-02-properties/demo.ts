// @name Properties
// @category Geometry
// @group Polygons

import {VisQuill, Reactive, Polygons, Points, Segments, Boxes} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Centre and initial radius of the polygon.
const cx             = 280
const cy             = 310
const polygonRadius  = 150
const vertexCount    = 6

// X positions for the metrics panel (key column and value column).
const metricKeyX   = 590
const metricValueX = 870

// Y positions for each row in the metrics panel.
const rowMeasurementsTitle = 105
const rowArea              = 150
const rowPerimeter         = 195
const rowOrientedArea      = 240
const rowPropertiesTitle   = 305
const rowWinding           = 350
const rowConvexity         = 395

// ─── Initial vertex positions (regular hexagon) ───────────────────────────
// Vertex 0 is at the top; vertices increase clockwise in screen space.
// The "0" marker on vertex 0 shows where the boundary traversal starts,
// which is important for understanding the winding direction readout.
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
 * Demonstrates polygon property calculations.
 *
 * A six-vertex polygon with draggable handles.  As you reshape it, a
 * live metrics panel shows area, perimeter, oriented area, winding
 * direction, and convexity.
 *
 * Things to try:
 *  - Drag a vertex inward past the centre to make the polygon concave
 *    and watch convexity toggle.
 *  - Cross two edges (make the polygon self-intersect) to see the
 *    oriented area change sign.
 *  - Pull vertices to reverse the overall winding direction.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polygon-properties-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1
    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag vertices · Push inward for concave · Cross edges to flip winding",
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
    // Vertex 0 uses a distinct style to mark the start of the boundary
    // traversal — the direction from vertex 0 onward defines winding.
    const handles = initialVertices.map((pos, i) =>
        canvas.handles.disk(i === 0 ? "vertex-first" : "vertex", pos)
    )

    // A "0" label follows vertex 0 to remind the user where the
    // polygon's boundary begins.
    const v0Label = canvas.text.label("0", "vertex-index")
    Reactive.do([handles[0]], () => {
        Points.moveUp(handles[0], 20, v0Label)
    })

    // ─── Polygon visual ───────────────────────────────────────────────
    const polygon = canvas.visuals.polygon("polygon")

    // ─── Centroid marker ──────────────────────────────────────────────
    // A dot at the polygon's centre of mass.  For a convex polygon it
    // always stays inside; for a concave one it can wander toward a
    // "waist" in the shape.
    const centroid      = canvas.visuals.point("centroid")
    const centroidLabel = canvas.text.label("centroid", "centroid-label")

    // ─── Computed values ──────────────────────────────────────────────
    const areaVal         = canvas.values.real()
    const perimeterVal    = canvas.values.real()
    const orientedAreaVal = canvas.values.real()
    const isConvexVal     = canvas.values.bool()
    const isClockwiseVal  = canvas.values.bool()

    // ─── Metrics panel — static keys ─────────────────────────────────
    canvas.text.labelAt("Measurements",  { x: metricKeyX, y: rowMeasurementsTitle }, "section-title")
    canvas.text.labelAt("Area",          { x: metricKeyX, y: rowArea             }, "metric-key")
    canvas.text.labelAt("Perimeter",     { x: metricKeyX, y: rowPerimeter        }, "metric-key")
    canvas.text.labelAt("Oriented area", { x: metricKeyX, y: rowOrientedArea     }, "metric-key")

    canvas.text.labelAt("Properties",   { x: metricKeyX, y: rowPropertiesTitle  }, "section-title")
    canvas.text.labelAt("Winding",      { x: metricKeyX, y: rowWinding          }, "metric-key")
    canvas.text.labelAt("Convexity",    { x: metricKeyX, y: rowConvexity        }, "metric-key")

    // ─── Metrics panel — reactive value labels ────────────────────────
    const areaValueLabel         = canvas.text.labelAt("—", { x: metricValueX, y: rowArea         }, "metric-value")
    const perimeterValueLabel    = canvas.text.labelAt("—", { x: metricValueX, y: rowPerimeter    }, "metric-value")
    const orientedAreaValueLabel = canvas.text.labelAt("—", { x: metricValueX, y: rowOrientedArea }, "metric-value")
    const windingValueLabel      = canvas.text.labelAt("—", { x: metricValueX, y: rowWinding      }, "metric-value")
    const convexityValueLabel    = canvas.text.labelAt("—", { x: metricValueX, y: rowConvexity    }, "metric-value")

    // ─── Reactive measurements ────────────────────────────────────────
    // Whenever any handle moves: rebuild the polygon, recompute all
    // measurements, reposition the centroid, and update the text labels.
    Reactive.do(handles, () => {
        // Rebuild the polygon from the current vertex positions.
        Polygons.polygon(handles, polygon)

        // ── Measurements ──────────────────────────────────────────────
        // area() is always positive regardless of winding.
        // orientedArea() is positive when CCW, negative when CW —
        // making it sensitive to winding in a way that area() is not.
        Polygons.area(polygon,         areaVal)
        Polygons.perimeter(polygon,    perimeterVal)
        Polygons.orientedArea(polygon, orientedAreaVal)

        // ── Properties ────────────────────────────────────────────────
        Polygons.isConvex(polygon,    isConvexVal)
        Polygons.isClockwise(polygon, isClockwiseVal)

        // ── Centroid ──────────────────────────────────────────────────
        Polygons.centroid(polygon, centroid)
        Points.moveUp(centroid, 18, centroidLabel)

        // ── Update text labels ─────────────────────────────────────────
        areaValueLabel.value = `${areaVal.value.toFixed(1)} px²`

        perimeterValueLabel.value = `${perimeterVal.value.toFixed(1)} px`

        const oa  = orientedAreaVal.value
        const sign = oa >= 0 ? "+" : ""
        orientedAreaValueLabel.value = `${sign}${oa.toFixed(1)} px²`

        windingValueLabel.value   = isClockwiseVal.value ? "Clockwise" : "Counter-clockwise"
        convexityValueLabel.value = isConvexVal.value    ? "Convex"    : "Concave"
    }, true)
}