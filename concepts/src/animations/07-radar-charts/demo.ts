// @name Radar Charts
// @category Animations

// Demonstrates stacked radar charts as draggable nodes.
// Three charts are placed on the canvas, each bound to a rotating data slice.
// Clicking the controls cycles through data sets and chart geometry with eased transitions.

import { VisQuill, Animate, Attach, Reactive, type Point, type Real } from "@visquill/visquill-gdk"
import { Controls, Options } from "@visquill/visquill-blueprints"
import { createRadarChart, type RadarChart } from "./radar"
import './styles.css'

// ─── Data ─────────────────────────────────────────────────────────────────────

const NUMBER_OF_BLOCKS  = 5
const NUMBER_OF_CURVES  = 6
const NUMBER_OF_RAYS    = 8

const blocks = generateBlocks(NUMBER_OF_BLOCKS, NUMBER_OF_CURVES, NUMBER_OF_RAYS, 0, 100)
const maxStackedValue = findMaxStackedValueTotal(blocks)

// ─── Chart positions ───────────────────────────────────────────────────────────

const LOCATIONS: Point[] = [
    { x: 220, y: 320 },
    { x: 780, y: 230 },
    { x: 580, y: 580 },
]

// ─── Controls configuration ────────────────────────────────────────────────────

const dataOptions    = new Options.Integers({ values: blocks.map((_, i) => i), title: "Data" })
const radiusOptions  = new Options.Pixels({ values: [20, 50, 100, 0],        title: "Inner Rim", animationTime: 1000 })
const lengthOptions  = new Options.Pixels({ values: [150, 200, 50, 100],     title: "Rays",   animationTime: 1000 })

// ─── Entry point ───────────────────────────────────────────────────────────────

export function run(div: HTMLDivElement) {
    const rvg      = VisQuill.create(div, "demos-")
    const canvas   = rvg.layer("animations-radar-charts-")
    const controls = rvg.layer("controls-")

    // ── Reactive state ────────────────────────────────────────────────────────

    const dataIndex   = canvas.values.real(0)
    const innerRadius = radiusOptions.bind(canvas.values.real(20))
    const rayLength   = lengthOptions.bind(canvas.values.real(150))

    // ── Chart nodes ───────────────────────────────────────────────────────────

    const charts = LOCATIONS.map((point, index) => {
        const chart    = createRadarChart(canvas, {
            numberOfRays:   NUMBER_OF_RAYS,
            numberOfCurves: NUMBER_OF_CURVES,
            stackedCurves:  true,
            innerRadius:    20,
            rayLength:      150,
        })
        // Draggable handle — makes each chart repositionable at runtime
        const handle = canvas.handles.disk("chart-handle", point)
        Attach.pointToPoint(chart.group.anchor, handle)
        return { chart, index }
    })

    // ── Reactive bindings ─────────────────────────────────────────────────────

    // Rotate through data blocks so each chart shows a different slice
    Reactive.do([dataIndex], () => {
        charts.forEach(({ chart, index }) => {
            const block = blocks[(dataIndex.value + index) % blocks.length]
            assignData(chart, block)
        })
    })

    // Animate inner radius across all charts
    Reactive.do([innerRadius], () => {
        charts.forEach(({ chart }) =>
            chart.innerRadius.value = innerRadius.value
        )
    })

    // Animate ray length across all charts
    Reactive.do([rayLength], () => {
        charts.forEach(({ chart }) =>
            chart.rayLength.value = rayLength.value
        )
    })

    // ── Controls panel ────────────────────────────────────────────────────────

    // Bind the dataOptions control manually so clicks advance dataIndex
    dataOptions.bind(dataIndex as unknown as Real)

    Controls.optionsPanel(controls, {
        anchor:  { x: 10, y: 40 },
        entries: [dataOptions, radiusOptions, lengthOptions],
    })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function assignData(chart: RadarChart, values: number[][]): void {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
            Animate.eased(chart.data[i][j], values[i][j] / maxStackedValue, 1000)
        }
    }
}

// ─── Data generation ──────────────────────────────────────────────────────────

function generateBlocks(
    numberOfBlocks: number,
    numberOfCurves: number,
    numberOfRays: number,
    minValue: number,
    maxValue: number,
): number[][][] {
    return Array.from({ length: numberOfBlocks }, () =>
        Array.from({ length: numberOfCurves }, () =>
            Array.from({ length: numberOfRays }, () =>
                Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
            )
        )
    )
}

function findMaxStackedValue(block: number[][]): number {
    const numberOfRays = block[0].length
    return Math.max(
        ...Array.from({ length: numberOfRays }, (_, rayIndex) =>
            block.reduce((sum, curve) => sum + curve[rayIndex], 0)
        )
    )
}

function findMaxStackedValueTotal(data: number[][][]): number {
    return Math.max(...data.map(findMaxStackedValue))
}