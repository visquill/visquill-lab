//@name Clock
//@category Animations

// A clock whose hands are positions on circles. Each hand is driven by one
// reactive Real, the fraction of a full turn, which Animate.real.eased moves
// forward every second.

import {VisQuill, Animate, Reactive, Circles, Segments, EasingFunctions, type Real} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const CX = 240, CY = 200
const FACE_R = 120
const HR_LEN = 58, MIN_LEN = 85, SEC_LEN = 100
const TAIL_LEN = 15

// A circle through 12, 3 and 6 o'clock. Circles.pointAt(dial, 0) is then
// 12 o'clock and ratios run clockwise, so a fraction of a turn is directly a
// position on the dial. Ratios outside [0, 1] wrap around.
function dial(radius: number) {
    return Circles.circle3P([CX, CY - radius], [CX + radius, CY], [CX, CY + radius])
}

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("clock-")

    // ─── Face ─────────────────────────────────────────────────────────────
    Circles.circleAt([CX, CY], FACE_R, canvas.visuals.circle("face"))

    // Tick marks: major at 12/3/6/9, minor elsewhere
    const rim = dial(FACE_R)
    const majorStart = dial(FACE_R - 16)
    const minorStart = dial(FACE_R - 8)
    for (let i = 0; i < 12; i++) {
        const major = i % 3 === 0
        canvas.visuals.segment(
            major ? "tick-major" : "tick-minor",
            Circles.pointAt(major ? majorStart : minorStart, i / 12),
            Circles.pointAt(rim, i / 12)
        )
    }

    // ─── Hands ────────────────────────────────────────────────────────────
    // A hand runs from a short tail opposite its tip (ratio + 0.5) to the tip.
    function hand(style: string, length: number, turn: Real) {
        const segment = canvas.visuals.segment(style)
        const tip = dial(length)
        const tail = dial(TAIL_LEN)
        Reactive.do([turn], () => {
            Segments.segment(Circles.pointAt(tail, turn.value + 0.5), Circles.pointAt(tip, turn), segment)
        })
    }

    const now = new Date()
    const s = now.getSeconds()
    const m = now.getMinutes() + s / 60
    const h = (now.getHours() % 12) + m / 60

    const secTurn = canvas.values.real(s / 60)
    const minTurn = canvas.values.real(m / 60)
    const hrTurn  = canvas.values.real(h / 12)

    hand("hour", HR_LEN, hrTurn)
    hand("minute", MIN_LEN, minTurn)
    hand("second", SEC_LEN, secTurn)

    // Centre cap on top of the hands
    canvas.visuals.point("cap", {x: CX, y: CY})

    // ─── Tick ─────────────────────────────────────────────────────────────
    // Every second each hand moves on by its share of a turn. The values only
    // grow, so the second hand never runs backwards when it passes 12.
    setInterval(() => {
        Animate.real.eased(secTurn, secTurn.value + 1 / 60, 300, {
            easing: EasingFunctions.easeOutBack
        })
        Animate.real.eased(minTurn, minTurn.value + 1 / 3600, 900, {
            easing: EasingFunctions.easeInOutSine
        })
        Animate.real.eased(hrTurn, hrTurn.value + 1 / 43200, 900, {
            easing: EasingFunctions.easeInOutSine
        })
    }, 1000)
}
