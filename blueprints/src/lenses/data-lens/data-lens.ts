import {
    Animate,
    Attach,
    type Point,
    Reactive,
    Vectors,
    type RvgGroup,
    type Bool,
    type Real, type Box, Boxes, type StringValue, Circles
} from "@visquill/visquill-gdk";
import type { BarPlotScheme, DataLensScheme } from "./schemes";
import {
    attachBarPlot,
    createLens,
    createRingSpan,
    type BarPlot,
    type Lens,
    createBoundedRing,
    attachTitle, attachGridLines
} from "../lens-kit";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Assignment of arc position and size to a lens.
 * Returned by arc layout functions.
 */
export interface ArcAssignment {
    lens: Lens,
    radialSpan: number,
    anchorAngle: number,
}

/**
 * Function that assigns arcs to lenses in a connected component.
 * Receives all lenses in the component, returns their arc assignments.
 */
export type ArcLayoutFunction = (component: Lens[], arcGap: number) => ArcAssignment[]

/**
 * A `Lens` populated with one or more bar plots, laid out from a `DataLensScheme`.
 * Each plot's arc width is proportional to its number of categories.
 */
export interface DataLens extends Lens {
    /** One entry per plot defined in the scheme, in declaration order. */
    plots: BarPlot[],
    size: Real,
    outerRadius: Real,
    innerRadius: Real,
    aspect: StringValue
}

/**
 * A `DataLens` with a draggable disk handle attached to its center.
 * Moving the handle moves the lens and all its content.
 */
export interface InteractiveLens extends DataLens {
    /** The drag handle point. Attach UI interactions here rather than directly to `location`. */
    handle: Point,
}

/**
 * Options for configuring proximity-based arc-sharing behavior.
 */
export interface ProximityGroupOptions {
    /**
     * Distance threshold in canvas units.
     * Lenses within this distance form a connected component.
     * Default: 100
     */
    threshold?: number,

    /**
     * Function that assigns arcs to lenses in a component.
     * Receives all lenses in the component, returns arc assignments.
     *
     * Built-in presets available as `arcLayouts` export:
     * - `arcLayouts.equal`: divide 2π equally among all lenses
     * - `arcLayouts.weighted`: proportional to lens radius
     * - `arcLayouts.preserve`: keep original radialSpan, just rotate to fit
     *
     * Default: arcLayouts.equal
     */
    arcLayout: ArcLayoutFunction,

    /**
     * Gap between adjacent arcs as a fraction of 2π.
     * Default: 0.01 (1%)
     */
    arcGap?: number,

    /**
     * Animation duration in milliseconds.
     * Set to 0 for instant transitions.
     * Default: 1000
     */
    animationDuration?: number,
}

/**
 * Options for configuring a group of interactive lenses that can snap together.
 */
interface SnapGroupOptions {
    /**
     * Distance threshold for snapping together in canvas units.
     * Default: 50
     */
    snapDistance?: number,

    /**
     * Distance threshold for breaking apart (un-snapping) in canvas units.
     * Must be >= snapDistance to create a hysteresis effect.
     * When not provided, uses snapDistance (no hysteresis).
     * Default: same as snapDistance
     */
    unsnapDistance?: number,
}

/**
 * A collection of lenses that visually respond to proximity by sharing arc.
 */
export interface ProximityGroup {
    /** All lenses in this proximity group. */
    lenses: Lens[],

    /**
     * Reactive boolean controlling whether proximity adaption is active.
     * Write `active.value = false` to disable proximity adaption.
     * Write `active.value = true` to re-enable.
     */
    active: Bool,
}

/**
 * A collection of interactive lenses that can snap their centers together.
 */
export interface SnapGroup {
    /** All interactive lenses in this snap group. */
    lenses: InteractiveLens[],

    /**
     * Reactive boolean controlling whether snapping is active.
     * Write `active.value = false` to disable snapping.
     * Write `active.value = true` to re-enable.
     */
    active: Bool,
}
/**
 * A collection of interactive lenses that coordinate with each other.
 * Proximity-based snapping and arc-sharing are managed internally.
 */
export interface LensGroup {
    /** All lenses in the group, in the order their schemes were passed to `createLensGroup`. */
    lenses: InteractiveLens[],
    /** The proximity group managing arc-sharing for these lenses. */
    proximityGroup: ProximityGroup,
    /** The snap group managing handle snapping for these lenses. */
    snapGroup: SnapGroup,
}




// ─── DataLens ─────────────────────────────────────────────────────────────────

/**
 * Creates a lens from a `DataLensScheme`, automatically laying out its plots along the arc.
 * Arc width per plot is proportional to its number of categories — a plot with twice as many
 * categories gets twice the arc. After creation, set bar heights via `plots[i].bars[j].height.value`.
 *
 * Use `createInteractiveLens` instead if you need a drag handle.
 *
 * @param group - The parent layer to create the lens in.
 * @param scheme - Declarative configuration for geometry, style, and plots.
 * @returns A `DataLens` with a `plots` array parallel to `scheme.plots`.
 */
export function createDataLens(group: RvgGroup, scheme: DataLensScheme): DataLens {
    const lens = createLens(group,{...scheme,rimStyle: undefined})
    const size =lens.layer.values.real(1.0);
    const aspect = lens.layer.values.string(scheme.initialAspect)
    const outerRadius = lens.layer.values.real(scheme.outerRadius)
    const innerRadius = lens.layer.values.real(scheme.innerRadius)
    const baseRing = createBaseRing()

    const ringSpan = createRingSpan(baseRing)

    if(scheme.title){
        attachTitle(ringSpan, {
            ...scheme.title,
        })
    }

    const plots: BarPlot[] = scheme.plots.map(createBarPlotFromScheme)

    Reactive.do([aspect],()=>{
        plots.forEach((plot, index) => {
            const name = scheme.plots[index].aspect
            plot.layer.visible.value = aspect.value == name
        })
    })

    return { ...lens, plots, size, aspect, outerRadius,innerRadius }

    function createBaseRing(){
        const ring = createBoundedRing(lens,{...scheme,rimRadius: 0, stylePrefix:""})
        const ringContent = ring.layer.layer()
        // in order to ensure that the masking works correctly, we need a circle that describes the
        // outer boundary of the ring.
        const boundingCircle = ring.layer.visuals.circle("@style fill:none;")
        if(scheme.onCollapse){
            const onCollapse = scheme.onCollapse;
            Reactive.do([size,innerRadius,outerRadius],()=>{
                const ratio = size.value;
                ring.innerRadius.value = innerRadius.value*ratio + (1-ratio)*onCollapse.innerRadius;
                ring.outerRadius.value = outerRadius.value*ratio + (1-ratio)*onCollapse.outerRadius;
                lens.radius.value = scheme.rimRadius*ratio + (1-ratio)*onCollapse.rimRadius;
                ringContent.mounted.value =size.value> 0
                Circles.circleAt([0,0],lens.radius.value+ring.outerRadius.value,boundingCircle)
            })
        }

        return {...ring,layer:ringContent}
    }
    function createBarPlotFromScheme(scheme: BarPlotScheme): BarPlot {
        const minVal = scheme.minValue ?? 0
        const maxHeight = scheme.maxHeight
        const diff = scheme.maxValue - minVal;

        const layer = ringSpan.ring.layer.layer()
        if(scheme.gridLines){
            const gridLayer = layer.layer()
            const gridLines = scheme.gridLines;
            attachGridLines(gridLayer,ringSpan,{...gridLines,vertexCount: scheme.categories.length+1,distance:maxHeight/(gridLines.count), maxExtent: scheme.maxExtent})
        }

        const barPlot = attachBarPlot(layer,ringSpan, {
            ...scheme,
            span: 1,
            position: 0.0,
        })
        const bars = barPlot.bars.map(bar => {
            const value = layer.values.real(0)
            const height = bar.height;

            Reactive.do([value],()=>{
                height.value = (value.value-minVal)/diff*maxHeight;
                if(bar.valueLabel){
                    bar.valueLabel.value = value.value.toFixed(2);
                }
            })

            return {...bar, height: value}
        });
        return {...barPlot,bars}
    }
}

// ─── InteractiveLens ──────────────────────────────────────────────────────────

/**
 * Creates a `DataLens` with a draggable disk handle wired to its center.
 * The lens location follows the handle reactively.
 *
 * Prefer `createLensGroup` when working with multiple lenses — it composes
 * this function internally and adds snapping and arc-sharing on top.
 *
 * @param canvas - The parent layer to create the lens and handle in.
 * @param scheme - Declarative configuration for geometry, style, and plots.
 * @param handleStyle - CSS class applied to the draggable disk handle at the lens center.
 * @returns An `InteractiveLens` extending `DataLens` with a `handle` point.
 */
export function createInteractiveLens(canvas: RvgGroup, scheme: DataLensScheme, handleStyle: string): InteractiveLens {
    const lens = createDataLens(canvas, scheme)
    const handle = canvas.handles.disk(handleStyle, scheme.location ?? [0, 0])
    Attach.pointToPoint(lens.location, handle)
    return { ...lens, handle }
}

// ─── ProximityGroup ───────────────────────────────────────────────────────────

/** Tracks which lenses are already in a proximity group to enforce single-membership. */
const lensToProximityGroup = new WeakMap<Lens, ProximityGroup>()

/**
 * Creates a proximity group that manages arc-sharing among lenses based on distance.
 *
 * **Visual arc-sharing.** Lenses are grouped by proximity into connected components.
 * When a component forms, arcs are assigned using the provided `arcLayout` function.
 * The default `arcLayouts.equal` divides the circle equally, giving solo lenses a
 * half-circle arc (`π` rad) pointing upward.
 *
 * **Single membership.** A lens can only belong to one proximity group at a time.
 * Attempting to add a lens that's already in another proximity group throws an error.
 *
 * @param canvas - The parent canvas layer.
 * @param lenses - Lenses to group. Can be `Lens` or `InteractiveLens`.
 * @param options - Configuration options (threshold, arcLayout, arcGap, animationDuration).
 * @returns A `ProximityGroup`.
 * @throws Error if any lens is already in another proximity group.
 *
 * @example
 * // Use default equal division
 * const group = createProximityGroup(canvas, [lens1, lens2])
 *
 * // Use weighted arc distribution
 * const group = createProximityGroup(canvas, [lens1, lens2], {
 *     arcLayout: arcLayouts.weighted,
 *     arcGap: 0.02,
 * })
 *
 * // Custom layout function
 * const group = createProximityGroup(canvas, [lens1, lens2], {
 *     arcLayout: (component) => {
 *         // Your custom logic
 *         return component.map((lens, i) => ({
 *             lens,
 *             radialSpan: Math.PI / component.length,
 *             startAngle: -i * Math.PI / component.length,
 *         }))
 *     }
 * })
 */
export function createProximityGroup(
    canvas: RvgGroup,
    lenses: Lens[],
    options: ProximityGroupOptions
): ProximityGroup {
    // Enforce single membership
    for (const lens of lenses) {
        const existing = lensToProximityGroup.get(lens)
        if (existing) {
            throw new Error(
                "Lens is already in a proximity group. " +
                "Each lens can only belong to one proximity group at a time."
            )
        }
    }

    const threshold = options?.threshold ?? DEFAULT_PROXIMITY_THRESHOLD
    const arcLayout = options.arcLayout
    const arcGap = options?.arcGap ?? DEFAULT_ARC_GAP
    const animationDuration = options?.animationDuration ?? DEFAULT_ANIMATION_DURATION
    const active = canvas.values.bool(true)

    const locations = lenses.map(lens => lens.location)
    const lensesByLocation = new Map<Point, Lens>(
        lenses.map(lens => [lens.location, lens])
    )

    // Track this group for all its lenses
    const group: ProximityGroup = { lenses, active }
    for (const lens of lenses) {
        lensToProximityGroup.set(lens, group)
    }

    // Reactive connected-component tracking
    const components = canvas.values.item([])
    Reactive.do([...locations], () => {
        if(!active.value) return false;
        const newComponents = connectedComponents(locations, threshold)
        if(!areIdentical(newComponents, components.value)){
            components.value = newComponents;
        }
    })
    Reactive.do([active], () => {
        if(active.value){
            components.value = connectedComponents(locations, threshold)
        }else{
            components.value = locations.map(loc => [loc]);
        }
    })

    // Arc-sharing: apply layout function whenever grouping changes
    Reactive.do([components], () => {
        for (const component of (components.value as Point[][])) {
            const componentLenses = component.map(loc => lensesByLocation.get(loc)!)
            const assignments = arcLayout(componentLenses, arcGap)

            for (const assignment of assignments) {
                if (animationDuration > 0) {
                    Animate.eased(assignment.lens.radialSpan, assignment.radialSpan, animationDuration,{easing: Animate.easeOutBack})
                    Animate.eased(assignment.lens.anchorAngle, assignment.anchorAngle, animationDuration,{easing: Animate.easeOutBack})
                } else {
                    assignment.lens.radialSpan.value = assignment.radialSpan
                    assignment.lens.anchorAngle.value = assignment.anchorAngle
                }
            }
        }
    })

    return group

    function areIdentical(components1: Point[][], components2: Point[][]){
        if(components1.length !== components2.length) return false;
        for(let i = 0; i < components1.length; i++){
            const c1 = components1[i];
            const c2 = components2[i];
            if(c1.length !== c2.length) return false;
            for(let j = 0; j < c1.length; j++){
                if(c1[j] !== c2[j]) return false;
            }
        }
        return true;
    }
}

// ─── SnapGroup ────────────────────────────────────────────────────────────────

/** Tracks which interactive lenses are already in a snap group to enforce single-membership. */
const lensToSnapGroup = new WeakMap<InteractiveLens, SnapGroup>()

/**
 * Creates a snap group that merges lens handles when they come close together.
 *
 * **Proximity snapping.** When lenses within the same snap group come within
 * the snap distance AND are in the same connected component (based on that distance),
 * their handles merge together. This creates the effect of lenses "sticking" to each
 * other when dragged close.
 *
 * **Single membership.** A lens can only belong to one snap group at a time.
 * Attempting to add a lens that's already in another snap group throws an error.
 *
 * @param canvas - The parent canvas layer.
 * @param lenses - Interactive lenses to enable snapping for. Must have drag handles.
 * @param options - Configuration options (distance).
 * @returns A `SnapGroup`.
 * @throws Error if any lens is already in another snap group.
 *
 * @example
 * const snapGroup = createSnapGroup(canvas, [lens1, lens2, lens3])
 *
 * // Custom snap distance
 * const snapGroup = createSnapGroup(canvas, [lens1, lens2], {
 *     distance: 30,
 * })
 */
export function createSnapGroup(
    canvas: RvgGroup,
    lenses: InteractiveLens[],
    options?: SnapGroupOptions
): SnapGroup {
    // ... existing validation ...

    const snapDistance = options?.snapDistance ?? DEFAULT_SNAP_DISTANCE
    const unsnapDistance = options?.unsnapDistance ?? snapDistance

    if (unsnapDistance < snapDistance) {
        throw new Error(
            `unsnapDistance (${unsnapDistance}) must be >= snapDistance (${snapDistance})`
        )
    }

    const active = canvas.values.bool(true)  // 1 = true, 0 = false

    const group: SnapGroup = { lenses, active }
    for (const lens of lenses) {
        lensToSnapGroup.set(lens, group)
    }

    const locations = lenses.map(lens => lens.location)
    const lensesByLocation = new Map<Point, InteractiveLens>(
        lenses.map(lens => [lens.location, lens])
    )

    const snappedTo = new Map<Point, Set<Point>>()
    lenses.forEach(lens => snappedTo.set(lens.location, new Set()))

    lenses.forEach(lens => {
        Reactive.do([lens.location, active], () => {  // <- also react to active changes
            // If inactive, clear all snaps and return early
            if (!active.value) {
                snappedTo.get(lens.location)!.clear()
                return
            }

            const mySnaps = snappedTo.get(lens.location)!

            for (const otherLocation of locations) {
                if (otherLocation === lens.location) continue

                const distance = dist(otherLocation, lens.location)
                const currentlySnapped = mySnaps.has(otherLocation)

                if (currentlySnapped) {
                    if (distance > unsnapDistance) {
                        mySnaps.delete(otherLocation)
                    } else {
                        const otherLens = lensesByLocation.get(otherLocation)!
                        Vectors.copy(lens.location, otherLens.handle)
                    }
                } else {
                    const otherLens = lensesByLocation.get(otherLocation)!
                    if (otherLens.size.value > 0 && distance <= Math.min(snapDistance,Math.max(lens.radius.value,otherLens.radius.value))) {
                        mySnaps.add(otherLocation)
                        const otherLens = lensesByLocation.get(otherLocation)!
                        Vectors.copy(lens.location, otherLens.handle)
                    }
                }
            }
        })
    })

    return group
}


// ─── Constants ────────────────────────────────────────────────────────────────

/** Default proximity threshold in canvas units. */
const DEFAULT_PROXIMITY_THRESHOLD = 100

/** Default snap distance in canvas units. */
const DEFAULT_SNAP_DISTANCE = 50

/** Default arc gap as a fraction of 2π. */
const DEFAULT_ARC_GAP = 0.01

/** Default animation duration in milliseconds. */
const DEFAULT_ANIMATION_DURATION = 1000

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Computes the Euclidean distance between two points.
 *
 * @param a - First point.
 * @param b - Second point.
 * @returns Distance in canvas units.
 */
function dist(a: Point, b: Point): number {
    return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Groups points into connected components using a flood-fill over a distance threshold.
 * Two points are in the same component if they are within `maxDistance` of any
 * other point already in the component (transitive — not just pairwise).
 * For small sets of lenses this is fast enough to be useful.
 */
function connectedComponents(points: Point[], maxDistance: number): Point[][] {
    const remaining = [...points]
    const result: Point[][] = []

    while (remaining.length) {
        const component: Point[] = []
        const stack = [remaining.pop()!]

        for (let i = 0; i < stack.length; i++) {
            const p = stack[i]
            component.push(p)
            for (let j = remaining.length - 1; j >= 0; j--) {
                if (dist(p, remaining[j]) <= maxDistance) {
                    stack.push(remaining[j])
                    remaining.splice(j, 1)
                }
            }
        }

        result.push(component)
    }

    return result
}

/**
 * Attaches a collapse behavior to a lens when it enters a specific box.
 * When the lens center is inside the box, its size is animated to 0.
 *
 * @param box - The boundary box that triggers collapse.
 * @param lens - The lens to collapse.
 * @param options - Optional configuration for animation.
 */
export function createDropBox(box: Box, lens: DataLens, options?: {
    /** Animation duration in milliseconds. */
    animationDuration?: number
}) {
    const collapsed = lens.layer.values.bool(false);
    Reactive.do([lens.location], () => {
        Boxes.containsPoint(box, lens.location, collapsed);
    })
    Reactive.do([collapsed], () => {
        if (options?.animationDuration) {
            Animate.eased(lens.size, collapsed.value ? 0 : 1, options.animationDuration);
        } else {
            lens.size.value = collapsed.value ? 0 : 1;
        }
    })
}