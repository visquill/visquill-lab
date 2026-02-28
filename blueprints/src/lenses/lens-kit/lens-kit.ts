import {
    Attach,
    type Circle, Circles,
    type Point, Reactive,
    type Real,
    type RvgGroup,
    type VectorLike,
} from "@visquill/visquill-gdk";
import {type Bar, labeledHedgeHogBars} from "../../basics/plots";

/** Number of polyline vertices used to approximate an arc for title labels. */
const ARC_APPROXIMATION = 15

// ─── Option interfaces ────────────────────────────────────────────────────────

interface RingOptions {
    /** Prefix applied to the layer name, used to namespace CSS styles. */
    stylePrefix?: string,
    /** CSS class applied to the rim circle. Omit for an invisible rim. */
    rimStyle?: string,
    /** Radius offset in canvas units, relative to the parent ring's rim. */
    rimRadius?: number,
}

/**
 * Options for configuring a ring with clipping boundaries.
 */
interface BoundedRingOptions extends RingOptions {
    /** Inward offset from the rim in canvas units that forms the inner edge of the mask. */
    innerRadius?: number,
    /** Outward offset from the rim in canvas units that forms the outer edge of the mask. */
    outerRadius?: number,
}

export interface LensOptions extends RingOptions {
    /** Initial center position of the lens. Accepts a `Point` or `[x, y]` tuple. */
    location?: Point | VectorLike,
    /** Radius of the lens in canvas units. */
    rimRadius: number,
    /** Width of the active arc in radians. `2π` is a full circle. */
    radialSpan?: number,
    /** Angle in radians where the arc begins, measured clockwise from 3 o'clock. Defaults to `0`. */
    startAngle?: number,
}

export interface BarPlotOptions {
    /** Width of each bar in canvas units. */
    barWidth: number,
    /** Distance between adjacent bars in canvas units. */
    barOffset?: number,
    /** CSS class applied to the arc baseline polyline. */
    baselineStyle?: string,
    /** One entry per bar. Each defines the bar's CSS class and its caption text. */
    categories: { style: string, name: string }[],
    /** Radial offset of the baseline from the rim in canvas units. */
    offset?: number,
    /** Width of the plot within its ring span, as a fraction of the span's arc. Defaults to `1`. */
    span?: number,
    /** Start position of the plot within its ring span, as a fraction. Defaults to `0`. */
    position?: number,
    /** Configuration for numeric labels rendered at bar tips. */
    valueLabels?: {
        /** CSS class applied to the value label text. */
        style: string,
        /** Distance from the bar tip to the label in canvas units. */
        distance: number,
        /** When `true`, flips the label on the lower half of the arc to keep it readable. */
        autoFlip?: boolean
    },
    /** Configuration for category name labels rendered on the bars. */
    barCaptions?: {
        /** CSS class applied to the bar caption text. */
        style: string,
        /** When `true`, flips the caption on the lower half of the arc to keep it readable. */
        autoFlip?: boolean
    },
    /** Maximum arc length in canvas units. If the calculated arc is longer, it will be capped. */
    maxExtent?: number
}

// ─── Shape types ──────────────────────────────────────────────────────────────

/**
 * The base geometric type. A circle with a reactive radius and a defined active arc.
 * All other shapes in the kit extend or compose `Ring`.
 */
export interface Ring {
    /** The layer that owns all children of this ring. Append child visuals here. */
    layer: RvgGroup,
    /** The rendered circle shape. Reflects `radius` reactively. */
    rim: Circle,
    /** Reactive radius in canvas units. Writing `.value` resizes the ring and all attached content. */
    radius: Real,
    /** Reactive start angle of the active arc in radians, measured clockwise from 3 o'clock. */
    anchorAngle: Real,
    /** Reactive arc width in radians. `2π` is a full circle. */
    radialSpan: Real,
}

/**
 * A slice of a `Ring`'s active arc. The unit of attachment for all arc-positioned content.
 * `start` and `extent` are fractions of the parent ring's `radialSpan`, so spans
 * stay proportional when the ring's arc changes.
 */
export interface RingSpan {
    /** The parent ring this span is defined on. */
    ring: Ring,
    /** Reactive width of this span as a fraction of the ring's `radialSpan`. `1` covers the full arc. */
    extent: Real,
    /** Reactive start position as a fraction of the ring's `radialSpan`. `0` = beginning of arc. */
    start: Real,
}

/**
 * A `Ring` anchored to a moveable point in the canvas.
 * Moving `location` moves the entire lens and all its children.
 */
export interface Lens extends Ring {
    /** Reactive center point of the lens in canvas coordinates. */
    location: Point,
}

/**
 * A `Ring` whose layer content is clipped to an annular band.
 * Content outside the band is masked away automatically.
 */
export interface BoundedRing extends Ring {
    /** Reactive inward offset from the rim in canvas units. Content inside this radius is masked out. */
    innerRadius: Real,
    /** Reactive outward offset from the rim in canvas units. Content outside this radius is masked out. */
    outerRadius: Real,
}

/**
 * Hedgehog bar plot attached to a ring span.
 * Set `bars[i].height.value` to drive bar heights from data.
 */
export interface BarPlot {
    /** One `Bar` per category. Set `bar.height.value` to update the rendered bar. */
    bars: Bar[],
    /** Reactive start position of the plot within its ring span, as a fraction. */
    position: Real,
    /** Reactive width of the plot within its ring span, as a fraction. */
    span: Real,
    /** Reactive radial offset of the baseline from the rim in canvas units. */
    offset: Real,
    /** The layer that owns the plot visuals. */
    layer: RvgGroup
}

// ─── Constructors ─────────────────────────────────────────────────────────────

/**
 * Creates a lens: a styled circle anchored to a reactive point in the canvas.
 * The lens is the root object for building a visualization — attach ring spans,
 * plots, and titles to it.
 *
 * @param group - The parent layer to create the lens in.
 * @param options - Geometry and style configuration.
 * @returns A `Lens` with reactive `radius`, `startAngle`, `radialSpan`, and `location`.
 *
 * @example
 * const lens = createLens(canvas, {
 *     radius: 100,
 *     radialSpan: Math.PI * 1.5,
 *     startAngle: Math.PI / 2,
 *     location: { x: 300, y: 300 },
 *     rimStyle: "my-rim",
 * })
 */
export function createLens(group: RvgGroup, options: LensOptions): Lens {
    const layer = group.layer(options.stylePrefix ?? "")
    const rim = options.rimStyle ? layer.visuals.circle(options.rimStyle) : layer.shapes.circle()
    const location = layer.values.pin(options.location ?? [0, 0])
    const radius = layer.values.real(options.rimRadius ?? 100)
    const radialSpan = layer.values.real(options.radialSpan ?? Math.PI)
    const startAngle = layer.values.real(options.startAngle ?? -Math.PI / 2) // start angle is at the top by default
    Attach.pointToPoint(layer.anchor, location)
    Attach.circleRadiusToValue(rim, radius)
    return { rim, location, radius, layer, radialSpan, anchorAngle: startAngle }
}

/**
 * Defines a slice of a ring's active arc. Plots, polylines, and titles are attached
 * to spans rather than directly to rings, allowing multiple pieces of content to
 * coexist on a single ring without coupling to each other.
 *
 * `start` and `extent` are fractions of the ring's `radialSpan`, so they remain
 * proportional when the ring's arc is animated or resized.
 *
 * @param ring - The ring to slice.
 * @param options - Layout and style configuration.
 * @param options.start - Start of the span as a fraction of the ring's arc. Defaults to `0`.
 * @param options.extent - Width of the span as a fraction of the ring's arc. Defaults to `1`.
 * @returns A `RingSpan` with reactive `start` and `extent`.
 *
 * @example
 * const full  = createRingSpan(lens)
 * const left  = createRingSpan(lens, { start: 0,   extent: 0.5 })
 * const right = createRingSpan(lens, { start: 0.5, extent: 0.5 })
 */
export function createRingSpan(ring: Ring, options?: { extent?: number, start?: number}): RingSpan {
    const extent = ring.layer.values.real(options?.extent ?? 1.0)
    const start = ring.layer.values.real(options?.start ?? 0)
    return { extent, start, ring }
}

/**
 * Creates a child ring whose radius is an offset from its parent's rim.
 * The child inherits and stays in sync with the parent's `startAngle` and `radialSpan`.
 * Use this to build concentric layers radiating outward from a lens.
 *
 * @param parent - The ring to offset from.
 * @param options - Geometry and style configuration.
 * @param options.radius - Outward offset from the parent's rim in canvas units. Defaults to `0`.
 * @returns A new `Ring` that tracks the parent's geometry reactively.
 *
 * @example
 * const outer = createRing(lens, { radius: 20 })  // sits 20px outside the lens rim
 */
export function createRing(parent: Ring, options?: RingOptions): Ring {
    const layer = parent.layer.layer(options?.stylePrefix ?? "")
    const rim = options?.rimStyle ? layer.visuals.circle(options.rimStyle) : layer.shapes.circle()
    const radius = layer.values.real(options?.rimRadius ?? 0)
    Reactive.do([parent.radius, radius], () => {
        const parentRadius = Circles.radius(parent.rim)
        const globalRadius = parentRadius.value + radius.value
        Circles.circleAt([0, 0], globalRadius, rim)
    })
    return { ...parent, layer, rim, radius }
}

/**
 * Creates a child ring that masks its layer content to an annular band.
 * Everything drawn in the bounded ring's layer is clipped to the region between
 * `innerRadius` and `outerRadius`, measured as offsets from the ring's own rim.
 *
 * @param parent - The ring to offset from.
 * @param options - Geometry and style configuration.
 * @param options.innerRadius - Inward offset from the rim. Content inside this distance is hidden. Defaults to `0`.
 * @param options.outerRadius - Outward offset from the rim. Content outside this distance is hidden. Defaults to `0`.
 * @returns A `BoundedRing` with reactive `innerRadius` and `outerRadius`.
 *
 * @example
 * const band = createBoundedRing(lens, { innerRadius: 80, outerRadius: 20 })
 */
export function createBoundedRing(parent: Ring, options: BoundedRingOptions): BoundedRing {
    const ring = createRing(parent, options)
    const layer = ring.layer
    const innerRadius = layer.values.real(options?.innerRadius ?? 0)
    const outerRadius = layer.values.real(options?.outerRadius ?? 0)
    const globalInnerRadius = layer.values.real()
    const globalOuterRadius = layer.values.real()
    Reactive.do([ring.rim, innerRadius, outerRadius], () => {
        const radius = Circles.radius(ring.rim)
        globalInnerRadius.value = radius.value - innerRadius.value
        globalOuterRadius.value = radius.value + outerRadius.value
    })
    layer.mask.circle({ x: 0, y: 0 }, globalOuterRadius, "white")
    layer.mask.circle({ x: 0, y: 0 }, globalInnerRadius, "black")
    return { ...ring, innerRadius, outerRadius }
}

// ─── Attachments ──────────────────────────────────────────────────────────────

/**
 * Places a polyline along the arc defined by a ring span. This is the foundational
 * attachment primitive — `attachBarPlot` and `attachTitle` both delegate to this.
 *
 * The polyline's angular position is derived from `position` (where within the span
 * it starts) and its arc width from `span` (what fraction of the span it covers).
 * Both update reactively when the ring's `startAngle` or `radialSpan` changes,
 * so the polyline repositions automatically during animation.
 *
 * @param layer - The parent layer to create the polyline in.
 * @param ringSpan - The span to attach the polyline to.
 * @param options - Layout and style configuration.
 * @param options.vertexCount - Number of vertices. More = smoother arc approximation.
 * @param options.span - Width as a fraction of the span's arc. Defaults to `1`.
 * @param options.position - Start position as a fraction of the span's arc. Defaults to `0`.
 * @param options.offset - Radial offset from the rim in canvas units. Positive = outward. Defaults to `0`.
 * @param options.style - CSS class for the polyline. Omit for an invisible baseline.
 * @returns `{ baseline, position, span, offset }` — all numeric values are reactive `Real`s.
 */
export function attachPolyline(layer: RvgGroup, ringSpan: RingSpan, options: {
    style?: string,
    offset?: number,
    span?: number,
    position?: number,
    vertexCount: number,
    maxExtent?: number
}) {
    const ring = ringSpan.ring
    const span = layer.values.real(options.span ?? 1)
    const position = layer.values.real(options.position ?? 0)
    const angle = layer.values.real()
    const circleSpan = layer.values.real()
    const offset = layer.values.real(options.offset ?? 0)
    const maxExtent = layer.values.real(options.maxExtent ?? Number.MAX_VALUE)
    Reactive.do([span,ring.rim,maxExtent,position, ring.anchorAngle, ring.radialSpan, ringSpan.start, ringSpan.extent], () => {
        // compute the start angle of the ring span: we assume that the
        const startRingSpan = ringSpanStartAngle(ringSpan)
        const extentRingSpan = ringSpanExtent(ringSpan)
        const circumference = Circles.circumference(ring.rim).value
        const maxRingSpan = maxExtent.value/circumference*2*Math.PI
        const polylineSpan = extentRingSpan * span.value
        circleSpan.value = Math.max(Math.PI*0.001,Math.min(polylineSpan,maxRingSpan))
        angle.value = startRingSpan + extentRingSpan * position.value + polylineSpan/2
    })

    const baseline = options.style
        ? layer.visuals.polyline(options.style, options.vertexCount)
        : layer.shapes.polyline(options.vertexCount)
    Attach.polylineToCircle(baseline, ring.rim, circleSpan, {
        angle,
        distance: offset,
        anchorPosition: "center",
    })
    return { baseline, position, span, offset }
}

/**
 * Compute the start angle of a ring. Currently, it is assumed that the ring's
 * anchor is centered on the ring. '
 * @param ring
 */
function ringStartAngle(ring: Ring) {
    return ring.anchorAngle.value - ring.radialSpan.value/2
}

function ringSpanStartAngle(ringSpan: RingSpan) {
    const ring = ringSpan.ring
    const startAngle = ringStartAngle(ring)
    return startAngle + ring.radialSpan.value * ringSpan.start.value
}

function ringSpanExtent(ringSpan: RingSpan) {
    const ring = ringSpan.ring
    return ring.radialSpan.value * ringSpan.extent.value
}

/**
 * Places a labeled hedgehog bar plot along the arc of a ring span.
 * One bar is created per entry in `categories`, evenly distributed along the baseline.
 * After creation, set `bars[i].height.value` to drive bar heights from data.
 *
 * @param layer - The parent layer to create the bar plot in.
 * @param ringSpan - The span to attach the plot to.
 * @param options - Layout, style, and category configuration. See `BarPlotOptions`.
 * @returns A `BarPlot` with a `bars` array and reactive `position`, `span`, and `offset`.
 *
 * @example
 * const plot = attachBarPlot(span, {
 *     categories: [{ style: "bar-a", name: "Alpha" }, { style: "bar-b", name: "Beta" }],
 *     barWidth: 20,
 *     offset: 20,
 * })
 * plot.bars[0].height.value = 42
 * plot.bars[1].height.value = 87
 */
export function attachBarPlot(layer: RvgGroup, ringSpan: RingSpan, options: BarPlotOptions): BarPlot {
    const { baseline, position, span, offset } = attachPolyline(layer,ringSpan, {
        ...options,
        vertexCount: options.categories.length + 1,
        style: options.baselineStyle,
    })
    const bars = labeledHedgeHogBars(layer, {
        ...options,
        baseline,
        bars: options.categories.map(cat => ({ style: cat.style, caption: cat.name })),
        barDistance: options.barOffset,
    })
    return { bars, position, span, offset,layer}
}

/**
 * Draws multiple concentric arc polylines to represent a radial grid.
 *
 * @param layer - The layer to draw grid lines into.
 * @param ringSpan - The span defining the angular extent of the grid lines.
 * @param options - Configuration for number of lines, spacing, and style.
 */
export function attachGridLines(layer: RvgGroup, ringSpan: RingSpan, options: {
    /** Number of grid lines to draw. */
    count: number,
    /** Radial distance between adjacent grid lines. */
    distance: number,
    /** CSS class for the grid line polylines. */
    style: string,
    /** Radial offset for the first grid line. Defaults to `0`. */
    offset?: number,
    /** Number of vertices per grid line for arc approximation. */
    vertexCount: number,
    /** Maximum arc length in canvas units for capping. */
    maxExtent?: number,
}) {
    const startOffset = options.offset ?? 0
    for (let i = 0; i < options.count; i++) {
        attachPolyline(layer, ringSpan, {
            ...options,
            offset: i * options.distance + startOffset
        })
    }
}

/**
 * Places a text label that flows along the arc of a ring span.
 * The text is laid along a polyline arc approximation — increase `vertexCount`
 * for smoother curves at large radii.
 *
 * @param ringSpan - The span to attach the title to.
 * @param options - Layout and style configuration.
 * @param options.text - The string to render along the arc.
 * @param options.style - CSS class applied to the text element.
 * @param options.vertexCount - Arc approximation quality. Defaults to `15`.
 * @param options.baselineStyle - CSS class for the underlying arc polyline. Omit to hide it.
 * @param options.span - Width as a fraction of the span's arc. Defaults to `1`.
 * @param options.position - Start position as a fraction of the span's arc. Defaults to `0`.
 * @param options.offset - Radial offset from the rim in canvas units. Negative = inward toward center.
 * @param options.minLength - Minimum arc length in pixels. Text is hidden if shorter.
 * @param options.minRadius - Minimum radius in pixels. Text is hidden if smaller.
 * @param options.maxExtent - Maximum arc length in pixels. Arc is capped if longer.
 * @returns `{ text, position, span, offset }`.
 *
 * @example
 * attachTitle(span, {
 *     text: "Education",
 *     style: "my-title",
 *     position: 0.5,
 *     span: 0.8,
 *     offset: -30,
 * })
 */
export function attachTitle(ringSpan: RingSpan, options: {
    text: string,
    vertexCount?: number,
    baselineStyle?: string,
    span?: number,
    position?: number,
    offset?: number,
    minLength?: number
    minRadius?: number,
    maxExtent?: number
    style: string,
}) {
    const layer = ringSpan.ring.layer
    const vertexCount = options.vertexCount ?? ARC_APPROXIMATION
    const { baseline, position, offset, span } = attachPolyline(ringSpan.ring.layer,ringSpan, {
        ...options,
        vertexCount,
        style: options.baselineStyle,
    })
    const text = layer.text.labelAlongPolyline(options.text, baseline,options.style)
    if(options.minLength || options.minRadius) {
        const minLength = options.minLength
        const minRadius = options.minRadius
        Reactive.do([baseline], () => {
            const cover = ringSpan.ring.radialSpan.value * ringSpan.extent.value * span.value / (Math.PI * 2)
            const radius = Circles.radius(ringSpan.ring.rim).value
            if(minRadius && radius < minRadius) return ( text.visible.value = false)
            const circumference = 2 * Math.PI * radius
            const pixels = cover * circumference
            if(minLength && pixels < minLength) return ( text.visible.value = false)
            text.visible.value = true
        })
    }
    return { text, position, span, offset }
}