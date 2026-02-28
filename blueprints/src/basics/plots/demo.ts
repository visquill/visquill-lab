// @name Plots
// @category Basics

import {
    VisQuill,
    Animate,
    Svg,
} from "@visquill/visquill-gdk"
import {Plots, Controls} from "@visquill/visquill-blueprints"
import './demo.css';

// Reusable Bar Creation Utility


/**
 * Demonstrates bar creation with three examples.
 * Each example shows different usage patterns and styling options.
 *
 * @param div - Container element for the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "blueprint-")
    const canvas = rvg.layer("plots-")
    const controls = rvg.layer("controls-")

    createHorizontalExample()
    createCurvedExample()
    createInteractiveExample()

    function createHorizontalExample() {
        const group = canvas.layer()

        // Baseline polyline
        const baseline = group.visuals.polyline("baseline", [
            [100, 150],
            [200, 150],
            [300, 150],
            [400, 150],
            [500, 150]
        ])

        // Bars along baseline
        const bars = Plots.hedgeHogBars(group, {
            baseline,
            bars: 4,
            barWidth: 30,
            barDistance: 5,
            defaultStyle: "bar-blue"
        })

        bars.forEach(bar => {
            bar.height.value = 60
        })

        const label = canvas.text.label("Horizontal Baseline", "label-horizontal")
        label.x = 100
        label.y = 180
    }

    function createCurvedExample() {
        const group = canvas.layer()

        // Curved baseline polyline
        const baseline = group.visuals.polyline("baseline", [
            [100, 400],
            [200, 370],
            [300, 390],
            [400, 380],
            [500, 400]
        ])

        const barColors = ["bar-blue", "bar-green", "bar-orange", "bar-purple"]

        // Bars with individual colors
        Plots.hedgeHogBars(group, {
            baseline,
            bars: barColors.map(style => ({style})),
            barWidth: 35,
            barDistance: 5,
        }).forEach((bar, i) => {
            bar.height.value = 40 + i * 20
        })

        const label = canvas.text.label("Curved Baseline", "label-curved")
        label.x = 100
        label.y = 430
    }

    function createInteractiveExample() {
        const group = canvas.layer()

        const baseline = group.visuals.polyline("baseline", [
            [100, 620],
            [200, 620],
            [300, 620],
            [400, 620],
            [500, 620]
        ])

        const bars = Plots.hedgeHogBars(group, {
            baseline,
            bars: 4,
            barWidth: 35,
            barDistance: 5,
            defaultStyle: "bar-animated"
        })

        // Initial heights
        bars.forEach(bar => {
            bar.height.value = 50
        })

        // Label
        const label = canvas.text.label("Interactive Bars", "label-interactive")
        label.x = 100
        label.y = 650

        // Animate button
        const animateButton = Controls.button(controls, {
            bottomLeft: {x: 300, y: 670},
            width: 100,
            height: 30,
            label: {text: "Animate"}
        })

        Svg.get(animateButton.frame).addEventListener("click", () => {
            bars.forEach(bar => {
                const targetHeight = 50 + Math.random() * 100
                Animate.eased(bar.height, targetHeight, 1000, {
                    easing: Animate.easeOutCubic,
                })
            })
        })
    }
}