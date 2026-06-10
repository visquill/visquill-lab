// @name Conditional Reactive
// @category Reactions
// @group Reactive

// Demonstrates branching logic inside Reactive.do.
// Two handles define a segment; a third handle is a probe point.
// A single reactive block tests whether the probe is within a threshold
// distance of the segment and switches the visual state accordingly —
// all inside one plain-JS callback.

import { VisQuill, Reactive, Points, Circles, Boxes, Segments, Svg } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const startA    = [180, 300]
const startB    = [820, 300]
const probePos  = [500, 200]
const threshold = 80            // snap distance in pixels

/**
 * Demonstrates conditional logic inside a reactive callback.
 *
 * One `Reactive.do` block watches the segment endpoints and the probe handle.
 * Inside it, an `if/else` branch tests the distance from the probe to the
 * segment, then updates colour, labels, and opacity to match the current state.
 *
 * The key insight: `Reactive.do` callbacks are plain JavaScript.
 * Branching, looping, and any other logic are all fair game inside them.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-reactive-conditional-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the orange probe toward the segment · watch the state switch",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Segment ──────────────────────────────────────────────────────
    const handleA = canvas.handles.disk("handle-endpoint", startA)
    const handleB = canvas.handles.disk("handle-endpoint", startB)
    canvas.visuals.segment("segment", handleA, handleB)

    // ─── Threshold ring (dashed circle around probe showing threshold) ─
    const thresholdRing = canvas.visuals.circle("threshold-ring")

    // ─── Probe handle ─────────────────────────────────────────────────
    const probe    = canvas.handles.disk("probe", probePos)
    const probeSvg = Svg.get(probe)

    // ─── Closest point dot + connector ───────────────────────────────
    // closestDot marks where the perpendicular from the probe meets the segment.
    const closestDot   = canvas.visuals.circle("closest-dot")
    const connector    = canvas.visuals.segment("connector")
    const connectorSvg = Svg.get(connector)

    // ─── Status and distance labels ───────────────────────────────────
    const statusLabel   = canvas.text.label("", "status-label")
    const distLabel     = canvas.text.label("", "dist-label")
    const statusSvg     = Svg.get(statusLabel)

    // Position the status label in the upper-centre area.
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 70, statusLabel)
    })

    // ─── Reactive block — the conditional ────────────────────────────
    // All geometry, distance measurement, and visual switching live here.
    // The branch reads exactly like English: "if near, do X, else do Y".
    Reactive.do([handleA, handleB, probe], () => {
        // Construct a plain segment data object from the handle positions.
        // canvas.shapes.segment is a data constructor, not a reactive node —
        // safe to call inside a Reactive.do.
        const segShape = canvas.shapes.segment(handleA, handleB)
        const center = Circles.center(closestDot)

        // Snap the closest-point dot to the nearest point on the segment.
        Points.closestPointOnSegment(probe, segShape, center)

        // Measure the distance from probe to that closest point.
        const dist = Points.distanceToPoint(probe, center).value

        // Update the dashed connector and threshold ring.
        Points.copy(probe,     connector.at(0))
        Points.copy(center, connector.at(1))
        Circles.circleAt(probe, threshold, thresholdRing)
        Circles.circleAt(center, 6, closestDot)

        // Distance label at the midpoint of the connector.
        Points.moveRight(Points.midPoint(probe, center), 14, distLabel)
        distLabel.value = `${Math.round(dist)} px`

        // ── Branch ────────────────────────────────────────────────────
        // The condition itself is one line.  Everything else is the
        // consequence: writing different values to the same visuals.
        const isNear = dist < threshold

        probeSvg.style.fill        = isNear ? "#e04040" : "#f7a020"
        connectorSvg.style.opacity = isNear ? "1"       : "0.25"
        statusLabel.value          = isNear ? "NEAR — within threshold" : "FAR — outside threshold"
        statusSvg.style.fill       = isNear ? "#e04040" : "#aaa"
    }, true)
}