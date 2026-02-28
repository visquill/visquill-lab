// @name Decoration
// @category Basics

import {
    type Rectangle,
    Rectangles,
    VisQuill
} from "@visquill/visquill-gdk"
import {Decoration} from "@visquill/visquill-blueprints"
import './demo.css';


// Demonstration

/**
 * Demonstrates the LabelCreator utility with two examples.
 *
 * @param div - Container element for the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "blueprint-")
    const canvas = rvg.layer("decoration-")

    createPolylineLabelsExample()
    createRectangleLabelsExample()

    function createPolylineLabelsExample() {
        const group = canvas.layer()

        const sectionLabel = canvas.text.label("Labels Along Polyline", "section-label")
        sectionLabel.x = 50
        sectionLabel.y = 50

        const baseline = group.visuals.polyline("baseline", [
            [100, 120],
            [200, 100],
            [300, 110],
            [400, 90],
            [500, 120]])

        // Labels with custom styles
        const labels: Decoration.LabelDescription[] = [
            {text: "Q1", style: "label-quarter"},
            {text: "Q2", style: "label-quarter"},
            {text: "Q3", style: "label-quarter"},
            {text: "Q4", style: "label-quarter"}
        ]

        Decoration.labelsAlongPolyline(group, {baseline, labels})
    }

    function createRectangleLabelsExample() {
        const group = canvas.layer()

        const sectionLabel = canvas.text.label("Labels At Rectangle Edges", "section-label")
        sectionLabel.x = 50
        sectionLabel.y = 250

        const rectangles: Rectangle[] = []
        const barColors = ["bar-blue", "bar-green", "bar-orange", "bar-purple", "bar-red"]
        const barData = [80, 120, 95, 140, 70]

        barData.forEach((height, i) => {
            const rect = group.visuals.rectangle(barColors[i])
            const x = 100 + i * 80
            Rectangles.alongSegment([x, 450], [x + 50, 450], height, true, rect)
            rectangles.push(rect)
        })

        const labelTexts = barData.map(v => v.toString())

        Decoration.labelsAtRectangles(group, {
            rectangles,
            labels: labelTexts,
            placement: "top",
            position: "center",
            distance: 5,
            style: "label-value"
        })
    }
}