// @name One Data Type
// @category Lenses

import {
    VisQuill,
    Reactive,
    Animate,
    Attach,
    Boxes,
    Points,
    type StringValue,
    type Real,
    type Point
} from "@visquill/visquill-gdk"
import {createPoints} from "../../utils/decoration"
import './styles.css'
import {Plots} from "@visquill/visquill-blueprints";
import {Options, Controls} from "@visquill/visquill-blueprints";

// Configuration

const rotations = new Options.Radians({
    values: [-Math.PI/2, 0, Math.PI/2, Math.PI],
    title: "Rotation",
    animationTime: 1000
})
const barOffsets = new Options.Pixels({
    values: [10, 20, 30, 40],
    title: "Offset",
    animationTime: 1000
})
const spans = new Options.Radians({
    values: [Math.PI / 1.5, Math.PI / 1.25, Math.PI],
    title: "Span",
    animationTime: 1000
})
const radii = new Options.Pixels({
    values: [80, 100, 120, 140],
    title: "Radius",
    animationTime: 1000
})

const dataTypes = ["red", "green", "blue", "orange"]
const numberOfDataPoints = 100

// Bounding box for scatter points
const pointBox = Boxes.box([150, 50], 800, 600)

/**
 * Creates an interactive lens that counts scattered data points by category.
 * The lens is draggable and bars update reactively as points enter or leave.
 *
 * @param div - Container element for the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("lenses-single-hedgehog-path-")
    const controls = rvg.layer("controls-")

    // Layers
    const pointLayer = canvas.layer()
    const lens = canvas.layer()
    const handle = canvas.handles.disk("handle", Boxes.center(pointBox))

    // Reactive state
    const rotation = rotations.bind(lens.values.real())
    const span = spans.bind(lens.values.real())
    const barOffset = barOffsets.bind(lens.values.real())
    const radius = radii.bind(lens.values.real())
    const valueLabels: StringValue[] = []
    const heights: Real[] = []

    // Build
    const points = createPoints(pointLayer, pointBox, numberOfDataPoints, dataTypes)
    createLens()
    createInteraction()
    Controls.optionsPanel(controls, {
        anchor: {x: 10, y: 40},
        entries: [radii, spans, rotations, barOffsets],
    })

    function createLens() {
        // Circular boundary
        const ring = lens.visuals.circle("ring")
        Attach.circleRadiusToValue(ring, radius)

        // Polyline baseline (5 points create 4 segments)
        const baseline = lens.visuals.polyline("hedgehog-path", 5)
        Attach.polylineToCircle(baseline, ring, span, {distance: 10, angle: rotation})

        // Bars with labels
        const barsDef = dataTypes.map(type => ({style: "bar-" + type, caption: type}))
        const bars = Plots.labeledHedgeHogBars(lens, {
            baseline,
            barDistance: barOffset,
            barWidth: 20,
            bars: barsDef,
            barCaptions: {
                style: "caption",
                autoFlip: true
            },
            valueLabels: {
                style: "value-label",
                autoFlip: true,
                distance: 10
            }
        })

        heights.push(...bars.map(bar => bar.height))
        valueLabels.push(...bars.map(bar => bar.valueLabel!))

        // Pin lens to handle
        Attach.pointToPoint(lens.anchor, handle)

        // Compute outer radius
        const outerRadius = lens.values.real()
        Reactive.do([radius, barOffset], () => {
            outerRadius.value = radius.value + barOffset.value + 20
        })
    }

    function createInteraction() {
        // Recount points when lens moves or resizes
        Reactive.do([lens.anchor, radius], () => {
            for (let i = 0; i < dataTypes.length; i++) {
                const count = countPoints(points[i])
                Animate.follow(heights[i], count / numberOfDataPoints * 400)
                valueLabels[i].value = count.toString()
            }
        })

        function countPoints(points: Point[]) {
            let count = 0
            for (const point of points) {
                if (Points.distanceToPoint(point, lens.anchor).value < radius.value) {
                    count += 1
                }
            }
            return count
        }
    }
}