import {
    type Polyline,
    type RvgGroup,
    type Real,
    type Rectangle,
    Attach,
    type RvgAnchoredText,
} from "@visquill/visquill-gdk"
import * as Conversion from "../../utils/conversion";
import * as Labels from "../decoration/labels";


const DEFAULT_BAR_STYLE = "@style fill:black;"

/**
 * Represents a bar visual element with its associated properties and optional labels.
 * Bars are created along polylines and grow perpendicular to the baseline.
 *
 * @property height - Reactive value controlling the bar's height
 * @property shape - The rectangle visual representing the bar
 * @property caption - Optional text label displayed along the baseline at the bar's position
 * @property valueLabel - Optional text label displaying the bar's value, typically positioned at the bar's top
 */
export interface Bar {
    height: Real,
    shape: Rectangle,
    caption?: RvgAnchoredText,
    valueLabel?: RvgAnchoredText
    valueLabelDistance?: Real
}

/**
 * Creates bars with captions and value labels along a polyline baseline.
 * Combines bar creation with automatic label placement.
 *
 * @param group - Group that owns the bars
 * @param options - Configuration object containing baseline, bars, labels, and styling
 * @param options.baseline - The polyline that serves as the baseline for bar placement. Each bar attaches to a segment of this polyline
 * @param options.bars - Either a number specifying how many bars to create, or an array of bar configurations with optional style and caption properties
 * @param options.barWidth - Width of each bar, either as a number or reactive Real value
 * @param options.barDistance - Optional distance offset from the baseline where bars are positioned. Defaults to 0
 * @param options.defaultStyle - Optional default style directive applied to bars without explicit style.
 * @param options.valueLabels - Optional configuration for value labels displayed at bar tops
 * @param options.valueLabels.style - Style directive for value labels
 * @param options.valueLabels.autoFlip - Whether to automatically flip label orientation based on bar direction
 * @param options.valueLabels.distance - Distance from bar top to label position. Can be a number, Real, or array of Real values for per-bar distances
 * @param options.barCaptions - Optional configuration for caption labels displayed along the baseline at each bar position
 * @param options.barCaptions.style - Style directive string for caption labels
 * @param options.barCaptions.autoFlip - Whether to automatically flip caption orientation based on baseline direction
 * 
 * @returns Array of Bar objects with reactive height values and labels
 */
export function labeledHedgeHogBars(
    group: RvgGroup,
    options: {
        baseline: Polyline,
        bars: ({ style?: string, caption?: string }[]) | number,
        barWidth: number | Real,
        barDistance?: number | Real,
        defaultStyle?: string,
        valueLabels?: {
            style: string,
            autoFlip?: boolean,
            distance: number | Real | Real[],
        },
        barCaptions?: {
            style: string,
            autoFlip?: boolean
        }
    }
): Bar[] {
    const internalBars = (typeof options.bars === "number")
        ? Array.from({length: options.bars}, () => ({style: undefined, caption: undefined}))
        : options.bars

    const baseline = options.baseline

    // Bars grow outward from each polyline segment
    const result = hedgeHogBars(group, {
        baseline: options.baseline,
        bars: internalBars,
        barWidth: options.barWidth,
        barDistance: options.barDistance,
        defaultStyle: options.defaultStyle
    })

    // Create labels
    const barValueLabels = createBarValueLabels()
    const barCaptions = createBarCaptions()

    // Attach labels to bars
    for (let i = 0; i < result.length; i++) {
        result[i].caption = i < barCaptions.length ? barCaptions[i] : undefined
        result[i].valueLabel = i < barValueLabels.length ? barValueLabels[i] : undefined
        if(options.valueLabels && Array.isArray(options.valueLabels.distance)){
            result[i].valueLabelDistance = options.valueLabels.distance[i]
        }
    }

    return result

    function createBarCaptions() {
        if (options.barCaptions) {
            const labels = internalBars.map(bar => bar.caption ?? "")
            return Labels.labelsAlongPolyline(group, {
                baseline,
                labels,
                ...options.barCaptions,
            })
        }
        return []
    }

    function createBarValueLabels() {
        if (options.valueLabels) {
            return Labels.labelsAtRectangles(group, {
                rectangles: result.map(bar => bar.shape),
                labels: result.length,
                ...options.valueLabels,
            })
        }
        return []
    }
}

/**
 * Creates bars anchored along a polyline baseline.
 * Each bar attaches to a segment of the polyline and grows perpendicular to it.
 *
 * @param group - Group that owns the bars
 * @param options - Configuration object containing baseline, bars, width, distance, and style
 * @returns Array of Bar objects with reactive height values
 */
export function hedgeHogBars(
    group: RvgGroup,
    options: {
        baseline: Polyline,
        bars: ({ style?: string }[]) | number,
        barWidth: number | Real,
        barDistance?: number | Real,
        defaultStyle?: string,
    }
): Bar[] {
    const bw = Conversion.toReal(options.barWidth)
    const distance = Conversion.toReal(options.barDistance ?? 0)
    const defaultStyle = options.defaultStyle ?? DEFAULT_BAR_STYLE
    const baseline = options.baseline
    const bars = options.bars

    const internalBars = (typeof bars === "number"
            ? Array.from({length: bars}, () => ({style: undefined}))
            : bars
    ).slice(0, baseline.elements.length - 1)

    const barShapes: Bar[] = []

    internalBars.forEach((bar, index) => {
        const style = bar.style ?? defaultStyle
        const height = group.values.real()
        const pin = group.values.pin()

        Attach.pointToShapeSegment(pin, baseline, index, {
            distance: distance
        })

        const shape = group.visuals.rectangle(style)
        Attach.rectangleToPoint(shape, pin, {
            width: bw,
            height: height,
            anchorY: "bottom"
        })

        barShapes.push({shape, height})
    })

    return barShapes
}
