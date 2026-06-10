// @name Bars Along a Polyline
// @category Reactions
// @group Attach

import {
    VisQuill, Reactive, Attach, Points, Boxes, Segments
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const barWidth = 28

// One handle per polyline vertex — drag any to reshape the path.
const handlePositions: [number, number][] = [
    [120, 370], [240, 280], [360, 360], [500, 240],
    [640, 350], [760, 250], [880, 340],
]

// Bar heights — vary so the result looks like a chart.
const barHeights = [80, 130, 65, 155, 95, 140, 70]

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-attach-bars-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    const instructions = canvas.text.label(
        "Drag any handle to reshape the polyline",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Draggable polyline ───────────────────────────────────────────
    const handles  = handlePositions.map(([x, y]) => canvas.handles.disk("polyline-handle", [x, y]))
    const polyline = canvas.visuals.polyline("path",handles)
    Reactive.linkVertices(polyline)
    // ─── rectanglesAlongPolyline ──────────────────────────────────────
    // One bar per segment. Each bar's height is a reactive Real so it
    // can be driven by data or animated independently.
    // The bar grows perpendicularly from the polyline at each segment.
    const bars = barHeights.map(h => {
        const bar = canvas.visuals.rectangle("bar")
        const val = canvas.values.real(h)
        Attach.rectangleHeightToValue(bar, val, { side: "left" })
        return bar
    })

    Attach.rectanglesAlignedAlongPolyline(bars, polyline, {
        barWidth,
        align: "center",
        distance:          0,
    })

    canvas.text.labelAt(
        "rectanglesAlongPolyline — one bar per segment, growing perpendicularly",
        { x: 500, y: 450 },
        "section-label"
    )

    // ─── rectanglesAlignedAlongPolyline ───────────────────────────────
    // The simplified API: same geometry but alignment is expressed as
    // "left", "right", or "center" instead of explicit anchor positions.
    // Shown below with a fixed offset so both are visible.
    const barsAligned = barHeights.map(h => {
        const bar = canvas.visuals.rectangle("bar-aligned")
        const val = canvas.values.real(h * 0.5)
        Attach.rectangleHeightToValue(bar, val, { side: "right" })
        return bar
    })

    Attach.rectanglesAlignedAlongPolyline(barsAligned, polyline, {
        barWidth,
        align:    "right",
        distance: 4,
    })

    canvas.text.labelAt(
        "rectanglesAlignedAlongPolyline — align: \"right\", distance: 4",
        { x: 500, y: 475 },
        "section-label-sub"
    )
}