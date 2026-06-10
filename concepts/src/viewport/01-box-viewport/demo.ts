// @name Box Viewport
// @category Viewports

import {VisQuill, Reactive, Boxes, Symbols, Fits, Points, Segments} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Number of diamond shapes scattered across the content world.
const shapeCount = 25

// World-space area in which shapes are placed (pixels).
const worldSize = 600

// Size range for the scattered diamond shapes.
const minShapeSize = 10
const maxShapeSize = 28

// Inset between the container edge and the viewport boundary.
const viewportInset = 40

// Padding inside the viewport boundary when fitting content.
const fitPadding = 20

/**
 * Demonstrates a rectangular clipping viewport.
 *
 * Identical in structure to the Circle Viewport demo, but the clip
 * region is an axis-aligned rectangle instead of a circle.  Compare
 * the two side-by-side to see how little changes: the boundary shape,
 * the fitting function, and the rim visual — everything else is the same.
 *
 * - Drag inside the rectangle to pan.
 * - Scroll (or pinch) to zoom.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-viewport-box-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag to pan · Scroll to zoom",

        "instructions"
    )
    Reactive.do([rvg.frame],()=>{
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)),25,instructions)
    })

    // ─── Box viewport ─────────────────────────────────────────────────
    // Creates a viewport whose clip region is an axis-aligned rectangle.
    // Compare with viewports.circle() in the Circle Viewport demo —
    // the API is identical apart from the boundary shape.
    const viewport = canvas.viewports.box({ panning: true, zooming: true })
    const content = viewport.content
    const frame   = viewport.frame

    // ─── Boundary rim ─────────────────────────────────────────────────
    // The rim lives on the frame layer so it is always visible,
    // regardless of how far the user has panned or zoomed.
    const rim = frame.visuals.box("rim")

    // ─── Content shapes ───────────────────────────────────────────────
    // Scatter diamonds across the world space.  Shapes near the edge of
    // the rectangle demonstrate clipping; shapes in the centre render
    // normally.  Positions are deterministic so the layout is stable
    // across reloads.
    for (let i = 0; i < shapeCount; i++) {
        const x    = (i * 197 + 50) % worldSize
        const y    = (i * 313 + 30) % worldSize
        const size = minShapeSize + (i * 7) % (maxShapeSize - minShapeSize)

        Symbols.diamond(
            [x, y],
            size,
            content.visuals.rectangle("shape")
        )
    }


    // ─── Reactive boundary sizing ─────────────────────────────────────
    // Shrink the container frame by a fixed inset to produce the
    // rectangular viewport boundary, then mirror it to the visible rim.
    //
    // Compare with the Circle Viewport demo, which uses
    // Boxes.inscribeCircle() here instead.
    Reactive.do([rvg.frame], () => {
        Boxes.inflate(rvg.frame, -viewportInset, -viewportInset, viewport.boundary)
        Boxes.copy(viewport.boundary, rim)
    })

    // ─── Content fitting ──────────────────────────────────────────────
    // Fit the bounding box of all content into the rectangle, leaving
    // `fitPadding` pixels of breathing room.
    //
    // The only change from the circle demo is Fits.boxInBox() instead
    // of Fits.boxInCircle().
    Reactive.do([rvg.frame], () => {
        Fits.boxInBox(
            content.getVisualBoundingBox(),
            Boxes.inflate(viewport.boundary, -fitPadding, -fitPadding),
            viewport.origin
        )
    })
}