//@name Breathing
//@category Animations

// Demonstrates looping shape morph animations using Animate.shape.morph.
// A single polygon loops between a relaxed and a tense pose, driven by a
// two-state value that each morph flips when it completes.

import {VisQuill, Animate, Circles, Vectors, type Point, Reactive, EasingFunctions} from "@visquill/visquill-gdk"
import './styles.css'

const VERTICES = 10

// ─── Pose helper ──────────────────────────────────────────────────────────
// Places VERTICES points evenly around the centre, alternating between a
// circle of outerRadius and one of innerRadius. When both radii are equal the
// result is a regular polygon; as the difference grows the shape becomes a
// sharp star.
function pose(outerRadius: number, innerRadius: number): Point[] {
    const outer = dial(outerRadius)
    const inner = dial(innerRadius)
    return Array.from({ length: VERTICES }, (_, i) =>
        Circles.pointAt(i % 2 === 0 ? outer : inner, i / VERTICES)
    )
}

// A circle through 12, 3 and 6 o'clock: Circles.pointAt starts at its first
// point, so the star's first tip points up.
function dial(radius: number) {
    return Circles.circle3P([0, -radius], [radius, 0], [0, radius])
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
    // Initialise the polygon at the relaxed pose.
    const shape = canvas.visuals.polygon("shape", pose(80, 72))

    // ─── Animation ────────────────────────────────────────────────────────
    // Two steps, looping forever: easeInOutSine for the slow build into the
    // tense pose, a shorter easeOutCubic for the release back to relaxed.
    const state = canvas.values.real()
    Reactive.do([state],()=>{
        if(state.value == 0){
            Animate.shape.morph(shape,tense,1400,{easing: EasingFunctions.easeInOutSine,onComplete:()=>{
                    state.value = 1
                }})

        }else if(state.value == 1){
            Animate.shape.morph(shape,relaxed,900,{easing: EasingFunctions.easeOutCubic,onComplete: ()=>{
                    state.value = 0;
                }})

        }
    })
}