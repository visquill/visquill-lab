//@name Text Animation
//@category Animations

import {VisQuill, Svg, Animate, Reactive} from "@visquill/visquill-gdk"
import {Controls} from "@visquill/visquill-blueprints";
import './styles.css'

// ─── Configuration ──────────────────────────────────────────────────────────

const strings = [
    "Hello World!",
    "This is VisQuill",
    "A Graphics Development Kit",
    "For Interactive and Animated",
    "Data Visualizations"];

/**
 * Creates an interactive text animation demonstration.
 * The text transitions sequentially through different strings when the button is clicked.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("animations-text-")
    const controls = rvg.layer("controls-")

    // ─── Build ──────────────────────────────────────────────────────────────

    // Text label that displays the current string
    const label = canvas.text.labelAt("", [150, 100], "label")

    // Reactive value to track the current string index (-1 means not started)
    const currentIndex = canvas.values.real(-1)
    // Toggle value used to trigger the next animation in the sequence
    const toggle = canvas.values.bool()

    // React to changes in currentIndex and animate the text to the next string
    Reactive.do([currentIndex], () => {
        Animate.text(label, strings[currentIndex.value], 100, {
            onComplete: () => {
                // Toggle the boolean value after text animation completes
                // This triggers the next reactive block to advance the index
                Animate.set(toggle, !toggle.value, 500)
            },
            durationMode: "per-character",
            deconstruction: "stepwise"
        })
    }, false)

    // React to toggle changes and increment the index if not at the end
    Reactive.do([toggle], () => {
        // Advance to next string if there are more strings to display
        if (currentIndex.value < strings.length - 1) {
            currentIndex.value += 1
        }
    }, false)
    // Button to trigger text sequence animation
    const stringButton = Controls.button(controls, {bottomLeft: {x: 20, y: 40}, label:{text:"Start"}, width:100, height:20})
    Svg.get(stringButton.frame).addEventListener("click", () => {
        currentIndex.value = 0
    })
}