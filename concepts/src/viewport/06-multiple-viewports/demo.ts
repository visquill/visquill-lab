// @name Nested Viewports
// @category Viewports

import {
    VisQuill, Reactive, Boxes, Circles, Symbols, Fits,
    Svg, Animate, Points, Segments,
    type RvgGroup
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Number of diamond shapes inside each child viewport.
const shapesPerChild = 15

// World-space area for shapes inside each child viewport.
const childWorldSize = 400

// Size range for the scattered diamond shapes.
const minShapeSize = 8
const maxShapeSize = 22

// Inset between the container edge and the parent viewport boundary.
const parentInset = 30

// Extra inset at the bottom to make room for the button.
const bottomInset = 80

// Padding inside each child viewport when fitting content.
const childFitPadding = 20

// Padding inside the parent viewport when fitting the child grid.
const parentFitPadding = 20

// Grid layout: spacing between child viewport centres and their sizes.
const gridSpacing = 300
const childBoxSize = 200
const childCircleRadius = 100

// Duration of the fit animation in milliseconds.
const fitDuration = 600

// Button dimensions.
const buttonWidth = 200
const buttonHeight = 40
const buttonBottomOffset = 50

/**
 * Demonstrates nested viewports.
 *
 * A parent box viewport contains four child viewports arranged in a
 * 2×2 checkerboard: box viewports at top-left and bottom-right, circle
 * viewports at top-right and bottom-left.  Each child has its own content, boundary, and
 * origin — and its own independent pan and zoom.
 *
 * A "Fit All" button below the parent viewport triggers an animated fit
 * of every viewport: each child fits its shapes into its boundary, and
 * the parent fits the child grid into its own boundary.
 *
 * This demo brings together concepts from all previous viewport demos:
 *  - Box and circle viewports (from the first two demos)
 *  - Animated origin changes (from Animated Panning / Focus), here
 *    with `Animate.pin.eased()`
 *  - `Fits.boxInBox()` and `Fits.boxInCircle()` returning target pins
 *
 * The new concept is **nesting**: child viewports are created on the
 * parent's `content` layer, so they pan and zoom with the parent while
 * maintaining their own independent pan/zoom internally.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-viewport-nested-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Pan & zoom the parent or any child independently · Click Fit All to reset",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 20, instructions)
    })

    // ─── Parent viewport ──────────────────────────────────────────────
    // The outermost viewport — everything else lives inside its content.
    const viewport = canvas.viewports.box({ panning: true, zooming: true })
    const content  = viewport.content
    const frame    = viewport.frame

    const rim = frame.visuals.box("parent-rim")

    // ─── Child viewports (2×2 checkerboard) ───────────────────────────
    // Collect fit functions for each viewport so the button can trigger
    // them all at once.
    const fitFunctions: (() => void)[] = []

    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const isBox = (row + col) % 2 === 0

            if (isBox) {
                buildBoxChild(content, row, col, fitFunctions)
            } else {
                buildCircleChild(content, row, col, fitFunctions)
            }
        }
    }

    // ─── Parent fit function ──────────────────────────────────────────
    // Fits the bounding box of all four children into the parent
    // viewport with padding and animation.
    fitFunctions.push(() => {
        const target = Fits.boxInBox(
            content.getVisualBoundingBox(),
            Boxes.inflate(viewport.boundary, -parentFitPadding, -parentFitPadding)
        )
        Animate.pin.eased(viewport.origin, target, fitDuration)
    })

    // ─── Reactive parent boundary ─────────────────────────────────────
    Reactive.do([rvg.frame], () => {
        Boxes.pad(rvg.frame, -parentInset, -parentInset, -parentInset, -bottomInset, viewport.boundary)
        Boxes.copy(viewport.boundary, rim)
    })

    // ─── Initial fit ──────────────────────────────────────────────────
    // Run all fit functions once on load so everything starts nicely
    // fitted.
    fitFunctions.forEach(f => f())

    // ─── Fit All button ───────────────────────────────────────────────
    // A labelled button below the parent viewport that re-triggers the
    // animated fit for every viewport.
    const button = canvas.visuals.box("button")
    const buttonLabel = canvas.text.label("Fit All", "button-label")

    Reactive.do([rvg.frame], () => {
        const bottom = Boxes.bottomSide(rvg.frame)
        const mid    = Points.moveUp(
            Points.midPoint(bottom.at(0), bottom.at(1)),
            buttonBottomOffset
        )
        Boxes.centeredBox(mid, buttonWidth, buttonHeight, button)
        Points.copy(mid, buttonLabel)
    })

    Svg.get(button).addEventListener("click", () => {
        fitFunctions.forEach(f => f())
    })
}

// ─── Child builders ───────────────────────────────────────────────────────

/**
 * Creates a box child viewport at the given grid position, populates it
 * with shapes, adds a rim and label, and pushes a fit function.
 */
function buildBoxChild(
    parent:       RvgGroup,
    row:          number,
    col:          number,
    fitFunctions: (() => void)[]
) {
    const child = parent.viewports.box({ panning: true, zooming: true })

    // Position and size the child boundary in the parent's coordinate space.
    Boxes.centeredBox(
        [col * gridSpacing, row * gridSpacing],
        childBoxSize, childBoxSize,
        child.boundary
    )

    // Rim on the child's frame layer.
    const childRim = child.frame.visuals.box("child-rim-box")
    Boxes.copy(child.boundary, childRim)

    // Label on the child's frame layer identifying the viewport type.
    const label = child.frame.text.label("Box", "child-label")
    Points.copy(Boxes.center(child.boundary), label)

    // Scatter shapes inside the child.
    fillWithShapes(child.content, row * 2 + col)

    // Animated fit: shrink the boundary by padding, compute a target
    // origin, and ease to it.
    fitFunctions.push(() => {
        const target = Fits.boxInBox(
            child.content.getVisualBoundingBox(),
            Boxes.inflate(child.boundary, -childFitPadding, -childFitPadding)
        )
        Animate.pin.eased(child.origin, target, fitDuration)
    })
}

/**
 * Creates a circle child viewport at the given grid position, populates
 * it with shapes, adds a rim and label, and pushes a fit function.
 */
function buildCircleChild(
    parent:       RvgGroup,
    row:          number,
    col:          number,
    fitFunctions: (() => void)[]
) {
    const child = parent.viewports.circle({ panning: true, zooming: true })

    // Position and size the child boundary.
    Circles.circleAt(
        [col * gridSpacing, row * gridSpacing],
        childCircleRadius,
        child.boundary
    )

    // Rim on the child's frame layer.
    const childRim = child.frame.visuals.circle("child-rim-circle")
    Circles.copy(child.boundary, childRim)

    // Label on the child's frame layer.
    const label = child.frame.text.label("Circle", "child-label")
    Points.copy(Circles.center(child.boundary), label)

    // Scatter shapes inside the child.
    fillWithShapes(child.content, row * 2 + col)

    // Animated fit into the circular boundary.
    fitFunctions.push(() => {
        const target = Fits.boxInCircle(
            child.content.getVisualBoundingBox(),
            Circles.inflate(child.boundary, -childFitPadding)
        )
        Animate.pin.eased(child.origin, target, fitDuration)
    })
}

/**
 * Fills a content group with deterministic diamond shapes.
 *
 * The `seed` parameter offsets the position formula so each child
 * viewport gets a different arrangement.
 */
function fillWithShapes(content: RvgGroup, seed: number) {
    for (let i = 0; i < shapesPerChild; i++) {
        const n    = seed * 100 + i
        const x    = (n * 197 + 50) % childWorldSize
        const y    = (n * 313 + 30) % childWorldSize
        const size = minShapeSize + (n * 7) % (maxShapeSize - minShapeSize)

        Symbols.diamond(
            [x, y],
            size,
            content.visuals.rectangle("shape")
        )
    }
}