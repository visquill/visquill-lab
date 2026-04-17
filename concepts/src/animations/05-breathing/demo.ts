//@name Breathing
//@category Animations

// Demonstrates shape morph animations using Animate.sequenceShape.
// A single polygon loops between a relaxed and a tense pose, creating
// an organic breathing effect with no state machine needed.

import {VisQuill, Animate, Vectors, type Point} from "@visquill/visquill-gdk"
import './styles.css'

const VERTICES = 10

// ─── Pose helper ──────────────────────────────────────────────────────────
// Places VERTICES points around a circle, alternating between outerRadius
// and innerRadius. When both radii are equal the result is a regular polygon;
// as the difference grows the shape becomes a sharp star.
function pose(outerRadius: number, innerRadius: number): Point[] {
    return Array.from({ length: VERTICES }, (_, i) => {
        const angle = (i / VERTICES) * Math.PI * 2 - Math.PI / 2
        const r = i % 2 === 0 ? outerRadius : innerRadius
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
    })
}

// ─── Poses ────────────────────────────────────────────────────────────────
const relaxed = pose(80, 72)   // nearly circular — small difference between radii
const tense   = pose(120, 28)  // sharp star — large difference between radii

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("breathing-")

    // Centre the scene
    Vectors.copy([240, 200], canvas.anchor)

    // ─── Shape ────────────────────────────────────────────────────────────
    // Initialise the polygon at the relaxed pose. sequenceShape will morph
    // its vertices in place — no sync code needed.
    const shape = canvas.visuals.polygon("shape", relaxed)

    // ─── Animation ────────────────────────────────────────────────────────
    // Two steps, looping forever. easeInOutSine for the slow expansion into
    // tense; easeOutBack for the snap back to relaxed (slight overshoot sells
    // the "release of tension" feeling).
    Animate.sequenceShape(shape, [
        { to: tense,   duration: 1400, easing: Animate.easeInOutSine },
        { to: relaxed, duration: 900,  easing: Animate.easeOutBack },
    ], { loop: true })
}