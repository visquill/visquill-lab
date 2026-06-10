//@name Clock
//@category Animations

// Demonstrates time-driven animation using Animate.real.eased.
// Three clock hands rotate at different speeds, each with distinct easing:
// the second hand ticks with overshoot, the minute hand glides, and the
// hour hand creeps almost imperceptibly.

import {VisQuill, Animate, Reactive, Vectors, Pins, EasingFunctions} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const CX = 240, CY = 200
const FACE_R = 120
const HR_LEN = 58, MIN_LEN = 85, SEC_LEN = 100

// Converts a fraction of a full revolution (0 = 12 o'clock) to a
// standard angle where −π/2 points up in SVG coordinates.
function clockAngle(fraction: number): number {
    return -Math.PI / 2 + fraction * Math.PI * 2
}

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("clock-")

    // ─── Face ─────────────────────────────────────────────────────────────
    const rimPts = Array.from({length: 72}, (_, i) => {
        const a = (i / 72) * Math.PI * 2
        return {x: CX + Math.cos(a) * FACE_R, y: CY + Math.sin(a) * FACE_R}
    })
    canvas.visuals.polygon("face", rimPts)

    // Tick marks — major at 12/3/6/9, minor elsewhere
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        const major = i % 3 === 0
        const r0 = major ? FACE_R - 16 : FACE_R - 8
        canvas.visuals.segment(
            major ? "tick-major" : "tick-minor",
            [CX + Math.cos(a) * r0, CY + Math.sin(a) * r0],
            [CX + Math.cos(a) * FACE_R, CY + Math.sin(a) * FACE_R]
        )
    }

    // ─── Hands ────────────────────────────────────────────────────────────
    // Each hand is a layer with its anchor at the clock centre.
    // A segment along the local +x axis is rotated by updating the
    // layer anchor's orientation via Pins.withOrientation.

    const hourLayer = canvas.layer()
    Vectors.copy([CX, CY], hourLayer.anchor)
    hourLayer.visuals.segment("hour", [0, 0], [HR_LEN, 0])

    const minLayer = canvas.layer()
    Vectors.copy([CX, CY], minLayer.anchor)
    minLayer.visuals.segment("minute", [0, 0], [MIN_LEN, 0])

    const secLayer = canvas.layer()
    Vectors.copy([CX, CY], secLayer.anchor)
    secLayer.visuals.segment("second", [-15, 0], [SEC_LEN, 0])

    // Centre cap on top of the hands
    canvas.visuals.point("cap", {x: CX, y: CY})

    // ─── Reactive angles ──────────────────────────────────────────────────
    // Three reactive Reals hold the current angle of each hand.
    // Angles accumulate (never wrap) so the second hand doesn't snap
    // backward when crossing 12.

    const now = new Date()
    const s = now.getSeconds()
    const m = now.getMinutes() + s / 60
    const h = (now.getHours() % 12) + m / 60

    const secAngle = canvas.values.real(clockAngle(s / 60))
    const minAngle = canvas.values.real(clockAngle(m / 60))
    const hrAngle  = canvas.values.real(clockAngle(h / 12))

    // Sync each hand's visual orientation to its angle value
    Reactive.do([secAngle], () => {
        Pins.withOrientation(secLayer.anchor, Vectors.fromAngle(secAngle), secLayer.anchor)
    })
    Reactive.do([minAngle], () => {
        Pins.withOrientation(minLayer.anchor, Vectors.fromAngle(minAngle), minLayer.anchor)
    })
    Reactive.do([hrAngle], () => {
        Pins.withOrientation(hourLayer.anchor, Vectors.fromAngle(hrAngle), hourLayer.anchor)
    })

    // ─── Tick ─────────────────────────────────────────────────────────────
    // Every second, advance each angle and animate it to the new value.
    // The second hand uses easeOutBack for a mechanical tick with overshoot;
    // minute and hour hands glide with easeInOutSine.

    setInterval(() => {
        Animate.real.eased(secAngle, secAngle.value + Math.PI / 30, 300, {
            easing: EasingFunctions.easeOutBack
        })
        Animate.real.eased(minAngle, minAngle.value + Math.PI / 1800, 900, {
            easing: EasingFunctions.easeInOutSine
        })
        Animate.real.eased(hrAngle, hrAngle.value + Math.PI / 21600, 900, {
            easing: EasingFunctions.easeInOutSine
        })
    }, 1000)
}