//@name Simple State Machine
//@category Animations

// Demonstrates a cyclic state machine that animates a token along a square path.
// Each state animates one property (x, y, or angle) and automatically advances to the next state.
import {VisQuill, Animate, Reactive, Vectors,  Pins, type Real} from "@visquill/visquill-gdk"
import './styles.css'

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("simple-state-machine-")

    // State machine index (0-7) cycling through animation steps
    const state = canvas.values.real(0)
    // Visual marker representing the moving token
    const token = canvas.visuals.point("token")
    // Position and rotation variables for the token
    const x = canvas.values.real(0)
    const y = canvas.values.real(0)
    const angle = canvas.values.real(0)

    // Group layer containing the blue box visual, positioned and rotated by token
    const group = canvas.layer()

    group.visuals.box("@style fill:blue", [10, -30], [30, -10])
    Vectors.copy([200, 200], canvas.anchor)

    // Eight states forming a square path: move right, rotate 90°, move down, rotate 90°, etc.
    const states: Array<() => void> = [
        () => animate(x, 100),
        () => animate(angle, Math.PI / 2),
        () => animate(y, 100),
        () => animate(angle, Math.PI),
        () => animate(x, 0),
        () => animate(angle, Math.PI * 1.5),
        () => animate(y, 0),
        () => animate(angle, Math.PI * 2),
    ]

    // Animates a variable to a target value, then advances the state machine
    function animate(variable: Real, value: number){
        Animate.eased(variable, value, 1000, {onComplete: ()=>state.value+=1})
    }

    // Execute the current state's animation when state changes; reset cycle after last state
    Reactive.do([state], () => {
        if(state.value>=states.length){
            state.value=0
            angle.value=0
        }
        states[state.value]?.()
    })

    // Update visual position and rotation whenever x, y, or angle changes
    Reactive.do([x, y, angle], () => {
        Vectors.copy([x.value, y.value], token)
        Vectors.copy(token, group.anchor)
        Pins.orientate(Vectors.fromAngle(angle.value), group.anchor)
    })
}