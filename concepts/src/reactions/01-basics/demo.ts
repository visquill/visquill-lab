// @name Basics
// @category Reactions

import {VisQuill, Reactive, Points, Attach} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout constants ─────────────────────────────────────────────────────
const trackY    = 300                // vertical centre of the track
const trackLeft = 120                // left edge of draggable range
const trackRight = 880               // right edge of draggable range
const labelOffsetAbove = 40          // how far above the track the reading sits
const labelOffsetBelow = 28          // how far below the track the name sits

/**
 * Entry point.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-reactive-basics-")
    const canvas = rvg.canvas

    // ─── Track ────────────────────────────────────────────────────────────
    const track = canvas.visuals.segment("track",[trackLeft, trackY], [trackRight, trackY])

    // ─── Handle A (red) ───────────────────────────────────────────────────
    const handleA = canvas.handles.disk("handle-a",[300, trackY])
    Reactive.do([handleA], () => {
        Points.closestPointOnLine(handleA, track, handleA) // snap point to track-line
    })
    // Static name label — position is fixed relative to the initial handle spot;
    // we don't need it to move because the reading label above already conveys
    // the live value.  A name label just identifies which handle is which.
    const labelA = canvas.text.label("A", "name")
    Attach.pointToPoint(labelA,handleA,{offset: [0,labelOffsetBelow]})

    // Live reading label — this is what Reactive.do will update
    const readingA = canvas.text.labelAt("x = 300", [300, trackY - labelOffsetAbove], "reading")

    // ─── Handle B (blue) ──────────────────────────────────────────────────
    const handleB = canvas.handles.disk( "handle-b",[700, trackY])
    Reactive.do([handleB], () => {
        Points.closestPointOnLine(handleB, track, handleB) // snap point to track-line
    })
    const labelB = canvas.text.label("B","name" )
    Attach.pointToPoint(labelB,handleB,{offset: [0,labelOffsetBelow]})

    const readingB = canvas.text.labelAt("x = 700", [700, trackY - labelOffsetAbove], "reading")

    // ─── Midpoint (green) ─────────────────────────────────────────
    const mid = canvas.visuals.point("midpoint")
    const midLabel = canvas.text.label("", "midpoint-label")

    Attach.pointToPoint(midLabel,mid,{offset: [0,labelOffsetAbove]})
    // ─── Reactive.do #1 — single sender, handle A ────────────────────────
    // Fires whenever handleA moves.  Reads handleA.x, updates the label.
    // This is the simplest possible use of Reactive.do.
    Reactive.do([handleA], () => {
        readingA.value = "x = " + Math.round(handleA.x)
    })

    // ─── Reactive.do #2 — single sender, handle B ────────────────────────
    // Identical in structure to #1, just for the other handle.
    Reactive.do([handleB], () => {
        readingB.value = "x = " + Math.round(handleB.x)
    })

    // ─── Reactive.do #3 — two senders, derived value ─────────────────────
    // This is the interesting one.  Both handleA and handleB are in the
    // senders array.  The callback fires whenever *either* one changes.
    // Inside it we compute the midpoint from both current positions and
    // reposition the diamond + label.  This is the standard pattern for
    // any value that depends on multiple reactive sources.
    Reactive.do([handleA, handleB], () => {
        Points.midPoint(handleA,handleB,mid)
        midLabel.value = "mid = " + Math.round(mid.x)
    })
}

