//@name Hello World
//@category Basics

import {VisQuill, Attach} from "@visquill/visquill-gdk"
import "./styles.css"

/**
 * Creates a simple "Hello World" visualization —
 * a single text element attached to the center of the graphic.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-basics-hello-world-")
    const canvas = rvg.canvas
    // Text element
    // CSS class resolves to "demos-basics-hello-world-label"
    const text = canvas.text.label("Hello World!",  "label")

    // Attach the text to the graphic's center point.
    // pointToPoint moves "text" so that its origin lands on rvg.center.
    // Text stays at center point even if rvg.center changes.
    Attach.pointToPoint(text, rvg.center)
}