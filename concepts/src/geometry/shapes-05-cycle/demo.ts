// @name Cycle By
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Boxes, Segments, Points,  type Box,
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
 * The highlighted dot marks vertex 0.  Drag the slider to shift the
 * offset; the dot jumps to the new starting vertex so the effect is
 * immediately visible.  The shape itself does not move or change shape.
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
    const vertexDots   = arrowVertices.map(() => canvas.visuals.point("vertex-dot"))
    const vertex0Dot   = canvas.visuals.point("vertex-zero")
    const vertex0Label = canvas.text.label("0", "vertex-zero-label")
    const offsetLabel  = canvas.text.label("offset: 0", "offset-label")

    // ─── Slider ───────────────────────────────────────────────────────
    const track = canvas.visuals.box("slider-track")
    const thumb = canvas.handles.disk("slider-thumb", [cx - sliderMargin, cy])

    // ─── Base shape (created once, outside reactive blocks) ───────────
    const base = canvas.shapes.polygon(arrowVertices)

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

        // Constrain thumb to track.
        thumb.y = trackY
        thumb.x = Math.max(trackLeftX, Math.min(trackRightX, thumb.x))

        // Map thumb position → discrete integer offset.
        const t      = (thumb.x - trackLeftX) / (trackRightX - trackLeftX)
        const offset = Math.round(t * (vertexCount - 1))

        // Snap thumb to the nearest discrete stop.
        thumb.x = trackLeftX + (offset / (vertexCount - 1)) * (trackRightX - trackLeftX)

        // Cycle the shape and draw it.
        Shapes.copy(Shapes.cycleBy(base, offset), arrow)

        // All vertex dots at their fixed geometric positions.
        arrowVertices.forEach((pos, i) =>
            Points.copy({ x: pos[0], y: pos[1] }, vertexDots[i])
        )

        // Vertex 0 highlight — index `offset` in the original array.
        const v0pos = arrowVertices[offset % vertexCount]
        Points.copy({ x: v0pos[0], y: v0pos[1] }, vertex0Dot)
        Points.moveUp({ x: v0pos[0], y: v0pos[1] }, 18, vertex0Label)

        // Offset readout centred above the track.
        offsetLabel.value = `offset: ${offset}`
        Points.copy({ x: midX, y: trackY - 24 }, offsetLabel)
    }, true)
}