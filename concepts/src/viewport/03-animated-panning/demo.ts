// @name Animated Panning
// @category Viewports

import {
    VisQuill, Reactive, Boxes, Circles, Symbols, Fits,
    Svg, Rectangles, Viewports, Animate,
    Points, Segments, type RvgRectangle
} from "@visquill/visquill-gdk"
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


// Duration of the pan animation in milliseconds.
const panDuration = 500

// Radius of the centre-point marker on the frame layer.
const centerMarkerRadius = 6

/**
 * Demonstrates animated viewport panning.
 *
 * Builds on the Box Viewport demo: the same rectangular clipping region
 * with pan and zoom, but now every shape is clickable.  Clicking a shape
 * smoothly animates the viewport so that the shape ends up centred in
 * the visible area.
 *
 * The key additions compared to the Box Viewport demo:
 *  - `Svg.get()` to attach DOM click handlers to content shapes.
 *  - `Viewports.panPointTo()` to compute a target origin that centres
 *    a given world-space point in the viewport.
 *  - `Animate.pin.easedAt()` to transition smoothly to that origin.
 *
 * - Drag inside the rectangle to pan.
 * - Scroll (or pinch) to zoom.
 * - Click any diamond to centre on it.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-viewport-panning-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Click any shape to pan · Drag to pan · Scroll to zoom",
        "instructions"
    )
    Reactive.do([rvg.frame],()=>{
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)),25,instructions)
    })
    // ─── Box viewport ─────────────────────────────────────────────────
    // Same setup as the Box Viewport demo: a rectangular clip region
    // with panning and zooming enabled.
    const viewport = canvas.viewports.box({ panning: true, zooming: true })
    const content = viewport.content
    const frame   = viewport.frame

    // ─── Boundary rim ─────────────────────────────────────────────────
    const rim = frame.visuals.box("rim")

    // ─── Centre marker ────────────────────────────────────────────────
    // A small dot on the frame layer marking the viewport centre — the
    // point that clicked shapes will be panned to.  It sits on the
    // frame so it never moves with the content.
    const centerMarker = frame.visuals.circle("center-marker")

    // ─── Content shapes ───────────────────────────────────────────────
    // Same deterministic scatter as the earlier viewport demos, but
    // each shape is stored so we can attach click handlers below.
    const shapes: RvgRectangle[] = []

    for (let i = 0; i < shapeCount; i++) {
        const x    = (i * 197 + 50) % worldSize
        const y    = (i * 313 + 30) % worldSize
        const size = minShapeSize + (i * 7) % (maxShapeSize - minShapeSize)

        const shape =  content.visuals.rectangle("shape")
        Symbols.diamond([x, y], size, shape)
        shapes.push(shape)
    }

    // ─── Reactive boundary sizing ─────────────────────────────────────
    Reactive.do([rvg.frame], () => {
        Boxes.inflate(rvg.frame, -viewportInset, -viewportInset, viewport.boundary)
        Boxes.copy(viewport.boundary, rim)
        Circles.circleAt(Boxes.center(viewport.boundary), centerMarkerRadius, centerMarker)
    })

    // ─── Initial content fitting ──────────────────────────────────────
    // Fit all shapes into the viewport once on load.  Unlike the Box
    // Viewport demo this is not reactive — the user takes over via
    // click-to-pan and manual drag/zoom from here on.
    Fits.boxInBox(content.getVisualBoundingBox(), viewport.boundary, viewport.origin)

    // ─── Click-to-pan handlers ────────────────────────────────────────
    // For each shape:
    //  1. Get its SVG element with Svg.get() to attach a DOM listener.
    //  2. Find its centre from its bounding box.
    //  3. On click, compute a target origin that would place that
    //     centre at the viewport's visual centre.
    //  4. Animate to the target with an eased transition.
    for (const shape of shapes) {
        const svg    = Svg.get(shape)
        const center = Boxes.center(Rectangles.boundingBox(shape))

        svg.addEventListener("click", () => {
            const vCenter = Boxes.center(viewport.boundary)
            const target  = Viewports.panPointTo(viewport.origin, center, vCenter)
            Animate.pin.easedAt(viewport.origin, target, vCenter, panDuration)
        })
    }
}