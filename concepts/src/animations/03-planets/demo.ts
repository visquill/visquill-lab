//@name Orbit
//@category Animations

// Demonstrates point animations using moveTo and followPoint.
// A courier token hops between planets using Animate.moveTo; a ghost trail
// follows it with Animate.followPoint, showing the contrast between
// eased and exponential interpolation in 2D space.

import {VisQuill, Animate, Reactive, Vectors, Attach, type Point} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Planet positions ─────────────────────────────────────────────────────
const PLANETS: Point[] = [
    { x:  120, y:  380 },
    { x:  330, y:  40 },
    { x:  420, y: 200 },
    { x:  260, y: 280 },
    { x:   60, y: 220 },
]

// Duration of each hop in ms
const HOP_DURATION = 1000

// Easing alternates per hop to show that it applies uniformly across both axes
const EASINGS = [
    Animate.easeInOutCubic,
    Animate.linear,
    Animate.easeInOutSine,
    Animate.easeOutCubic,
    Animate.easeInOutSine,
]

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("orbit-")

    // Centre the scene
    Vectors.copy([40, 40], canvas.anchor)

    // ─── State ────────────────────────────────────────────────────────────
    // Integer index into PLANETS; advancing it triggers the next hop
    const state = canvas.values.real(0)


    // ─── Visuals ──────────────────────────────────────────────────────────

    // Planet markers are draggable handles so the path can be reshaped live
    const planets: Point[] = []
    for (let i = 0; i < PLANETS.length; i++) {
        const planet = canvas.handles.disk("planet", PLANETS[i])
        planets.push(planet)
        const label = canvas.text.label(`P${i + 1}`, "planet-label")
        Attach.pointToPoint(label, planet, { offset: { x: 14, y: -14 } })
    }

    // Courier token — rendered on top
    const courier = canvas.visuals.point("courier", PLANETS[0])

    // Ghost token — rendered below the courier
    const ghost = canvas.visuals.point("ghost",PLANETS[0])

    // Dashed line connecting ghost to courier makes the lag tangible
    canvas.visuals.segment("trail", ghost, courier)

    // ─── Sync visuals to data ─────────────────────────────────────────────
    // position drives the courier visual and re-aims the ghost follow each
    // time moveTo writes a new interpolated value into it
    Reactive.do([courier], () => {
        Animate.followPoint(ghost, courier, { alpha: 0.06 })
    })

    // ─── State machine ────────────────────────────────────────────────────
    // Each state animates position to the next planet handle. Because planets
    // are draggable, the courier always aims at their position at hop start.
    Reactive.do([state], () => {
        const idx = state.value % PLANETS.length
        const target = planets[idx]
        const easing = EASINGS[idx]

        Animate.moveTo(courier, target, HOP_DURATION, {
            easing,
            onComplete: () => { state.value += 1 }
        })
    })
}