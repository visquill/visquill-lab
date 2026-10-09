// @name Basics
// @category Reactions
// @group Reactive
import {VisQuill, Reactive, Points, Attach} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout constants ─────────────────────────────────────────────────────
const trackY    = 300                // vertical centre of the track
const trackLeft = 120                // left edge of draggable range
const trackRight = 880               // right edge of draggable range
const labelOffsetAbove = 40          // reading above a handle, mid label below the midpoint
const labelOffsetBelow = 28          // name below a handle

/**
 * Entry point.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-reactive-basics-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Track ────────────────────────────────────────────────────────────
    const track = canvas.visuals.segment("track",[trackLeft, trackY], [trackRight, trackY])

    // ─── Handles A (red) and B (blue), snapped to the track ──────────────
    const handleA = canvas.handles.disk("handle-a", [300, trackY])
    const handleB = canvas.handles.disk("handle-b", [700, trackY])
    Reactive.do([handleA], () => {
        Points.closestPointOnSegment(handleA, track, handleA)
    })
    Reactive.do([handleB], () => {
        Points.closestPointOnSegment(handleB, track, handleB)
    })

    // Name below each handle, live reading above it
    const labelA = canvas.text.label("A", "name")
    Attach.pointToPoint(labelA, handleA, {offset: [0, labelOffsetBelow]})
    const readingA = canvas.text.label("", "reading")
    Attach.pointToPoint(readingA, handleA, {offset: [0, -labelOffsetAbove]})

    const labelB = canvas.text.label("B", "name")
    Attach.pointToPoint(labelB, handleB, {offset: [0, labelOffsetBelow]})
    const readingB = canvas.text.label("", "reading")
    Attach.pointToPoint(readingB, handleB, {offset: [0, -labelOffsetAbove]})

    // ─── Midpoint (green), derived from both handles ─────────────────────
    const mid = canvas.visuals.point("midpoint")
    const midLabel = canvas.text.label("", "midpoint-label")
    Attach.pointToPoint(midLabel, mid, {offset: [0, labelOffsetAbove]})

    // One sender: runs when handle A moves
    Reactive.do([handleA], () => {
        readingA.value = "x = " + Math.round(handleA.x)
    })
    Reactive.do([handleB], () => {
        readingB.value = "x = " + Math.round(handleB.x)
    })

    // Two senders: runs when either handle moves
    Reactive.do([handleA, handleB], () => {
        Points.midPoint(handleA, handleB, mid)
        midLabel.value = "mid = " + Math.round(mid.x)
    })
}
