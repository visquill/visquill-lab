// @name Two Data Types
// @category Lenses

import {VisQuill, Reactive, Animate, Attach, Boxes, Points, type StringValue, type Real} from "@visquill/visquill-gdk"
import {Controls, Plots} from "@visquill/visquill-blueprints";
import {createPoints2D} from "../../utils/decoration"
import {Options} from "@visquill/visquill-blueprints";
import './styles.css'

// Configuration

const rotations = new Options.Radians({
    values: [-Math.PI/2, 0, Math.PI/2, Math.PI],
    title: "Rotation",
    animationTime: 1000
})
const barOffsets = new Options.Pixels({values: [10, 20, 30, 40], title: "Offset", animationTime: 1000})
const spans = new Options.Radians({values: [Math.PI / 1.25, Math.PI], title: "Span", animationTime: 1000})
const radii = new Options.Pixels({values: [80, 100, 120, 140], title: "Radius", animationTime: 1000})

const colors = ["red", "green", "blue", "orange"]
const shapes = ["circle", "square", "triangle", "diamond"]
const numberOfDataPoints = 100

// Bounding box for scatter points
const pointBox = Boxes.box([150, 50], 800, 600)

/**
 * Creates an interactive lens with two barlines reading different dimensions
 * of the same scattered data points. One barline counts by color, the other by shape.
 * Both barlines are anchored to opposite sides of a single draggable ring.
 *
 * @param div - Container element for the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("lenses-two-hedgehog-paths-")
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

    // Shape barline rotation (opposite side, π ahead)
    const shapeRotation = lens.values.real(rotation.value + Math.PI)
    Reactive.do([rotation], () => {
        shapeRotation.value = rotation.value + Math.PI
    })

    // Heights and labels for both barlines
    const colorHeights: Real[] = []
    const colorLabels: StringValue[] = []
    const shapeHeights: Real[] = []
    const shapeLabels: StringValue[] = []
    // Build
    const points = createPoints2D(pointLayer, pointBox, numberOfDataPoints, colors, shapes)
    createLens()
    createInteraction()
    Controls.optionsPanel(controls, {
        anchor: {x: 10, y: 40},
        entries: [radii, spans, rotations, barOffsets],
    })
    function createLens() {
        // Shared circular boundary
        const ring = lens.visuals.circle("ring")
        Attach.circleRadiusToValue(ring, radius)

        // Color barline (top half)
        const colorPolyline = lens.visuals.polyline("barline", 5)
        Attach.polylineToCircle(colorPolyline, ring, span, {distance: 10, angle: rotation})

        const colorBars = Plots.labeledHedgeHogBars(lens, {
            baseline: colorPolyline,
            barDistance: barOffset,
            barWidth: 20,
            bars: colors.map(c => ({style: "bar-" + c, caption: c})),
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

        colorHeights.push(...colorBars.map(bar => bar.height))
        colorLabels.push(...colorBars.map(bar => bar.valueLabel!))

        // Shape barline (bottom half, rotated π)
        const shapePolyline = lens.visuals.polyline("barline", 5)
        Attach.polylineToCircle(shapePolyline, ring, span, {distance: 10, angle: shapeRotation})

        const shapeBars = Plots.labeledHedgeHogBars(lens, {
            baseline: shapePolyline,
            barDistance: barOffset,
            barWidth: 20,
            bars: shapes.map(s => ({style: "bar-" + s, caption: s})),
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

        shapeHeights.push(...shapeBars.map(bar => bar.height))
        shapeLabels.push(...shapeBars.map(bar => bar.valueLabel!))

        // Pin lens to handle
        Attach.pointToPoint(lens.anchor, handle)
    }

    function createInteraction() {
        // Recount when lens moves or resizes
        Reactive.do([lens.anchor, radius], () => {
            updateBarline(colorHeights, colorLabels, (c, s) => points[c][s])
            updateBarline(shapeHeights, shapeLabels, (c, s) => points[c][s], true)
        })

        function updateBarline(
            heights: Real[],
            labels: StringValue[],
            getPoints: (i: number, j: number) => any[],
            transpose = false
        ) {
            const outerLen = transpose ? shapes.length : colors.length
            const innerLen = transpose ? colors.length : shapes.length

            for (let i = 0; i < outerLen; i++) {
                let count = 0
                for (let j = 0; j < innerLen; j++) {
                    const pts = transpose ? getPoints(j, i) : getPoints(i, j)
                    for (const point of pts) {
                        if (Points.distanceToPoint(point, lens.anchor).value < radius.value) {
                            count += 1
                        }
                    }
                }
                Animate.follow(heights[i], count / numberOfDataPoints * 400)
                labels[i].value = count.toString()
            }
        }
    }
}