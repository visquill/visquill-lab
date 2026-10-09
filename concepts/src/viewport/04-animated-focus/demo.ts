// @name Animated Focus
// @category Viewports

import {
    VisQuill, Reactive, Boxes, Circles, Fits,
    Svg, Viewports, Animate, Pins,
    type Pin, Points, Segments, type RvgCircle
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Number of pins scattered across the content world.
const pinCount = 25

// World-space area in which pins are placed (pixels).
const worldSize = 600

// Inset between the container edge and the viewport boundary.
const viewportInset = 40

// Duration of the focus animation in milliseconds.
const focusDuration = 500

// Radius of the centre-point marker on the frame layer.
const centerMarkerRadius = 6

// Multiplier: how far the direction indicator extends from the pin.
const directionLineScale = 20

/**
 * Demonstrates animated viewport focusing with zoom.
 *
 * Builds on the Animated Panning demo but replaces plain shapes with
 * Pins — geometric primitives that carry position, direction, and
 * length.  Clicking a pin animates the viewport so that the pin sits at
 * the centre, points to the right, and is zoomed by its length: a pin
 * of length 2 is shown at zoom 2, a pin of length 0.5 at zoom 0.5.
 *
 * The key change compared to the Animated Panning demo:
 *  - Shapes → Pins with `Pins.withLength()` and `Pins.rotateBy()`.
 *  - `Viewports.panPointTo()` → `Viewports.focusOnScaled()` which
 *    sets pan, zoom, and rotation.
 *
 * - Drag inside the rectangle to pan.
 * - Scroll (or pinch) to zoom.
 * - Click any pin to focus on it.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-viewport-focus-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions =canvas.text.label(
        "Click any pin to focus & zoom · Drag to pan · Scroll to zoom",
        "instructions"
    )
    Reactive.do([rvg.frame],()=>{
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)),25,instructions)
    })

    // ─── Box viewport ─────────────────────────────────────────────────
    // Same rectangular clip as the previous viewport demos.
    const viewport = canvas.viewports.box({ panning: true, zooming: true })
    const content = viewport.content
    const frame   = viewport.frame

    // ─── Boundary rim ─────────────────────────────────────────────────
    const rim = frame.visuals.box("rim")

    // ─── Centre marker ────────────────────────────────────────────────
    // Shows where the viewport centre is — the target of every
    // focus animation.
    const centerMarker = frame.visuals.circle("center-marker")

    // ─── Pins ─────────────────────────────────────────────────────────
    // Each pin has a position, a rotation, and a length.  The length
    // is the zoom level the viewport uses when the pin is clicked:
    // long pins → close zoom, short pins → wide zoom.
    //
    // A small circle marks the pin's position, and a segment extending
    // forward from the pin shows its direction and relative length.
    const pins: { pin: Pin; marker: RvgCircle }[] = []

    for (let i = 0; i < pinCount; i++) {
        const x      = (i * 197 + 50) % worldSize
        const y      = (i * 313 + 30) % worldSize
        const angle  = (i * 2.399) % (Math.PI * 2)
        const length = 0.5 + (i * 7 + 3) % 30 / 10

        // Create the pin and set its rotation and length.
        const pin = content.values.pin([x, y])
        Pins.withLength(Pins.rotateBy(pin, angle), length, pin)

        // Direction indicator — a segment from the pin along its
        // forward direction, scaled by `directionLineScale`.
        content.visuals.segment(
            "direction-line",
            pin,
            Pins.moveForward(pin, length * directionLineScale)
        )

        // Position marker — a small circle at the pin's origin.
        const marker = content.visuals.circleAt("pin-marker", pin, 5)
        pins.push({ pin, marker })
    }

    // ─── Reactive boundary sizing ─────────────────────────────────────
    Reactive.do([rvg.frame], () => {
        Boxes.inflate(rvg.frame, -viewportInset, -viewportInset, viewport.boundary)
        Boxes.copy(viewport.boundary, rim)
        Circles.circleAt(Boxes.center(viewport.boundary), centerMarkerRadius, centerMarker)
    })

    // ─── Initial content fitting ──────────────────────────────────────
    // Fit everything into the viewport once on load.
    Fits.boxInBox(content.getVisualBoundingBox(), viewport.boundary, viewport.origin)

    // ─── Click-to-focus handlers ──────────────────────────────────────
    // Clicking a pin computes a target origin that centres the pin,
    // zooms to the pin's length, and rotates the view so the pin points
    // to the right.  panPointTo() in the Animated Panning demo only
    // changes the pan offset.
    for (const { pin, marker } of pins) {
        const svg = Svg.get(marker)

        svg.addEventListener("click", () => {
            const vCenter = Boxes.center(viewport.boundary)
            const target  = Viewports.focusOnScaled(pin, vCenter)
            Animate.pin.easedAt(viewport.origin, target, vCenter, focusDuration)
        })
    }
}