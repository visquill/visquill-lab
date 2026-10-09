// @name Orientate
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points, Vectors,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 420
const cy = 300

// The arrow shape: an asymmetric rightward-pointing arrow defined in
// local space centred around the origin, then translated to canvas centre.
// The notch and tail make orientation immediately readable.
const arrowVertices: [number, number][] = [
    [  80,   0 ],   // tip
    [  10,  40 ],   // upper shoulder
    [  10,  18 ],   // upper notch
    [ -60,  18 ],   // upper tail
    [ -60, -28 ],   // lower tail
    [  10, -28 ],   // lower notch
    [  10, -40 ],   // lower shoulder
].map(([x, y]) => [cx + x, cy + y])

// Initial source orientation: pointing right (+x).
const sourceOrientationStart: [number, number] = [cx + 120, cy]
// Initial target orientation: pointing right as well (no rotation at start).
const targetOrientationStart: [number, number] = [cx + 120, cy - 100]

/**
 * Demonstrates `Shapes.orientate()` — rotating a shape so that one
 * direction aligns with another.
 *
 * The shape rotates around a fixed anchor.  A white handle sets the
 * *source* orientation (the shape's "forward" direction) and a purple
 * handle sets the *target* direction.  `orientate()` rotates the shape
 * so the source aligns with the target.
 *
 * Drag the target handle in a circle to spin the shape.  Move the
 * source handle to redefine what "forward" means for the shape.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-shapes-orientate-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the target handle · Shape rotates to align source → target",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Base shape (ghost) ───────────────────────────────────────────
    // Shows the original unrotated shape as a faint reference.
    canvas.visuals.polygon("ghost", arrowVertices)

    // ─── Transformed shape ────────────────────────────────────────────
    const arrow = canvas.visuals.polygon("arrow")

    // ─── Anchor point (rotation centre) ───────────────────────────────
    const anchor = canvas.visuals.point("anchor", [cx, cy])

    // ─── Source orientation handle ────────────────────────────────────
    // White handle — defines the shape's "forward" direction.
    const hSource = canvas.handles.disk("handle-source", sourceOrientationStart)

    // ─── Target orientation handle ────────────────────────────────────
    // Purple handle — defines where forward should end up pointing.
    const hTarget = canvas.handles.disk("handle-target", targetOrientationStart)

    // ─── Orientation lines ────────────────────────────────────────────
    // Dashed lines from anchor to each handle so the directions are visible.
    const sourceAxis = canvas.visuals.segment("axis-source")
    const targetAxis = canvas.visuals.segment("axis-target")

    // ─── Labels ───────────────────────────────────────────────────────
    const sourceLabel = canvas.text.label("source", "axis-label-source")
    const targetLabel = canvas.text.label("target", "axis-label-target")
    const angleLabel  = canvas.text.label("", "angle-label")

    // ─── Reactive block ───────────────────────────────────────────────
    Reactive.do([hSource, hTarget], () => {
        // Source and target orientation vectors (anchor → handle).
        const srcDir = Vectors.direction(anchor, hSource)
        const tgtDir = Vectors.direction(anchor, hTarget)

        // Angle between them for the label, clockwise on screen, in (-180°, 180°].
        let delta = Vectors.angleTo(srcDir, tgtDir, true).value * 180 / Math.PI
        if (delta > 180) delta -= 360

        // orientate() rotates the shape around anchor so srcDir → tgtDir.
        Shapes.orientate(arrowVertices, anchor, srcDir, tgtDir, arrow)

        // Axis lines.
        Points.copy(anchor,  sourceAxis.at(0))
        Points.copy(hSource, sourceAxis.at(1))
        Points.copy(anchor,  targetAxis.at(0))
        Points.copy(hTarget, targetAxis.at(1))

        // Labels at handle ends.
        Points.moveUp(hSource, 16, sourceLabel)
        Points.moveUp(hTarget, 16, targetLabel)

        // Angle readout near anchor.
        Points.moveDown(anchor, 28, angleLabel)
        angleLabel.value = `${delta.toFixed(1)}°`
    }, true)
}