import {VisQuill, Svg} from "@visquill/visquill-gdk"
import {Controls, Options} from "@visquill/visquill-blueprints"
import './demo.css';


/**
 * Demonstrates the Controls blueprint: basic buttons, styled buttons,
 * interactive buttons with a counter, label positioning variants,
 * and toggle buttons with an options panel.
 *
 * @param div - Container element for the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "blueprint-")
    const canvas = rvg.layer("controls-")

    createBasicButtons()
    createStyledButtons()
    createInteractiveButtons()
    createLabelPositioningExamples()
    createToggleButtons()

    function createBasicButtons() {
        const group = canvas.layer()

        const label = canvas.text.label("Basic Buttons", "section-label")
        label.x = 50
        label.y = 50

        // Default button (inline style fallback)
        Controls.button(group, {
            bottomLeft: {x: 50, y: 100},
            width: 120,
            height: 40,
            label: {text: "Default"}
        })

        // Button without label
        Controls.button(group, {
            bottomLeft: {x: 190, y: 100},
            width: 80,
            height: 40
        })

        // Small button
        Controls.button(group, {
            bottomLeft: {x: 290, y: 100},
            width: 100,
            height: 30,
            label: {text: "Small"}
        })
    }

    function createStyledButtons() {
        const group = canvas.layer()

        const label = canvas.text.label("Styled Buttons", "section-label")
        label.x = 50
        label.y = 170

        Controls.button(group, {
            bottomLeft: {x: 50, y: 220},
            width: 120,
            height: 40,
            style: "button-primary",
            label: {text: "Primary"}
        })

        Controls.button(group, {
            bottomLeft: {x: 190, y: 220},
            width: 120,
            height: 40,
            style: "button-outlined",
            label: {text: "Outlined"}
        })
    }

    function createInteractiveButtons() {
        const group = canvas.layer()

        const label = canvas.text.label("Interactive Button", "section-label")
        label.x = 50
        label.y = 290

        let count = 0
        const counter = canvas.text.label("Clicks: 0", "counter-label")
        counter.x = 220
        counter.y = 330

        const btn = Controls.button(group, {
            bottomLeft: {x: 50, y: 340},
            width: 140,
            height: 40,
            label: {text: "Click me"}
        })

        Svg.get(btn.frame).addEventListener("click", () => {
            count++
            counter.value = `Clicks: ${count}`
        })
    }

    function createLabelPositioningExamples() {
        const group = canvas.layer()

        const label = canvas.text.label("Label Positioning", "section-label")
        label.x = 50
        label.y = 420

        const positions : {
            text: string,
            style: string,
            anchorX: "left" | "center" | "right",
            anchorY: "top" | "center" | "bottom",
            x: number,
            y: number
        }[]  = [
            {text: "↖", style: "label-top-left",     anchorX: "left",   anchorY: "top",    x: 50,  y: 470},
            {text: "↑", style: "label-top-center",   anchorX: "center", anchorY: "top",    x: 170, y: 470},
            {text: "↗", style: "label-top-right",    anchorX: "right",  anchorY: "top",    x: 290, y: 470},
            {text: "←", style: "label-middle-left",  anchorX: "left",   anchorY: "center", x: 50,  y: 570},
            {text: "·", style: "label-middle-center", anchorX: "center", anchorY: "center", x: 170, y: 570},
            {text: "→", style: "label-middle-right", anchorX: "right",  anchorY: "center", x: 290, y: 570},
            {text: "↙", style: "label-bottom-left",  anchorX: "left",   anchorY: "bottom", x: 50,  y: 670},
            {text: "↓", style: "label-bottom-center", anchorX: "center", anchorY: "bottom", x: 170, y: 670},
            {text: "↘", style: "label-bottom-right",  anchorX: "right",  anchorY: "bottom", x: 290, y: 670},
        ]

        for (const pos of positions) {
            Controls.button(group, {
                bottomLeft: {x: pos.x, y: pos.y},
                width: 100,
                height: 40,
                style: "button-outlined",
                label: {
                    style: pos.style,
                    text: pos.text,
                    anchorX: pos.anchorX,
                    anchorY: pos.anchorY,
                }
            })
        }
    }

    function createToggleButtons() {
        const group = canvas.layer()

        const label = canvas.text.label("Toggle Buttons & Options Panel", "section-label")
        label.x = 50
        label.y = 750

        // Single standalone toggleButton — cycles through named string values
        const theme = new Options.Strings({values: ["Light", "Dark", "High Contrast"], title: "Theme"})
        Controls.toggleButton(group, {
            bottomLeft: {x: 50, y: 800},
            width: 200,
            height: 36,
            style: "toggle-button",
            toggle: theme,
        })

        // Options panel — a vertical stack of toggle buttons sharing layout settings.
        // Each Options instance manages its own reactive variable(s) via bind().
        const sizes   = new Options.Pixels({values: [80, 100, 120, 140], title: "Size"})
        const angles  = new Options.Radians({values: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], title: "Angle"})
        const enabled = new Options.Strings({values: ["Off", "On"], title: "Grid"})

        Controls.optionsPanel(group, {
            anchor: {x: 300, y: 800},
            entries: [sizes, angles, enabled],
            width: 160,
            height: 36,
            gap: 44,
            style: "toggle-button",
        })
    }
}