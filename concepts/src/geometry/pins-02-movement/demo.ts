// @name Movement
// @category Geometry
// @group Pins

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins, Circles, Svg, type RvgGroup, type Pin
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const startOrigin  = [400, 300]
const startTip     = [580, 300]
const moveDistance = 90
const moveStep     = 60
const dotRadius    = 6
const labelOffset  = 18
const buttonW      = 140
const buttonH      = 34
const buttonGap    = 10
const buttonBottomY = 60

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-pins-movement-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "White handle: change direction · Buttons: move the pin",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Source pin ───────────────────────────────────────────────────
    // The tip handle controls direction only.  Position is moved
    // exclusively via the buttons below.
    const hTip = canvas.handles.disk("handle-tip", startTip)

    const pin = canvas.values.pin(startOrigin)
    Pins.withLength(pin, moveDistance, pin)

    // When hTip is dragged, re-orient the pin toward it.
    Reactive.do([hTip], () => {
        Pins.alignToSegment(pin, Pins.getPosition(pin), hTip, pin)
        Pins.withLength(pin, moveDistance, pin)
    })


    // ─── Source arrow ─────────────────────────────────────────────────
    const sourceShaft = canvas.visuals.segment("source-shaft")
    const sourceDot   = canvas.visuals.circle("source-tip")

    Reactive.do([pin], () => {
        const tip = Pins.moveForward(pin, 1)
        Points.copy(pin, sourceShaft.at(0))
        Points.copy(tip, sourceShaft.at(1))
        Circles.circleAt(tip, dotRadius, sourceDot)
    })

    // ─── Derived positions ────────────────────────────────────────────
    buildDerivedArrow(canvas, pin, "moveForward",
        p => Pins.moveForward(p, moveDistance),  "forward",  labelOffset)

    buildDerivedArrow(canvas, pin, "moveBackward",
        p => Pins.moveBackward(p, moveDistance), "backward", -labelOffset)

    buildDerivedArrow(canvas, pin, "moveLeft",
        p => Pins.moveLeft(p, moveDistance),     "left",     -labelOffset)

    buildDerivedArrow(canvas, pin, "moveRight",
        p => Pins.moveRight(p, moveDistance),    "right",    labelOffset)

    // ─── Move buttons ─────────────────────────────────────────────────
    const actions = [
        { label: "moveForward",  apply: () => { Pins.moveForward(pin,  moveStep, pin);  } },
        { label: "moveBackward", apply: () => { Pins.moveBackward(pin, moveStep, pin);  } },
        { label: "moveLeft",     apply: () => { Pins.moveLeft(pin,     moveStep, pin);  } },
        { label: "moveRight",    apply: () => { Pins.moveRight(pin,    moveStep, pin);  } },
    ]

    actions.forEach(({ label, apply }, i) => {
        const btn      = canvas.visuals.box("button")
        const btnLabel = canvas.text.label(label, "button-label")

        Reactive.do([rvg.frame], () => {
            const bottom  = Points.midPoint(
                Boxes.bottomSide(rvg.frame).at(0),
                Boxes.bottomSide(rvg.frame).at(1)
            )
            const base    = Points.moveUp(bottom, buttonBottomY)
            const xOffset = (i - (actions.length - 1) / 2) * (buttonW + buttonGap)
            const center  = xOffset >= 0
                ? Points.moveRight(base, xOffset)
                : Points.moveLeft(base, -xOffset)
            Boxes.centeredBox(center, buttonW, buttonH, btn)
            Points.copy(center, btnLabel)
        })

        Svg.get(btn).addEventListener("click", apply)
    })
}

// ─── Helper ───────────────────────────────────────────────────────────────
function buildDerivedArrow(
    canvas:      RvgGroup,
    pin:         Pin,
    labelText:   string,
    derive:      (p: Pin) => ReturnType<typeof Pins.moveForward>,
    cls:         string,
    labelYShift: number
) {
    const shaft = canvas.visuals.segment(`${cls}-shaft`)
    const label = canvas.text.label(labelText, `${cls}-label`)

    Reactive.do([pin], () => {
        const dest = derive(pin)
        Points.copy(pin,  shaft.at(0))
        Points.copy(dest, shaft.at(1))
        if (labelYShift >= 0) {
            Points.moveDown(dest, labelYShift, label)
        } else {
            Points.moveUp(dest, -labelYShift, label)
        }
    })
}