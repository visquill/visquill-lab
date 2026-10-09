//@name Swarm
//@category Animations

// Demonstrates Animate.point.follow with multiple followers at varying alpha.
// An invisible attractor circles a path; twelve follower dots all track it,
// each at a different alpha. The spread between followers visualises directly
// how alpha controls the lag between a point and its target.

import {VisQuill, Animate, Reactive, Circles, EasingFunctions} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Attractor path ───────────────────────────────────────────────────────
// Six waypoints equally spaced around a circle. The attractor hops between
// them in a loop, giving followers a continuously moving target.
const CX = 240, CY = 210, ORBIT_R = 130
const WAYPOINT_COUNT = 6

// ─── Followers ────────────────────────────────────────────────────────────
// Twelve dots. Alpha runs from 0.10 (fast, close to attractor) down to 0.01
// (slow, far behind). Each group of four shares a CSS class for size/opacity.
const FOLLOWER_COUNT = 12
const ALPHA_MAX = 0.10, ALPHA_MIN = 0.01

function followerClass(i: number): string {
    if (i < 4)  return "follower-fast"
    if (i < 8)  return "follower-mid"
    return "follower-slow"
}

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("swarm-")

    // ─── Orbit path hint (faint circle) ───────────────────────────────────
    const orbit = canvas.visuals.circle("orbit")
    Circles.circleAt([CX, CY], ORBIT_R, orbit)
    const waypoints = Array.from({length: WAYPOINT_COUNT}, (_, i) =>
        Circles.pointAt(orbit, i / WAYPOINT_COUNT)
    )

    // ─── Attractor ────────────────────────────────────────────────────────
    // Invisible point that drives all followers. CSS sets r:0.
    const attractor = canvas.visuals.point("attractor", waypoints[0])

    // ─── Followers ────────────────────────────────────────────────────────
    // Each dot reacts to attractor changes and calls follow with its own alpha.
    // Because attractor is animated every frame (point.eased), Reactive.do
    // fires every frame, so follow is continuously re-applied.
    for (let i = 0; i < FOLLOWER_COUNT; i++) {
        const t     = i / (FOLLOWER_COUNT - 1)
        const alpha = ALPHA_MAX - t * (ALPHA_MAX - ALPHA_MIN)
        const dot   = canvas.visuals.point(followerClass(i), waypoints[0])

        Reactive.do([attractor], () => {
            Animate.point.follow(dot, attractor, {alpha})
        })
    }

    // ─── Attractor state machine ───────────────────────────────────────────
    // Hops between waypoints with easeInOutSine so it accelerates and
    // decelerates. The speed variation stretches and compresses the swarm
    // tail, making the alpha differences more legible.
    const state = canvas.values.real(0)

    Reactive.do([state], () => {
        const target = waypoints[state.value % WAYPOINT_COUNT]
        Animate.point.eased(attractor, target, 1000, {
            easing: EasingFunctions.easeInOutSine,
            onComplete: () => { state.value += 1 },
        })
    })
}