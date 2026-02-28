//@name Text Animation
//@category Animations

import {VisQuill, Animate, Reactive, type RvgGroup} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Configuration ──────────────────────────────────────────────────────────

const strings = [
    "Hello World!",
    "This is VisQuill",
    "A Graphics Development Kit",
    "For Interactive and Animated",
    "Data Visualizations",
    "The lenses are interactive!"];

/**
 * Creates an interactive text animation demonstration.
 * The text transitions sequentially through different strings when the button is clicked.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "home-")
    const canvas = rvg.layer("")

    const lensLayer = canvas.layer("data-lenses-")
    const textLayer = canvas.layer("intro-")


    const triggerAnimation = createLenses(lensLayer)
    const index = createTextLayer()
    Reactive.do([triggerAnimation],()=>{
        index.value = 0
    },false)


    function createTextLayer(){
        // ─── Build ──────────────────────────────────────────────────────────────

        // Text label that displays the current string
        const label = textLayer.text.labelAt("", [100, 100], "label")

        // Reactive value to track the current string index (-1 means not started)
        const currentIndex = textLayer.values.real(-1)
        // Toggle value used to trigger the next animation in the sequence
        const toggle = textLayer.values.bool()

        // React to changes in currentIndex and animate the text to the next string
        Reactive.do([currentIndex], () => {
            Animate.text(label, strings[currentIndex.value], 100, {
                onComplete: () => {
                    // Toggle the boolean value after text animation completes
                    // This triggers the next reactive block to advance the index
                    Animate.set(toggle, !toggle.value, 500)
                },
                durationMode: "per-character",
                deconstruction: "instantly"
            })
        }, false)

        // React to toggle changes and increment the index if not at the end
        Reactive.do([toggle], () => {
            // Advance to next string if there are more strings to display
            if (currentIndex.value < strings.length - 1) {
                currentIndex.value += 1
            }
        }, false)

        return currentIndex
    }
}


import { DataLens, LensKit } from "@visquill/visquill-blueprints";
type BarPlotScheme = DataLens.BarPlotScheme;
type DataLensScheme = DataLens.DataLensScheme;
type DataLensTitleScheme = DataLens.DataLensTitleScheme;



const sharedPlot: Omit<BarPlotScheme, "aspect" | "baselineStyle" | "categories"> = {
    type: "bar-plot",
    offset: 25,
    barWidth: 18,
    barOffset: 11,
    barCaptions: {style: "bar-caption", autoFlip: true},
    valueLabels: {style: "value-label", autoFlip: true, distance: 9},
    minValue: 0,
    maxValue: 100,
    maxHeight: 100
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


// ─── Lens schemes ─────────────────────────────────────────────────────────────
//
// Both lenses carry the same two plots so the arc split is identical,
// making them visually comparable when grouped. The variables differ so
// they remain semantically distinct.

const sharedLens: Omit<DataLensScheme, "variable" | "title" | "plots"> = {
    rimRadius: 10,
    radialSpan: Math.PI  /5,
    rimStyle: "rim",
    innerRadius: 10, // radius measured relative to the rim
    outerRadius: 200, // radius measured relative to the rim,
    initialAspect: "age",
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
        title: {...sharedTitle, text: "Statistic 1"},
        location: {x: 200, y: 450},
        stylePrefix: "employment-",
        plots: [agePlot],
    },
    {
        ...sharedLens,
        variable: "income",
        title: {...sharedTitle, text: "Statistic 2"},
        location: {x: 700, y: 450},
        stylePrefix: "income-",
        plots: [agePlot],
    },
    {
        ...sharedLens,
        variable: "education",
        title: {...sharedTitle, text: "Statistic 3"},
        location: {x: 450, y: 800},
        stylePrefix: "education-",
        plots: [agePlot],
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
    },
    income: {
        age: [24, 38, 52, 58, 41],   // median income by age group, k€
    },
    education: {
        age: [48, 65, 71, 58, 32],   // higher education rate by age group, %
    },
    cars: {
        age: [35, 52, 68, 71, 43],   // car ownership rate by age group, %
    },
}



// ─── Entry point ──────────────────────────────────────────────────────────────

export function createLenses(canvas: RvgGroup) {
    const lensLayer = canvas.layer()


    // Create lenses independently
    const statistics = [data.employment,data.income,data.education,data.cars]

    const lenses = schemes.map(scheme => {
        const lens =  DataLens.createInteractiveLens(lensLayer, scheme, "handle")
        lens.layer.visible.value = false
        return lens
    })

    // Group all lenses with equal arc distribution (default)
    // When grouped, each lens gets an equal share of the circle
    DataLens.createProximityGroup(lensLayer, lenses, {
        threshold: 100,
        arcGap: 0.1,
        animationDuration: 1000,
        arcLayout: equal
    })

    // Enable snapping - lenses in same component stick together
    DataLens.createSnapGroup(lensLayer,lenses, {
        snapDistance: 50,
        unsnapDistance: 75
    })

    // on real world data this would normally depend on the position of the lens
    lenses.forEach((lens,index)=>{
        const data = statistics[index]
        wireBarHeights(lens.plots[0].bars, data.age)
    })



    const triggerAnimation = canvas.values.bool()
    const step = canvas.values.real(-1)
    Reactive.do([step],()=>{
        if(step.value < lenses.length){
            const lens = lenses[step.value]
            lens.layer.visible.value = true
            Animate.eased(lens.radius, 100, 1000,{
                onComplete:()=>{
                    step.value +=1
                }
            })
        }else{
            triggerAnimation.value = true
        }
    },false)
    setTimeout(()=>{
        step.value = 0
    },1000)
    return triggerAnimation
}


function wireBarHeights(bars: { height: { value: number } }[], values: number[]) {
    bars.forEach((bar, i) => {
        bar.height.value = values[i]
    })
}

export const equal: DataLens.ArcLayoutFunction = (component: LensKit.Lens[], arcGap: number = 0.01): DataLens.ArcAssignment[] => {
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

