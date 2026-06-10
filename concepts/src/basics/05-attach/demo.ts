// @name Attach
// @category Basics

// Introduces the Attach namespace: declarative one-line bindings that keep
// one element positioned relative to another.  No Reactive.do needed.
// Drag any handle to see everything follow automatically.

import {
    VisQuill, Attach, Reactive, Circles, Boxes, Points, Segments,
    Symbols,
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const ROW1_Y     = 150
const ROW2_Y     = 330
const ROW3_Y     = 480
const COL_X      = [200, 500, 800]

/**
 * Introduces the Attach namespace with five focused panels.
 *
 * Each panel shows one Attach function in isolation so the effect is clear.
 *
 * Row 1 — point to point, point to segment
 * Row 2 — rectangle to segment, circle to circle
 * Row 3 — layer anchor (a whole group follows a handle)
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-basics-attach-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag any handle — Attach keeps everything positioned automatically",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ═════════════════════════════════════════════════════════════════════
    // 1. pointToPoint — a label that follows a handle with a fixed offset
    // ═════════════════════════════════════════════════════════════════════
    {
        const handle = canvas.handles.disk("handle", [COL_X[0], ROW1_Y])

        // follower is a plain point value that always sits 40 px above the handle.
        const follower = canvas.values.point()
        Attach.pointToPoint(follower, handle, { offset: { x: 0, y: -40 } })

        // The label is attached to the follower, not directly to the handle.
        // This shows that Attach targets can themselves be Attach targets.
        const label = canvas.text.label("follows", "follower-label")
        Attach.pointToPoint(label, follower)

        canvas.visuals.segment("connector", handle, follower)
        canvas.text.labelAt("pointToPoint(target, source, { offset })", [COL_X[0], ROW1_Y + 65], "api-label")
    }

    // ═════════════════════════════════════════════════════════════════════
    // 2. pointToSegment — a pin locked to the midpoint of a segment
    // ═════════════════════════════════════════════════════════════════════
    {
        const hA  = canvas.handles.disk("handle", [COL_X[1] - 80, ROW1_Y])
        const hB  = canvas.handles.disk("handle", [COL_X[1] + 80, ROW1_Y])
        const seg = canvas.visuals.segment("segment", hA, hB)

        // midPin always sits at the centre of the segment.
        // No Reactive.do required — Attach handles the subscription.
        const midPin = canvas.values.pin()
        Attach.pointToSegment(midPin, seg)     // default position: "center"

        const diamond = Symbols.diamond(midPin, 14, canvas.visuals.rectangle("midpoint-diamond"))
        Attach.shapeToPoint(diamond, midPin)

        canvas.text.labelAt("pointToSegment(pin, seg)  ← midpoint", [COL_X[1], ROW1_Y + 65], "api-label")
    }

    // ═════════════════════════════════════════════════════════════════════
    // 3. rectangleToSegment — a bar that spans and tracks a segment
    // ═════════════════════════════════════════════════════════════════════
    {
        const hA  = canvas.handles.disk("handle", [COL_X[0] - 80, ROW2_Y])
        const hB  = canvas.handles.disk("handle", [COL_X[0] + 80, ROW2_Y])
        const seg = canvas.visuals.segment("segment", hA, hB)

        const bar = canvas.visuals.rectangle("bar")
        Attach.rectangleToSegment(bar, 28, seg, { distance: 18, side: "right" })

        canvas.text.labelAt("rectangleToSegment(bar, height, seg)", [COL_X[0], ROW2_Y + 65], "api-label")
    }

    // ═════════════════════════════════════════════════════════════════════
    // 4. circleToCircle — an outer ring that maintains a fixed gap
    // ═════════════════════════════════════════════════════════════════════
    {
        const radiusHandle = canvas.handles.disk("handle", [COL_X[1] + 35, ROW2_Y])

        const inner = canvas.visuals.circle("inner-circle")
        const outer = canvas.visuals.circle("outer-circle")

        Attach.circleCenterToPoint(inner, canvas.values.point([COL_X[1], ROW2_Y]))

        Reactive.do([radiusHandle], () => {
            const r = Math.max(12, Points.distanceToPoint({ x: COL_X[1], y: ROW2_Y }, radiusHandle).value)
            Attach.circleRadiusToValue(inner, r)
        })

        // The outer circle is 20 px larger than the inner at all times.
        Attach.circleToCircle(outer, inner, 20)

        canvas.text.labelAt("circleToCircle(outer, inner, gap: 20)", [COL_X[1], ROW2_Y + 65], "api-label")
    }

    // ═════════════════════════════════════════════════════════════════════
    // 5. layer anchor — a whole group follows a single handle
    // ═════════════════════════════════════════════════════════════════════
    {
        const handle = canvas.handles.disk("handle-anchor", [500, ROW3_Y])

        // Attaching the anchor of a layer group is identical to attaching any
        // other point. Everything drawn on the layer rides along with it.
        const group = canvas.layer("group-")
        Attach.pointToPoint(group.anchor, handle)

        // These shapes are in local coordinates — they don't know where the
        // layer is on the canvas. The anchor position determines that.
        group.visuals.box("group-box", [-60, -20], [60, 20])
        group.text.labelAt("whole group", [0, 0], "group-label")

        const leftDot  = group.visuals.circle("group-dot")
        const rightDot = group.visuals.circle("group-dot")
        Circles.circleAt([-60, 0], 7, leftDot)
        Circles.circleAt([ 60, 0], 7, rightDot)

        canvas.text.labelAt(
            "pointToPoint(group.anchor, handle)  — the whole layer follows",
            [500, ROW3_Y + 55],
            "api-label"
        )
    }
}