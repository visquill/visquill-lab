// @name Reactive Values
// @category Reactions
// @group Reactive

// Demonstrates that plain values — not just handles — are reactive sources.
// Clicking a button increments a counter; every downstream label and shape
// updates automatically because they depend on that one value.

import { VisQuill, Reactive, Boxes, Points, Segments, Svg } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx           = 500          // horizontal centre of the canvas
const counterY     = 220          // vertical position of the counter display
const barMaxHeight = 140          // height of the bar at count = MAX_COUNT
const barWidth     = 80
const barBaseY     = 420          // y of the bar's bottom edge
const buttonY      = 500          // y of the button row
const buttonW      = 120
const buttonH      = 36
const buttonGap    = 20
const MAX_COUNT    = 10           // bar fills completely at this value

/**
 * Demonstrates reactive plain values.
 *
 * A single `canvas.values.real` holds the counter.  Three completely
 * separate `Reactive.do` blocks each subscribe to it and update a
 * different part of the UI — the number label, the progress bar, and
 * the status text — without any of them knowing about each other.
 * Clicking + or − writes one line: `count.value += 1`.  Everything
 * else follows automatically.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-reactive-values-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Click + and − to change the counter · watch three independent blocks react",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── The reactive value ───────────────────────────────────────────
    // This is the only source of truth.  Writing to count.value is all
    // it takes to trigger every Reactive.do block that lists it as a
    // dependency.
    const count = canvas.values.real(0)

    // ─── Block 1 — number display ─────────────────────────────────────
    // Fires whenever count changes.  Reads count.value, formats it, and
    // writes it to a label.  Nothing else: no geometry, no shapes.
    const numberLabel = canvas.text.labelAt("0", [cx, counterY], "counter-number")

    Reactive.do([count], () => {
        numberLabel.value = String(Math.round(count.value))
    })

    // ─── Block 2 — progress bar ───────────────────────────────────────
    // Also fires whenever count changes, independently of block 1.
    // Maps the counter to a rectangle height so the bar grows and shrinks
    // as the count rises and falls.
    canvas.visuals.box("bar-bg",
        [cx - barWidth / 2, barBaseY - barMaxHeight],
        [cx + barWidth / 2, barBaseY]
    )
    const bar = canvas.visuals.box("bar")

    Reactive.do([count], () => {
        const ratio  = Math.max(0, Math.min(1, count.value / MAX_COUNT))
        const height = ratio * barMaxHeight
        Boxes.spannedBox(
            { x: cx - barWidth / 2, y: barBaseY - height },
            { x: cx + barWidth / 2, y: barBaseY },
            bar
        )
    })

    // ─── Block 3 — status text ────────────────────────────────────────
    // A third independent subscriber. Shows a context-sensitive message
    // based on the current count — demonstrating that reactive callbacks
    // are plain JS and can contain any logic.
    const statusLabel = canvas.text.labelAt("", [cx, counterY + 50], "status")

    Reactive.do([count], () => {
        const n = Math.round(count.value)
        if      (n === 0)         statusLabel.value = "press + to start"
        else if (n >= MAX_COUNT)  statusLabel.value = "maximum reached"
        else if (n === 1)         statusLabel.value = "1 step taken"
        else                      statusLabel.value = `${n} steps taken`
    })

    // ─── Buttons ──────────────────────────────────────────────────────
    // Writing count.value is all the buttons ever do.
    // The three Reactive.do blocks above handle the rest.

    const btnPlus  = canvas.visuals.box("button")
    const btnMinus = canvas.visuals.box("button-minus")
    const btnReset = canvas.visuals.box("button-reset")
    const lblPlus  = canvas.text.labelAt("+",     [cx - buttonW - buttonGap, buttonY], "button-label")
    const lblMinus = canvas.text.labelAt("−",     [cx,                       buttonY], "button-label")
    const lblReset = canvas.text.labelAt("reset", [cx + buttonW + buttonGap, buttonY], "button-label")

    Reactive.do([rvg.frame], () => {
        const mid = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        const base = Points.moveUp(mid, Boxes.height(rvg.frame).value - buttonY)

        const cPlus  = Points.moveLeft( base, buttonW + buttonGap)
        const cMinus = base
        const cReset = Points.moveRight(base, buttonW + buttonGap)

        Boxes.centeredBox(cPlus,  buttonW, buttonH, btnPlus)
        Boxes.centeredBox(cMinus, buttonW, buttonH, btnMinus)
        Boxes.centeredBox(cReset, buttonW, buttonH, btnReset)

        Points.copy(cPlus,  lblPlus)
        Points.copy(cMinus, lblMinus)
        Points.copy(cReset, lblReset)
    })

    Svg.get(btnPlus).addEventListener("click", () => {
        if (count.value < MAX_COUNT) count.value += 1
    })
    Svg.get(btnMinus).addEventListener("click", () => {
        if (count.value > 0) count.value -= 1
    })
    Svg.get(btnReset).addEventListener("click", () => {
        count.value = 0
    })
}