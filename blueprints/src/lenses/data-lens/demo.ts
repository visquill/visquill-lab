import {VisQuill, Boxes, Points, Reactive, Animate} from "@visquill/visquill-gdk";
import type {BarPlotScheme, DataLensScheme, DataLensTitleScheme} from "./schemes";
import {
    type ArcAssignment,
    type ArcLayoutFunction,
    createDropBox,
    createInteractiveLens,
    createProximityGroup,
    createSnapGroup,
    type DataLens
} from "./data-lens";
import {Controls, Options} from "@visquill/visquill-blueprints";
import "./demo.css";
import type {Lens} from "../lens-kit";

// ─────────────────────────────────────────────────────────────────────────────
// This demo shows:
//
//   - Multiple plots on a single lens, each covering a proportional arc slice
//   - Three lenses representing different variables (employment, income, education)
//   - Separate proximity and snap groups for fine-grained coordination control
//   - Equal arc distribution (default) - all grouped lenses get equal arc
//   - Interactive toggle button to enable/disable magnetic snapping
//   - Realistic categorical data wired after construction
//
// Grouping strategy:
//   - All lenses in one proximity group with equal arc distribution
//   - All lenses can snap together when within snap distance (toggle-able)
//
// Each lens carries two plots: one for age group breakdown, one for region.
// Because the age plot has more categories it receives more arc than the region
// plot — the proportional layout does this automatically from category count.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Shared bar plot defaults ─────────────────────────────────────────────────

const sharedPlot: Omit<BarPlotScheme, "aspect" | "baselineStyle" | "categories"> = {
    type: "bar-plot",
    offset: 25,
    barWidth: 18,
    barOffset: 11,
    barCaptions: {style: "bar-caption", autoFlip: true},
    valueLabels: {style: "value-label", autoFlip: true, distance: 9},
    gridLines: {
        count: 3,
        offset: 25+11,
        style: "@style stroke: black; stroke-width: 0.5px; fill:none",
        labelStyle: "grid-label"
    },
    minValue: 0,
    maxValue: 100,
    maxHeight: 190
}

// ─── Age breakdown plot (5 categories → larger arc share) ─────────────────────

const agePlot: BarPlotScheme = {
    ...sharedPlot,
    aspect: "age",
    baselineStyle: "baseline-age",
    categories: [
        {style: "age-1", name: "18–"},
        {style: "age-2", name: "25–"},
        {style: "age-3", name: "35–"},
        {style: "age-4", name: "50–"},
        {style: "age-5", name: "65+"},
    ],
    maxExtent: 50*5
}

// ─── Gender breakdown plot (3 categories → smaller arc share) ─────────────────

const genderPlot: BarPlotScheme = {
    ...sharedPlot,
    aspect: "gender",
    baselineStyle: "baseline-gender",
    categories: [
        {style: "gender-1", name: "M"},
        {style: "gender-2", name: "F"},
        {style: "gender-3", name: "O"},
    ],
    maxExtent: 50*3
}

// ─── Lens schemes ─────────────────────────────────────────────────────────────
//
// Both lenses carry the same two plots so the arc split is identical,
// making them visually comparable when grouped. The variables differ so
// they remain semantically distinct.

const sharedLens: Omit<DataLensScheme, "variable" | "title" | "plots"> = {
    rimRadius: 100,
    radialSpan: Math.PI  /5,
    rimStyle: "rim",
    innerRadius: 10, // radius measured relative to the rim
    outerRadius: 200, // radius measured relative to the rim,
    initialAspect: "gender",
    onCollapse: {
        rimRadius: 20,
        innerRadius: 10,
        outerRadius: 10
    }
}

const sharedTitle: Omit<DataLensTitleScheme, "text"> = {
    style: "aspect-label",
    minLength: 40,
    minRadius: 40
}

const schemes: DataLensScheme[] = [
    {
        ...sharedLens,
        variable: "employment",
        title: {...sharedTitle, text: "Employment"},
        location: {x: 60, y: 160},
        stylePrefix: "employment-",
        plots: [agePlot,genderPlot],
    },
    {
        ...sharedLens,
        variable: "income",
        title: {...sharedTitle, text: "Median Income"},
        location: {x: 600, y: 350},
        stylePrefix: "income-",
        plots: [agePlot,genderPlot],
    },
    {
        ...sharedLens,
        variable: "education",
        title: {...sharedTitle, text: "Master's Degree"},
        location: {x: 400, y: 600},
        stylePrefix: "education-",
        plots: [agePlot,genderPlot],
    },
    {
        ...sharedLens,
        variable: "car",
        title: {...sharedTitle, text: "Own Car"},
        location: {x: 700, y: 800},
        stylePrefix: "car-",
        plots: [agePlot,genderPlot],
    },
]

// ─── Data ─────────────────────────────────────────────────────────────────────
//
// Values indexed by variable, then plot aspect, then category.
// Employment, income, and education have different distributions across the same
// categories so the three lenses look meaningfully different even when grouped.

const data = {
    employment: {
        age: [62, 81, 79, 67, 28],   // employment rate by age group, %
        gender: [72, 68, 70],           // employment rate by gender, %
    },
    income: {
        age: [24, 38, 52, 58, 41],   // median income by age group, k€
        gender: [46, 38, 40],           // median income by gender, k€
    },
    education: {
        age: [48, 65, 71, 58, 32],   // higher education rate by age group, %
        gender: [54, 58, 52],           // higher education rate by gender, %
    },
    cars: {
        age: [35, 52, 68, 71, 43],   // car ownership rate by age group, %
        gender: [61, 58, 63],           // car ownership rate by gender, %
    },
}

const optionsAspects = new Options.Strings({values: ["gender","age"],title: "Aspect"})
const optionsMagnetic = new Options.Booleans({values: [true,false],title: "Magnetic"})
const optionsProximity = new Options.Booleans({values: [true,false],title: "Proximity"})


// ─── Entry point ──────────────────────────────────────────────────────────────

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "blueprint-")
    const canvas = rvg.layer("data-lenses-")
    const background = canvas.layer()
    const lensLayer = canvas.layer()
    const controls = canvas.layer()
    const currentAspect = canvas.values.string(sharedLens.initialAspect)


    // Create lenses independently
    const statistics = [data.employment,data.income,data.education,data.cars]

    const lenses = schemes.map(scheme => {
        return createInteractiveLens(lensLayer, scheme, "handle")
    })

    // Group all lenses with equal arc distribution (default)
    // When grouped, each lens gets an equal share of the circle
    const proximityGroup = createProximityGroup(lensLayer, lenses, {
        threshold: 100,
        arcGap: 0.1,
        animationDuration: 1000,
        arcLayout: equal
    })

    // Enable snapping - lenses in same component stick together
    const magneticGroup = createSnapGroup(lensLayer,lenses, {
        snapDistance: 50,
        unsnapDistance: 75
    })

    // on real world data this would normally depend on the position of the lens
    lenses.forEach((lens,index)=>{
        const data = statistics[index]
        wireBarHeights(lens.plots[0].bars, data.age)
        wireBarHeights(lens.plots[1].bars, data.gender)
    })


    Controls.optionsPanel(controls,{
        anchor: {x: 20, y: 40},
        entries: [optionsMagnetic, optionsProximity,optionsAspects]
    })

    lenses.forEach(lens => {
        createPlotController(lens)
        optionsAspects.bind(currentAspect)
        optionsProximity.bind(proximityGroup.active)
        optionsMagnetic.bind(magneticGroup.active)
    } )

    lenses.forEach((lens,index) => {
        const scheme = schemes[index]
        createLensHome(lens, scheme.title!.text, scheme.variable, 20, 120+index*120)
    })


    function createLensHome(lens: DataLens, title: string, css: string, x: number, y: number) {
        const box = Boxes.box([x, y], 80, 80, background.visuals.box(css + "-home"))
        const labelAnchor = Points.moveDown(5, Boxes.bottomLeft(box))
        background.text.labelAt(title, labelAnchor, "home-label")
        createDropBox(box, lens, {animationDuration: 1000})
    }

    function createPlotController(lens: DataLens){
        const state = canvas.values.real(0)
        Reactive.do([currentAspect],()=>{
            state.value = 1
        },false)
        Reactive.do([state],()=>{
            if(state.value == 1){
                Animate.eased(lens.outerRadius,10,1000,{
                    onComplete: () => {
                        lens.aspect.value = currentAspect.value
                        state.value = 0
                    }
                })
            }
            if(state.value == 0){
                Animate.eased(lens.outerRadius,sharedLens.outerRadius,1000)
            }
        },false)
    }
}


function wireBarHeights(bars: { height: { value: number } }[], values: number[]) {
    bars.forEach((bar, i) => {
        bar.height.value = values[i]
    })
}

export const equal: ArcLayoutFunction = (component: Lens[], arcGap: number = 0.01): ArcAssignment[] => {
    if (component.length === 1) {
        return [{
            lens: component[0],
            radialSpan: Math.PI,
            anchorAngle: -Math.PI / 2,
        }]
    }

    const gapTotal = Math.PI * 2 * arcGap
    const usableArc = Math.PI * 2 - gapTotal
    const spanPerLens = usableArc / component.length
    const gapPerLens = gapTotal / component.length

    let cursor =0
    return component.map(lens => {
        const assignment = { lens, radialSpan: spanPerLens, anchorAngle: -cursor }
        cursor += spanPerLens + gapPerLens
        return assignment
    })
}