// @name Controls
// @category Basics
import * as Conversion from "../../utils/conversion";

import {
    Attach,
    type Pin,
    type PinLike,
    type RvgGroup,
    type Real,
    type RvgAnchoredText, type RvgRectangle, Svg, type Point
} from "@visquill/visquill-gdk"
import type {Options} from "./options";

type GenericOptions = Options<any, any>

export const DEFAULT_LABEL_STYLE = "@style fill: whitesmoke;" +
    "text-anchor: middle;" +
    "dominant-baseline: middle;" +
    "font-size: 14px;" +
    "user-select: none;" +
    "pointer-events: none;"

/**
 * Creates a button rectangle with optional text label.
 * The button anchors at its bottom-left corner and grows right and up.
 *
 * @param group - Group that owns the button
 * @param options - Configuration object
 * @param options.bottomLeft - Anchor point for the bottom-left corner of the button
 * @param options.width - Width of the button in pixels (number or reactive Real)
 * @param options.height - Height of the button in pixels (number or reactive Real)
 * @param options.style - CSS class name for the button rectangle. Defaults to an inline dark-blue fill style
 * @param options.label - Optional label configuration
 * @param options.label.text - Text content of the label
 * @param options.label.style - CSS class name for the label. Defaults to {@link DEFAULT_LABEL_STYLE}
 * @param options.label.anchorX - Horizontal anchor of the label within the button: "left" | "center" | "right". Defaults to "center"
 * @param options.label.anchorY - Vertical anchor of the label within the button: "top" | "center" | "bottom". Defaults to "center"
 * @param options.onClick - Optional click handler attached to the button rectangle
 * @returns Object containing the button `frame` rectangle and optional `label` text element
 */
export function button(
    group: RvgGroup,
    options: {
        bottomLeft: Pin | PinLike,
        width: Real | number,
        height: Real | number,
        style?: string,
        label?: {
            text: string,
            style?: string,
            anchorX?: "center" | "left" | "right",
            anchorY?: "center" | "top" | "bottom"
        },
        onClick?: () => void
    }
): { frame: RvgRectangle, label?: RvgAnchoredText } {
    const style = options?.style ??  "@style fill: #3a7fc1; cursor: pointer;"
    const widthReal = Conversion.toReal(options.width)
    const heightReal = Conversion.toReal(options.height)
    const frame = group.visuals.rectangle(style)
    const pin = Conversion.toPin(options.bottomLeft)
    const onClick = options?.onClick
    if (onClick) {
        Svg.get(frame).addEventListener("click", onClick)
    }

    Attach.rectangleToPoint(frame, pin, {
        width: widthReal,
        height: heightReal,
        anchorX: "left",
        anchorY: "bottom"
    })

    if (options?.label) {
        const label = options.label
        const labelStyle = label.style ?? DEFAULT_LABEL_STYLE
        const anchorX = label.anchorX ?? "center"
        const anchorY = label.anchorY ?? "center"
        const labelVisual = group.text.labelAt(label.text, [0, 0], true, 0, 0, true, labelStyle)
        Attach.pointToRectangle(labelVisual, frame, {
            anchorX,
            anchorY
        })
        return {frame: frame, label: labelVisual}
    }

    return {frame: frame, label: undefined}
}

/**
 * Creates a button that cycles through an {@link Options} collection on each click.
 * The label automatically updates to display the current value via {@link Options.valueToString}.
 *
 * @param group - Group that owns the button
 * @param options - Configuration object
 * @param options.bottomLeft - Anchor point for the bottom-left corner of the button
 * @param options.width - Width of the button in pixels (number or reactive Real)
 * @param options.height - Height of the button in pixels (number or reactive Real)
 * @param options.style - style for the button rectangle.
 * @param options.labelStyle - style for the label text.
 * @param options.toggle - The {@link Options} instance to cycle through on each click.
 *   Calling `next()` on it advances the value and propagates the change to any bound reactive variables.
 *   The label is refreshed using `toggle.title` and `toggle.valueToString()`.
 * @returns Object containing the button `frame` rectangle and `label` text element
 */
export function toggleButton(
    group: RvgGroup,
    options: {
        bottomLeft: Pin | PinLike,
        width: Real | number,
        height: Real | number,
        style?: string,
        labelStyle?: string,
        toggle: GenericOptions,
    }
): { frame: RvgRectangle, label: RvgAnchoredText } {
    const {toggle} = options

    const btn = button(group, {
        bottomLeft: options.bottomLeft,
        width: options.width,
        height: options.height,
        style: options.style,
        label: {
            text: `${toggle.title}: ${toggle.valueToString()}`,
            style: options.labelStyle
        },
    })

    const labelEl = Svg.get(btn.label!) as SVGTextElement

    Svg.get(btn.frame).addEventListener("click", () => {
        toggle.next()
        labelEl.textContent = `${toggle.title}: ${toggle.valueToString()}`
    })

    return {frame: btn.frame, label: btn.label!}
}

/**
 * Creates a vertical stack of {@link toggleButton} controls, one per {@link Options} entry.
 * Each button cycles its Options collection on click, updating both the reactive variable(s)
 * bound to it and the displayed label.
 *
 * @param group - Group that owns the panel
 * @param options - Optional layout and style overrides
 * @param options.anchor - Position of the top-left corner of the panel
 * @param options.entries - Array of {@link Options} instances, one per button row
 * @param options.width - Button width in pixels. Defaults to 120
 * @param options.height - Button height in pixels. Defaults to 24
 * @param options.gap - Vertical distance between button bottoms in pixels. Defaults to 30
 * @param options.style - style applied to every button rectangle
 * @param options.labelStyle - style applied to every button label
 * @returns Array of `{ frame, label }` objects, one per entry, in the same order as `entries`
 */
export function optionsPanel(
    group: RvgGroup,
    options: {
        anchor: Point,
        entries: GenericOptions[],
        width?: number,
        height?: number,
        gap?: number,
        style?: string,
        labelStyle?: string,
    }
): { frame: RvgRectangle, label: RvgAnchoredText }[] {
    const width = options?.width ?? 120
    const height = options?.height ?? 24
    const gap = options?.gap ?? 30
    const anchor = options.anchor
    const entries = options.entries
    return entries.map((entry, index) => {
        const bottomLeft = {x: anchor.x, y: anchor.y + index * gap}
        return toggleButton(group, {
            bottomLeft,
            width,
            height,
            style: options?.style,
            labelStyle: options?.labelStyle,
            toggle: entry,
        })
    })
}