//@name Waveform
//@category Animations

// Demonstrates one-shot shape morph animations using Animate.morph.
// A polyline cycles through signal waveforms — flat, sine, square, sawtooth —
// each transition using easing that matches the character of the target shape.

import {VisQuill, Animate, Reactive, Vectors, type Point} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const VERTICES  = 64       // resolution of the waveform
const WIDTH     = 400      // total horizontal span in canvas units
const AMPLITUDE = 80       // max vertical displacement

// ─── Pose helper ──────────────────────────────────────────────────────────
// Samples a function f(t) where t runs 0→1 across the width.
// x is fixed per vertex; only y varies between poses.
function pose(f: (t: number) => number): Point[] {
    return Array.from({ length: VERTICES }, (_, i) => {
        const t = i / (VERTICES - 1)
        return { x: t * WIDTH, y: f(t) }
    })
}

// ─── Poses ────────────────────────────────────────────────────────────────
const flat     = pose(_t => 0)
const sine     = pose(t  => -Math.sin(t * Math.PI * 4) * AMPLITUDE)
const square   = pose(t  => (Math.sin(t * Math.PI * 4) >= 0 ? -1 : 1) * AMPLITUDE)
const sawtooth = pose(t  => ((t * 4) % 1 - 0.5) * AMPLITUDE * 2)

const poses = [flat, sine, square, sawtooth, flat]

type Step = { duration: number; easing: (t: number) => number }

const steps: Step[] = [
    { duration: 1200, easing: Animate.easeInOutSine  },  // flat   → sine
    { duration:  600, easing: Animate.easeInOutCubic },  // sine   → square
    { duration:  900, easing: Animate.easeInCubic    },  // square → sawtooth
    { duration: 1000, easing: Animate.easeInOutSine  },  // sawtooth → flat
]

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("waveform-")

    // Centre the waveform on the canvas
    Vectors.copy([100, 200], canvas.anchor)

    // ─── Shape ────────────────────────────────────────────────────────────
    const waveform = canvas.visuals.polyline("wave", flat)

    // ─── Baseline ─────────────────────────────────────────────────────────
    canvas.visuals.segment("baseline", [0, 0], [WIDTH, 0])

    // ─── State machine ────────────────────────────────────────────────────
    // Each state morphs to the next pose, then advances on completion.
    const state = canvas.values.real(0)

    Reactive.do([state], () => {
        const idx = state.value % steps.length
        const { duration, easing } = steps[idx]
        console.log("state"+idx)

        Animate.morph(waveform, poses[idx + 1], duration, {
            easing,
            onComplete: () => { state.value += 1 }
        })
    })
}