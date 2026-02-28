// @name Attachments
// @category Reactions

import {VisQuill, Attach, Reactive, Symbols} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Starting positions for the two segment endpoints.
const startA = [250, 250]
const startB = [750, 400]

// How far the green follower dot is offset from endpoint A.
const followerOffset = [0, -30]

// How far the orange dot is pushed away from the segment, perpendicularly.
const offsetDistance = 50

// Height of the blue rectangle that spans the segment.
const rectangleHeight = 40
const rectangleDistance = 50

/**
 * Entry point.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-attach-basics-")
    const canvas = rvg.canvas

    // ─── Segment & endpoint handles ───────────────────────────────────────
    // The handles are the source of truth for position.  The segment's
    // vertices are bound to the handles so dragging an endpoint pulls
    // the segment (and everything attached to it) along.
    const handleA = canvas.handles.disk("handle", startA)
    const handleB = canvas.handles.disk("handle", startB)
    handleA.zIndex.value = 1
    handleB.zIndex.value = 1

    // The segment itself — vertices bound to the two handles
    const seg = canvas.visuals.segment("segment", handleA, handleB)
    Reactive.linkVertices(seg)

    // ─── 1. pointToPoint with offset ──────────────────────────────────────
    // A small green dot that follows endpoint A but is shifted upward by a
    // fixed vector.  This is the simplest Attach: one point tracks another,
    // optionally displaced.
    const follower = canvas.values.point()
    Attach.pointToPoint(follower, handleA, {offset: followerOffset})
    const followerSymbol = Symbols.circle(follower, 10, canvas.visuals.circle("follower"))
    Attach.shapeToPoint(followerSymbol, follower)

    // ─── 2. pinToSegment — centre (default position) ─────────────────────
    // A pin placed at the midpoint of the segment.  No position option is
    // given, so it defaults to "center".  The red diamond sits exactly
    // halfway between the two endpoints at all times.
    const midPin = canvas.values.pin()
    Attach.pointToSegment(midPin, seg)  // position defaults to "center"
    const midSymbol = Symbols.diamond(midPin, 15, canvas.visuals.rectangle("midpoint"))
    Attach.shapeToPoint(midSymbol, midPin, {orientation: "relative", orientateInitially: true})

    // ─── 3. pinToSegment — fixed ratio ────────────────────────────────────
    // Same idea, but position is set to 0.25 — the pin lands one-quarter of
    // the way from endpoint A to endpoint B.
    const ratioPin = canvas.values.pin()
    Attach.pointToSegment(ratioPin, seg, {position: 0.25})
    const ratioSymbol = Symbols.diamond(ratioPin, 10, canvas.visuals.rectangle("ratio-pin"))
    Attach.shapeToPoint(ratioSymbol, ratioPin)

    // ─── 4. pinToSegment — perpendicular offset ──────────────────────────
    // The pin is at the centre again, but pushed `offsetDistance` pixels to
    // the left of the segment (perpendicular to its direction).  "Left" is
    // defined relative to the direction from endpoint A → endpoint B.
    const offsetPin = canvas.values.pin()
    Attach.pointToSegment(offsetPin, seg, {position: "center", distance: offsetDistance, side: "left"})
    const offsetSymbol = Symbols.diamond(offsetPin, 10, canvas.visuals.rectangle("offset-pin"))
    Attach.shapeToPoint(offsetSymbol, offsetPin)

    // ─── 5. rectangleToSegment ────────────────────────────────────────────
    // A rectangle whose baseline spans the entire segment.  It grows
    // perpendicularly by `rectangleHeight`.  The rectangle is created with
    // zero initial geometry; rectangleToSegment sets up the reactive binding
    // that keeps it aligned as the segment moves.
    const bar = canvas.visuals.rectangle("bar")
    Attach.rectangleToSegment(bar, rectangleHeight, seg, {distance: rectangleDistance, side: "right", paddingLeft: 50, paddingRight: 100})

    // ─── Labels ───────────────────────────────────────────────────────────
    // Each label is anchored to the thing it describes via pointToPoint, so
    // it moves with its target automatically — no fixed positions needed.
    const labelFollower = canvas.text.label("pointToPoint + offset", "label")
    Attach.pointToPoint(labelFollower, handleA, {offset: [followerOffset[0], followerOffset[1] - 18]})

    const labelMid = canvas.text.label("pointToSegment (center)", "label")
    Attach.pointToPoint(labelMid, midPin, {offset: [0, -20]})

    const labelRatio = canvas.text.label("pointToSegment (pos 0.25)", "label")
    Attach.pointToPoint(labelRatio, ratioPin, {offset: [0, 20]})

    const labelOffset = canvas.text.label("pointToSegment (distance)", "label")
    Attach.pointToPoint(labelOffset, offsetPin, {offset: [0, -20]})
}