// @name Circle Viewport
// @category Viewports

import {VisQuill, Reactive, Boxes, Circles, Symbols, Fits, Segments, Points} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Number of diamond shapes scattered across the content world.
const shapeCount = 25

// World-space area in which shapes are placed (pixels).
const worldSize = 600

// Size range for the scattered diamond shapes.
const minShapeSize = 10
const maxShapeSize = 28

// Padding inside the viewport boundary when fitting content.
const fitPadding = 20

/**
 * Demonstrates a circular clipping viewport.
 *
 * All content placed inside the viewport is clipped to a circle whose size
 * tracks the container.  Panning and zooming let the user navigate the
 * content world while the clipping boundary stays fixed on screen.
 *
 * - Drag inside the circle to pan.
 * - Scroll (or pinch) to zoom.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-viewport-circle-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag to pan · Scroll to zoom",
        "instructions"
    )
    Reactive.do([rvg.frame],()=>{
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)),25,instructions)
    })

    // ─── Circular viewport ────────────────────────────────────────────
    // Creates a viewport whose clip region is a circle.  Content drawn
    // inside `viewport.content` is masked to that circle; anything on
    // `viewport.frame` sits on top, unclipped.
    const viewport = canvas.viewports.circle({ panning: true, zooming: true })
    const content = viewport.content
    const frame   = viewport.frame

    // ─── Boundary rim ─────────────────────────────────────────────────
    // The rim lives on the frame layer so it is always visible,
    // regardless of how far the user has panned or zoomed.
    const rim = frame.visuals.circle("rim")

    // ─── Content shapes ───────────────────────────────────────────────
    // Scatter diamonds across the world space.  Shapes near the edge of
    // the circle demonstrate clipping; shapes in the centre render
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
    // Whenever the container resizes, inscribe the largest circle that
    // fits inside the frame and mirror its geometry to the visible rim.
    Reactive.do([rvg.frame], () => {
        Boxes.inscribeCircle(Boxes.inflate(rvg.frame,-40,-40), viewport.boundary)
        Circles.copy(viewport.boundary, rim)
    })

    // ─── Content fitting ──────────────────────────────────────────────
    // Fit the bounding box of all content into the circle, leaving
    // `fitPadding` pixels of breathing room.
    Reactive.do([rvg.frame], () => {
        Fits.boxInCircle(
            content.getVisualBoundingBox(),
            Circles.inflate(viewport.boundary, -fitPadding),
            viewport.origin
        )
    })
}