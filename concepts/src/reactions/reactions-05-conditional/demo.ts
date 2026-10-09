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
    const segment = canvas.visuals.segment("segment", handleA, handleB)

    // ─── Threshold ring around the probe ──────────────────────────────
    const thresholdRing = canvas.visuals.circle("threshold-ring")

    // ─── Probe handle ─────────────────────────────────────────────────
    const probe    = canvas.handles.disk("probe", probePos)
    const probeSvg = Svg.get(probe)

    // ─── Closest point on the segment + connector to the probe ────────
    const closest      = canvas.visuals.point("closest-dot")
    const connector    = canvas.visuals.segment("connector", probe, closest)
    const connectorSvg = Svg.get(connector)
    const distance     = canvas.values.real()

    // ─── Status and distance labels ───────────────────────────────────
    const statusLabel   = canvas.text.label("", "status-label")
    const distLabel     = canvas.text.label("", "dist-label")
    const statusSvg     = Svg.get(statusLabel)

    // Position the status label in the upper-centre area.
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 70, statusLabel)
    })

    // ─── Reactive block — the conditional ────────────────────────────
    Reactive.do([handleA, handleB, probe], () => {
        Points.closestPointOnSegment(probe, segment, closest)
        Points.distanceToSegment(probe, segment, distance)
        Circles.circleAt(probe, threshold, thresholdRing)

        Points.moveRight(Points.midPoint(probe, closest), 14, distLabel)
        distLabel.value = `${Math.round(distance.value)} px`

        // The condition is one line; the rest writes different values
        // into the same visuals.
        const isNear = distance.value < threshold

        probeSvg.style.fill        = isNear ? "#e04040" : "#f7a020"
        connectorSvg.style.opacity = isNear ? "1"       : "0.25"
        statusLabel.value          = isNear ? "NEAR — within threshold" : "FAR — outside threshold"
        statusSvg.style.fill       = isNear ? "#e04040" : "#aaa"
    }, true)
}