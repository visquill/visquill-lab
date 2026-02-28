import type { Point } from "@visquill/visquill-gdk";

/**
 * Top-level configuration for a single data lens.
 * Passed directly to `createDataLens` or `createInteractiveLens`.
 *
 * The scheme is purely declarative — it describes geometry, style, and which
 * plots to render. No reactive values are held here; the lens construction
 * functions translate these into reactive `Real`s internally.
 */
export interface DataLensScheme {

    /**
     * Optional CSS class prefix prepended to all style strings in this lens.
     * Useful for scoping styles or applying theme variants.
     * Example: `"dark-theme-"` transforms `"baseline"` → `"dark-theme-baseline"`.
     */
    stylePrefix?: string,
    
    /**
     * The data variable this lens represents (e.g. `"employment"`, `"income"`).
     * Used as a semantic identifier — not rendered directly, but available for
     * lookup when coordinating multiple lenses.
     */
    variable: string,

    /** Active arc width in radians. `2π` is a full circle. */
    radialSpan: number,

    /**
     * Angle in radians where the arc begins, measured clockwise from 3 o'clock.
     * Defaults to `0`. A value of `-π/2` starts the arc at 12 o'clock.
     */
    startAngle?: number,

    /** Radius of the lens' rim in canvas units. */
    rimRadius: number,

    /**
     * Outer boundary radius of the lens in canvas units.
     * Measured relative to `rimRadius` — typically extends beyond the rim.
     */
    outerRadius: number,

    /**
     * Inner boundary radius of the lens in canvas units.
     * Measured relative to `rimRadius` — typically lies inside the rim.
     */
    innerRadius: number,

    /**
     * Initial center position of the lens in canvas coordinates.
     * Defaults to `[0, 0]`. For interactive lenses the handle overrides this
     * after creation, so this acts as the initial placement only.
     */
    location?: Point,

    /** CSS class applied to the rim circle. Omit to render no rim. */
    rimStyle?: string,

    /** Optional display title rendered along the plot's arc baseline. */
    title?: DataLensTitleScheme,

    /** Initial aspect (dimension) this lens focuses on. */
    initialAspect: string,

    /**
     * The plots to render on this lens, in order.
     * Each plot receives an arc proportional to its number of categories:
     * a plot with twice as many categories gets twice the arc width.
     */
    plots: BarPlotScheme[],

    /** Configuration for visual changes when the lens collapses. */
    onCollapse?: {
        /** Rim radius in collapsed state. */
        rimRadius: number,
        /** Title radial offset in collapsed state. */
        titleRadius?: number,
        /** Inner radius in collapsed state. */
        innerRadius: number,
        /** Outer radius in collapsed state. */
        outerRadius: number,
    },
}

/**
 * Configuration for a title rendered along a lens arc.
 */
export interface DataLensTitleScheme {
    /** The string to render along the arc. */
    text: string,
    /** CSS class for the title text. */
    style: string,
    /** Radial offset from the rim. Positive = outward. */
    offset?: number,
    /** Minimum arc length in pixels. Title is hidden if shorter. */
    minLength?: number,
    /** Minimum radius in pixels. Title is hidden if smaller. */
    minRadius?: number
}

/**
 * Base interface for all plot types. Not used directly — extend this to define
 * a concrete plot type (see `HistogramScheme`, `BarPlotScheme`).
 */
export interface PlotScheme {
    /**
     * Discriminator string that identifies the plot type.
     * Used by `createDataLens` to select the correct attachment function.
     * Built-in value: `"bar-plot"`.
     */
    type: string,

    /**
     * The data aspect (dimension) this plot visualizes (e.g. `"gender"`, `"education"`).
     * Semantic identifier used for data binding — not rendered directly.
     */
    aspect: string,

    /**
     * Radial offset of the plot baseline from the lens rim, in canvas units.
     * Positive values push the baseline outward.
     */
    offset: number,

    /** CSS class applied to the arc baseline polyline. Omit to hide the baseline. */
    baselineStyle?: string,
}

/**
 * A plot scheme that renders a set of discrete categories along the arc.
 * Base for `BarPlotScheme`.
 */
export interface HistogramScheme extends PlotScheme {
    /**
     * The categories to render, one per bar or bin.
     * Order determines left-to-right placement along the arc.
     */
    categories: {
        /** CSS class applied to this category's bar or bin. */
        style: string,
        /** Short label rendered as the bar caption (e.g. `"A"`, `"M"`, `"25–34"`). */
        name: string,
    }[],
}

/**
 * Configuration for a hedgehog bar plot along a lens arc.
 * Each category in `categories` produces one bar, evenly distributed
 * along the arc baseline.
 *
 * @example
 * const scheme: BarPlotScheme = {
 *     type: "bar-plot",
 *     aspect: "education",
 *     offset: 20,
 *     barWidth: 20,
 *     barOffset: 13,
 *     baselineStyle: "@class baseline @style stroke: orange",
 *     barCaptions: { style: "bar-caption", autoFlip: true },
 *     valueLabels:  { style: "value-label", autoFlip: true, distance: 10 },
 *     categories: [
 *         { style: "cat-1", name: "Primary" },
 *         { style: "cat-2", name: "Secondary" },
 *         { style: "cat-3", name: "Tertiary" },
 *     ],
 * }
 */
export interface BarPlotScheme extends HistogramScheme {
    /** Discriminator — must be `"bar-plot"`. */
    type: "bar-plot",

    /** Maximum visual height of bars in canvas units. */
    maxHeight: number,
    /** Data value corresponding to `maxHeight`. */
    maxValue: number,
    /** Minimum data value (maps to zero height). Defaults to `0`. */
    minValue?: number,

    /** Width of each bar in canvas units. */
    barWidth: number,

    /** Gap between adjacent bars in canvas units. Defaults to no gap. */
    barOffset?: number,

    /** Maximum arc length in canvas units for the entire plot. */
    maxExtent?: number,

    /**
     * Numeric labels rendered at each bar tip.
     * Set `bar.valueLabel.value` after creation to update the displayed text.
     */
    valueLabels?: {
        /** CSS class applied to the value label text element. */
        style: string,
        /** Distance from the bar tip to the label, in canvas units. */
        distance: number,
        /**
         * When `true`, flips the label on the lower half of the arc so it
         * remains readable regardless of angular position.
         */
        autoFlip?: boolean,
    },

    /** Category name labels rendered directly on the bars. */
    barCaptions?: {
        /** CSS class applied to the bar caption text element. */
        style: string,
        /**
         * When `true`, flips the caption on the lower half of the arc so it
         * remains readable regardless of angular position.
         */
        autoFlip?: boolean,
    },

    /** Configuration for radial grid lines. */
    gridLines?: {
        /** Number of grid lines to draw. */
        count: number,
        /** CSS class for the grid line polylines. */
        style: string,
        /** CSS class for grid labels (if supported). */
        labelStyle?: string,
        /** Radial offset for the first grid line. */
        offset?: number
    }
}