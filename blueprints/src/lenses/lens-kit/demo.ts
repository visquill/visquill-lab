import { Animate, Attach, Reactive, VisQuill } from "@visquill/visquill-gdk";
import * as Lenses from "./lens-kit";
import "./demo.css";

// ─────────────────────────────────────────────────────────────────────────────
// This demo shows the core lens-kit primitives in use:
//
//   createLens          — a draggable circle with a reactive radius and arc
//   createBoundedRing   — a masked annular band sitting on the lens
//   createRingSpan      — a slice of the ring's arc to attach content to
//   attachBarPlot       — a hedgehog bar plot along the arc
//   attachTitle         — arc-following text label
//
// Dragging the lens left collapses it; dragging it right expands it.
// The three plots each occupy a quarter of the arc, leaving a gap at the bottom.
// ─────────────────────────────────────────────────────────────────────────────

const COLLAPSE_THRESHOLD_X = 250  // px: drag left of this to collapse
const EXPAND_RADIUS         = 120  // canvas units: radius when expanded
const COLLAPSE_RADIUS       = 28   // canvas units: radius when collapsed
const BAND_OUTER            = 180  // canvas units: band width outward from rim
const BAND_INNER            = 40   // canvas units: band width inward from rim
const ANIMATION_MS          = 1000

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "blueprint-")
    const canvas = rvg.layer("lens-")

    // ── Lens ──────────────────────────────────────────────────────────────────

    const lens = Lenses.createLens(canvas, {
        rimRadius: EXPAND_RADIUS,
        rimStyle: "rim",
    })

    // ── Bounded ring: masks all plot content to an annular band ───────────────

    const band = Lenses.createBoundedRing(lens, {
        outerRadius: BAND_OUTER,
        innerRadius: BAND_INNER,
    })

    // ── Three plots, each on its own span ────────────────────────────────────
    //
    // The spans cover 0–75% of the arc (three × 0.29), leaving a gap at the bottom.
    // position/span are now owned by the span itself, not repeated on plot and title.

    const spanA = Lenses.createRingSpan(band, { start: 0.02, extent: 0.29 })
    const spanB = Lenses.createRingSpan(band, { start: 0.35, extent: 0.29 })
    const spanC = Lenses.createRingSpan(band, { start: 0.68, extent: 0.29 })

    attachPlot(spanA, "a", {
        title: "Region A",
        categories: [
            { style: "category-1", name: "N" },
            { style: "category-2", name: "S" },
            { style: "category-3", name: "E" },
            { style: "category-4", name: "W" },
        ],
        values: [82, 54, 67, 91],
    })

    attachPlot(spanB, "b", {
        title: "Region B",
        categories: [
            { style: "category-1", name: "N" },
            { style: "category-2", name: "S" },
            { style: "category-3", name: "E" },
            { style: "category-4", name: "W" },
            { style: "category-5", name: "C" },
        ],
        values: [45, 78, 33, 60, 88],
    })

    attachPlot(spanC, "c", {
        title: "Region C",
        categories: [
            { style: "category-1", name: "N" },
            { style: "category-2", name: "S" },
            { style: "category-3", name: "E" },
        ],
        values: [55, 40, 72],
    })

    // ── Drag handle ───────────────────────────────────────────────────────────

    const handle = canvas.handles.disk("handle", [400, 300])
    Attach.pointToPoint(lens.location, handle)

    // ── Reactive collapse / expand based on horizontal position ───────────────

    const collapsed = canvas.values.bool(false)

    Reactive.do([lens.location], () => {
        collapsed.value = lens.location.x < COLLAPSE_THRESHOLD_X
    })

    Reactive.do([lens.location], () => {
        const spans = [spanA, spanB, spanC]
        if (collapsed.value) {
            Animate.eased(lens.radius,      COLLAPSE_RADIUS, ANIMATION_MS)
            Animate.eased(band.outerRadius, 6,               ANIMATION_MS)
            Animate.eased(band.innerRadius, 2,               ANIMATION_MS)
            spans.forEach(s => Animate.eased(s.extent, 0, ANIMATION_MS))
        } else {
            Animate.eased(lens.radius,      EXPAND_RADIUS, ANIMATION_MS)
            Animate.eased(band.outerRadius, BAND_OUTER,    ANIMATION_MS)
            Animate.eased(band.innerRadius, BAND_INNER,    ANIMATION_MS)
            spans.forEach(s => Animate.eased(s.extent, 0.29, ANIMATION_MS))
        }
    })

    // ── Helper ────────────────────────────────────────────────────────────────

    function attachPlot(
        span: Lenses.RingSpan,
        colorKey: "a" | "b" | "c",
        options: {
            title: string,
            categories: { style: string, name: string }[],
            values: number[],
        }
    ) {
        const plot = Lenses.attachBarPlot(span.ring.layer,span, {
            baselineStyle: `baseline-${colorKey}`,
            barWidth: 16,
            barOffset: 10,
            categories: options.categories,
            offset: 20,
            barCaptions: { style: "bar-caption", autoFlip: true },
            valueLabels: { style: "value-label", autoFlip: true, distance: 8 },
        })

        Lenses.attachTitle(span, {
            text: options.title,
            style: "plot-title",
            offset: -10,
        })

        options.values.forEach((v, i) => {
            plot.bars[i].height.value = v
        })

        return plot
    }
}