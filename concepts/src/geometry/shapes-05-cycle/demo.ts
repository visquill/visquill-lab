// @name Cycle By
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points, Pins, type Box,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx = 420
const cy = 290

// Asymmetric arrow — same geometry as the other Shapes demos.
const arrowVertices: [number, number][] = [
    [  80,   0 ],
    [  10,  40 ],
    [  10,  18 ],
    [ -60,  18 ],
    [ -60, -28 ],
    [  10, -28 ],
    [  10, -40 ],
].map(([x, y]) => [cx + x, cy + y])

const vertexCount  = arrowVertices.length
const sliderTrackH = 4
const sliderMargin = 200   // half-width of track from canvas centre

// ─── Helper ───────────────────────────────────────────────────────────────
// Returns the three track geometry values derived from the frame box.
// Called from both reactive blocks so the derivation is never duplicated.
function trackGeometry(frame: Box) {
    const mid        = Segments.midPoint(Boxes.bottomSide(frame))
    const trackLeftX = mid.x - sliderMargin
    const trackRightX= mid.x + sliderMargin
    const trackY     = mid.y - 70
    return { trackLeftX, trackRightX, trackY, midX: mid.x }
}

/**
 * Demonstrates `Shapes.cycleBy()` — cyclically shifting the starting
 * vertex of a shape without changing its geometry.
 *
 * Every vertex is labelled with its index in the cycled shape, and the
 * highlighted dot marks vertex 0.  Drag the slider to shift the offset;
 * the indices rotate around the arrow and the dot jumps to the new
 * starting vertex.  The shape itself does not move or change shape.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-shapes-cycleby-")
    const canvas = rvg.canvas

    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the slider to shift the starting vertex",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Shape and vertex visuals ─────────────────────────────────────
    const arrow        = canvas.visuals.polygon("arrow")
    // All vertex dots at their fixed geometric positions.
    arrowVertices.forEach(pos => canvas.visuals.point("vertex-dot", pos))
    const vertex0Dot   = canvas.visuals.point("vertex-zero")
    // Label i always reads "i"; it is moved to vertex i of the cycled shape.
    const indexLabels  = arrowVertices.map((_, i) =>
        canvas.text.label(String(i), i === 0 ? "vertex-zero-label" : "vertex-index-label")
    )
    const offsetLabel  = canvas.text.label("offset: 0", "offset-label")

    // ─── Slider ───────────────────────────────────────────────────────
    const track = canvas.visuals.box("slider-track")
    const thumb = canvas.handles.disk("slider-thumb", [cx - sliderMargin, cy])

    // ─── Layout reactive — frame resize only ──────────────────────────
    // Repositions the track and constrains the thumb to it.
    Reactive.do([rvg.frame], () => {
        const { trackLeftX, trackRightX, trackY } = trackGeometry(rvg.frame)
        Boxes.spannedBox(
            { x: trackLeftX,  y: trackY - sliderTrackH / 2 },
            { x: trackRightX, y: trackY + sliderTrackH / 2 },
            track
        )
    })

    // ─── Main reactive — thumb or frame changed ───────────────────────
    Reactive.do([thumb, rvg.frame], () => {
        const { trackLeftX, trackRightX, trackY, midX } = trackGeometry(rvg.frame)

        // Constrain thumb to the track's centre line.
        const line = Segments.segment({ x: trackLeftX, y: trackY }, { x: trackRightX, y: trackY })
        Points.closestPointOnSegment(thumb, line, thumb)

        // Map thumb position → discrete integer offset.
        const t      = Points.relativePositionOnSegment(thumb, line).value
        const offset = Math.round(t * (vertexCount - 1))

        // Snap thumb to the nearest discrete stop.
        Points.placeOnSegment(line.at(0), line.at(1), offset / (vertexCount - 1), thumb)

        // Cycle the shape and draw it.
        Shapes.cycleBy(arrowVertices, offset, arrow)

        // Index labels — read from the cycled shape, so they rotate
        // around the arrow as the offset changes.  Each label sits just
        // outside its vertex: a pin from the centre through the vertex,
        // moved 16 px further.
        indexLabels.forEach((label, i) => {
            const pin = Pins.placeAndAlignOnSegment({ x: cx, y: cy }, arrow.at(i), 1)
            Pins.getPosition(Pins.moveForward(pin, 16), label)
        })

        // Vertex 0 highlight — the first vertex of the cycled shape.
        Points.copy(arrow.at(0), vertex0Dot)

        // Offset readout centred above the track.
        offsetLabel.value = `offset: ${offset}`
        Points.copy({ x: midX, y: trackY - 24 }, offsetLabel)
    }, true)
}