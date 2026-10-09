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
 * Each label attaches to the centre of one segment of the polyline.
 *
 * @param group - Group that owns the labels
 * @param options - Configuration object
 * @param options.baseline - The polyline; label i sits on the segment from vertex i to i+1
 * @param options.labels - Label strings or descriptions; extra labels beyond the segment count are dropped
 * @param options.distance - Optional distance from the segment, to its left. Defaults to 0
 * @param options.style - Optional default style for labels given as plain strings
 * @param options.autoFlip - Turn labels on right-to-left segments so they stay readable. Defaults to true
 * @returns Array of RvgAnchoredText elements
 */
export function labelsAlongPolyline(
    group: RvgGroup,
    options: {
        baseline: Polyline,
        labels: string[] | LabelDescription[],
        distance?: number | Real,
        style?: string,
        autoFlip?: boolean
    }
): RvgAnchoredText[] {
    const style = options.style ?? DEFAULT_LABEL_STYLE
    const autoFlip = options.autoFlip ?? true
    const baseline = options.baseline
    const labels = options.labels
        .map(l => typeof l === "string" ? {text: l, style: style} : l)
        .slice(0, baseline.elements.length - 1)

    const outLabels: RvgAnchoredText[] = []

    labels.forEach((label, index) => {
        const text = group.text.label(label.text, true, 0, 0, autoFlip, label.style)
        Attach.pointToShapeSegment(text, baseline, index, {distance: options.distance ?? 0})
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
 * @param options.rectangles - Array of rectangles to attach labels to. Each label corresponds to one rectangle
 * @param options.labels - Either an array of label strings/descriptions, or a number specifying how many empty labels to create
 * @param options.distance - Optional distance offset from the rectangle edge where labels are positioned. Can be a number, Real, or array of Real values for per-label distances. Defaults to 0
 * @param options.style - Optional default style directive applied to labels without explicit style
 * @param options.placement - Optional edge placement for labels: "left", "right", "top", or "bottom"
 * @param options.position - Optional position along the edge: "start", "center", "end", or a number/Real value
 * @param options.angle - Optional rotation angle for labels in radians. Defaults to 0
 * @param options.autoFlip - Optional flag to automatically flip label orientation based on rectangle orientation. Defaults to false
 * @returns Array of RvgAnchoredText elements
 */
export function labelsAtRectangles(
    group: RvgGroup,
    options: {
        rectangles: Rectangle[],
        labels: string[] | LabelDescription[] | number,
        distance?: number | Real | Real[],
        style?: string,
        placement?: "left" | "right" | "top" | "bottom",
        position?: "start" | "center" | "end" | Real | number,
        angle?: number,
        autoFlip?: boolean
    }
): RvgAnchoredText[] {
    const style = options.style ?? DEFAULT_LABEL_STYLE
    const distance = Array.isArray(options.distance) ?  options.distance: Conversion.toReal(options.distance ?? 0)
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
            distance: Array.isArray(distance) ? distance[index] : distance,
            orientation: "relative"
        })
        outLabels.push(text)
    })

    return outLabels
}