import {Attach, type RvgGroup, type Real, type Polyline, type Rectangle, type RvgAnchoredText} from "@visquill/visquill-gdk"
import * as Conversion from "../../utils/conversion";

export interface LabelDescription {
    text: string,
    style: string
}

export const DEFAULT_LABEL_STYLE = "@style fill: black;" +
    "text-anchor: middle;" +
    "dominant-baseline: middle;" +
    "font-size: 14px;" +
    "user-select: none;" +
    "pointer-events: none;"

/**
 * Creates labels anchored along a polyline baseline.
 * Each label attaches to a segment of the polyline.
 *
 * @param group - Group that owns the labels
 * @param options - Configuration object containing baseline, labels, distance, and style
 * @returns Array of RvgAnchoredText elements
 */
export function labelsAlongPolyline(
    group: RvgGroup,
    options: {
        baseline: Polyline,
        labels: string[] | LabelDescription[],
        distance?: number | Real,
        style?: string
    }
): RvgAnchoredText[] {
    const style = options.style ?? DEFAULT_LABEL_STYLE
    const baseline = options.baseline
    const labels = options.labels
        .map(l => typeof l === "string" ? {text: l, style: style} : l)
        .slice(0, baseline.elements.length - 1)

    const outLabels: RvgAnchoredText[] = []

    labels.forEach((label, index) => {
        const text = group.text.label(label.text, true, 0, 0, true, label.style)
        Attach.pointToShapeSegment(text, baseline, index)
        outLabels.push(text)
    })

    return outLabels
}

/**
 * Creates labels anchored at rectangle edges.
 * Each label attaches to a specific edge of its corresponding rectangle.
 *
 * @param group - Group that owns the labels
 * @param options - Configuration object containing rectangles, labels, placement, and styling
 * @returns Array of RvgAnchoredText elements
 */
export function labelsAtRectangles(
    group: RvgGroup,
    options: {
        rectangles: Rectangle[],
        labels: string[] | LabelDescription[] | number,
        distance?: number | Real,
        style?: string,
        placement?: "left" | "right" | "top" | "bottom",
        position?: "start" | "center" | "end" | Real | number,
        angle?: number,
        autoFlip?: boolean
    }
): RvgAnchoredText[] {
    const style = options.style ?? DEFAULT_LABEL_STYLE
    const distance = Conversion.toReal(options.distance ?? 0)
    const angle = options.angle ?? 0
    const autoFlip = options.autoFlip ?? false
    const rectangles = options.rectangles

    const labels = (typeof options.labels === "number"
            ? Array(options.labels).fill("")
            : options.labels
    )
        .map(l => typeof l === "string" ? {text: l, style: style} : l)
        .slice(0, rectangles.length)

    const outLabels: RvgAnchoredText[] = []

    labels.forEach((label, index) => {
        const rectangle = rectangles[index]
        const text = group.text.label(label.text,  true, angle, 0, autoFlip, label.style)
        Attach.pointToRectangleEdge(text, rectangle, {
            placement: options.placement,
            anchorPosition: options.position,
            distance: distance,
            orientation: "relative"
        })
        outLabels.push(text)
    })

    return outLabels
}