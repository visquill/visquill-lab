// @name Basics
// @category Geometry
// @group Pins

import {
    VisQuill, Reactive, Boxes, Segments, Points, Pins, Svg, Circles
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const startPosition = [500, 300]
const initialLength = 80
const moveStep      = 30   // pixels per move button click
const buttonW       = 120
const buttonH       = 34
const buttonGap     = 8
const buttonsPerRow = 4
const buttonRowGap  = 10
const buttonBottomY = 130  // distance up from bottom for the first row
const infoLeft      = 20   // x offset for the info panel
const infoTop       = 55   // y offset from top for the first info line
const infoLineH     = 20   // vertical spacing between info lines

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-pins-basics-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the handle to move the pin · Click buttons to transform its orientation",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Pin ──────────────────────────────────────────────────────────
    const disk = canvas.visuals.circle("handle")
    disk.zIndex.value = 10
    const pin = canvas.values.pin(startPosition)
    Pins.withLength(pin, initialLength, pin)

    // ─── Arrow visuals ────────────────────────────────────────────────
    const shaft = canvas.visuals.segment("arrow-shaft")

    Reactive.do([pin], () => {
        const forward = Pins.moveForward(pin, Pins.len(pin))
        Points.copy(pin,     shaft.at(0))
        Points.copy(forward, shaft.at(1))
        Circles.circleAt(pin,10,disk)
    })

    // ─── Info labels (top-left) ───────────────────────────────────────
    // Fixed to the top-left corner of the canvas, not attached to the pin.
    const labelX     = canvas.text.label("", "info-label")
    const labelY     = canvas.text.label("", "info-label")
    const labelDX     = canvas.text.label("", "info-label")
    const labelDY     = canvas.text.label("", "info-label")
    const labelAngle = canvas.text.label("", "info-label")
    const labelLen   = canvas.text.label("", "info-label")

    // Position labels relative to the frame top-left corner.
    Reactive.do([rvg.frame], () => {
        const tl = Boxes.topSide(rvg.frame).at(0)
        Points.moveRight(Points.moveDown(tl, infoTop + 0 * infoLineH), infoLeft, labelX)
        Points.moveRight(Points.moveDown(tl, infoTop + 1 * infoLineH), infoLeft, labelY)
        Points.moveRight(Points.moveDown(tl, infoTop + 2 * infoLineH), infoLeft, labelDX)
        Points.moveRight(Points.moveDown(tl, infoTop + 3 * infoLineH), infoLeft, labelDY)
        Points.moveRight(Points.moveDown(tl, infoTop + 4 * infoLineH), infoLeft, labelAngle)
        Points.moveRight(Points.moveDown(tl, infoTop + 5 * infoLineH), infoLeft, labelLen)
    })

    // Update label text whenever the pin changes.
    Reactive.do([pin], () => {
        const pos = Pins.getPosition(pin)
        const dir = Pins.getOrientation(pin)
        const deg = (Pins.angle(pin).value * 180 / Math.PI).toFixed(1)
        labelX.value     = `x: ${pos.x.toFixed(1)}`
        labelY.value     = `y: ${pos.y.toFixed(1)}`
        labelDX.value     = `dir-x: ${dir.x.toFixed(1)}`
        labelDY.value     = `dir-y: ${dir.y.toFixed(1)}`
        labelAngle.value = `angle: ${deg}°`
        labelLen.value   = `length: ${Pins.len(pin).value.toFixed(1)}`
    })

    // ─── Buttons ──────────────────────────────────────────────────────
    // Row 0 — rotation & flip
    // Row 1 — scale & length
    // Row 2 — movement along orientation axes
    const actions: { label: string; apply: () => void }[] = [
        { label: "rotateLeft",   apply: () => Pins.rotateLeft(pin, pin)                 },
        { label: "rotateRight",  apply: () => Pins.rotateRight(pin, pin)                },
        { label: "rotateBy 45°", apply: () => Pins.rotateBy(pin, Math.PI / 4, pin)     },
        { label: "reverse",      apply: () => Pins.reverse(pin, pin)                    },
        { label: "flipX",        apply: () => Pins.flipX(pin, pin)                      },
        { label: "flipY",        apply: () => Pins.flipY(pin, pin)                      },
        { label: "scaleBy 1.5",  apply: () => Pins.scaleBy(pin, 1.5, pin)              },
        { label: "resetLength",  apply: () => Pins.withLength(pin, initialLength, pin)  },
        { label: "moveForward",  apply: () => Pins.moveForward(pin, moveStep, pin)      },
        { label: "moveBackward", apply: () => Pins.moveBackward(pin, moveStep, pin)     },
        { label: "moveLeft",     apply: () => Pins.moveLeft(pin, moveStep, pin)         },
        { label: "moveRight",    apply: () => Pins.moveRight(pin, moveStep, pin)        },
    ]

    actions.forEach(({ label, apply }, i) => {
        const row = Math.floor(i / buttonsPerRow)
        const col = i % buttonsPerRow
        const cl = label.startsWith("move") ? "button-move" : "button";
        const btn      = canvas.visuals.box(cl)
        const btnLabel = canvas.text.label(label, "button-label")

        Reactive.do([rvg.frame], () => {
            const bottom  = Points.midPoint(
                Boxes.bottomSide(rvg.frame).at(0),
                Boxes.bottomSide(rvg.frame).at(1)
            )
            const rowBase = Points.moveUp(bottom, buttonBottomY + row * (buttonH + buttonRowGap))
            const xOffset = (col - (buttonsPerRow - 1) / 2) * (buttonW + buttonGap)
            const center  = xOffset >= 0
                ? Points.moveRight(rowBase, xOffset)
                : Points.moveLeft(rowBase, -xOffset)
            Boxes.centeredBox(center, buttonW, buttonH, btn)
            Points.copy(center, btnLabel)
        })

        Svg.get(btn).addEventListener("click", () => {
            apply()
        })
    })
}