// @name Focused Route Chart
// @category Maps

/**
 * Combines map reprojection, polyline windowing, hull baseline, and
 * perpendicular curve plotting into a single interactive chart.
 *
 * A route is defined as lat/lng waypoints and reprojected to screen pixels
 * on every render frame. The visible portion of the route is found
 * automatically from the viewport frame — the "soft window" — using the
 * same windowing algorithm from the Polyline Windowing demo.
 *
 * startPos and endPos are updated directly on each frame (no follow lag),
 * so the chart snaps precisely to the visible window on every pan and zoom.
 *
 * The windowed slice drives a convex hull baseline (hull + offset). Anchor
 * pins at the slice start/end — rotated perpendicular to the route — locate
 * the far side of the hull to use as the baseline. Data points are then
 * positioned on the baseline via Polylines.pinsAtDistances and displaced
 * perpendicularly using Pins.rotateLeft + Pins.moveForward.
 *
 * New concepts relative to the prerequisite demos:
 *   - Reactive.block to batch reprojection + windowing + plotting
 *   - The viewport frame as the window box (no explicit handles needed)
 *   - Polylines.pinsAt to find oriented anchors at route positions
 */

import {
    Reactive, Boxes, Polylines,
    Polygons, ConvexHulls, Offsets, Pins, Cast,
    type Box, type Polyline,
} from "@visquill/visquill-gdk";
import { MapAdapter } from "../utils/map-adapter";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";
import { ROUTE } from "./route";
import {segmentBoxIntersection} from "../../utils/geometry";

// ── Simulated data ────────────────────────────────────────────────────────────
//
// Values defined in normalised route space [0, 1].
// The route reprojects every frame so pixel distances are not stable —
// normalised positions are the correct coordinate for map data.

const SAMPLE_COUNT = 600;
const DATA: { pos: number; value: number }[] = Array.from(
    { length: SAMPLE_COUNT }, (_, i) => {
        const t = i / SAMPLE_COUNT;
        const v = 70 * Math.exp(-((t - 0.35) ** 2) / 0.008)
            + 90 * Math.exp(-((t - 0.65) ** 2) / 0.012)
            + 15 * Math.sin(t * Math.PI * 10) * Math.exp(-t * 3);
        return { pos: t, value: Math.max(0, v) };
    }
);

// ── Constants ─────────────────────────────────────────────────────────────────

const SMOOTHING   = 2;
const OFFSET      = 70;
const FRAME_INSET = 40;

export function run(container: HTMLDivElement): void {

    // ── 1. Mount ──────────────────────────────────────────────────────────────

    const { map, rvg } = MapAdapter.create(container, "maps-focused-", {
        center: [8.0, 49.8],
        zoom:   7,
    });

    const canvas = rvg.canvas;

    // ── 2. Window positions ───────────────────────────────────────────────────

    const startPos = canvas.values.real(0.1);
    const endPos   = canvas.values.real(0.9);

    // ── 3. Route visual ───────────────────────────────────────────────────────

    const routeLayer = canvas.layer("route-");
    const route      = routeLayer.visuals.polyline("line");

    const segPrefix = routeLayer.visuals.polyline("seg-prefix");
    const segSlice  = routeLayer.visuals.polyline("seg-slice");
    const segSuffix = routeLayer.visuals.polyline("seg-suffix");

    // ── 4. Chart visuals ──────────────────────────────────────────────────────

    const chartLayer   = canvas.layer("chart-");
    const baseline     = chartLayer.visuals.polyline("baseline");
    const curveFill    = chartLayer.visuals.polygon("curve-fill");
    const curveOutline = chartLayer.visuals.polyline("curve-outline");

    // ── 5. Main update loop ───────────────────────────────────────────────────
    //
    // Runs on every MapLibre render frame. Reactive.block batches all writes
    // so dependents fire only once per frame.
    //
    // Order matters:
    //   a) Reproject route from lat/lng to screen pixels
    //   b) Find focused window from the current viewport frame
    //   c) Update startPos/endPos to the window boundaries
    //   d) Rebuild the chart from the current positions

    map.onRender(() => {
        Reactive.block(() => {
            // a) Reproject
            const screen = ROUTE.map(p => map.latLngToScreen(p));
            const smoothed = Polylines.toReversedPolyline(Polylines.smooth(screen, SMOOTHING));
            Polylines.copy(smoothed, route);

            // b) Find focused window
            const window = focusedWindow(route, rvg.frame, FRAME_INSET);

            // c) Update positions
            if (window) {
                startPos.value = window.start;
                endPos.value   = window.end;
            }

            // d) Rebuild chart
            updateChart();
        });
    });

    function updateChart(): void {
        const start = startPos.value;
        const end   = endPos.value;

        // Route segments
        Polylines.slicePrefix(route, start,     segPrefix);
        Polylines.slice(route, start, end,      segSlice);
        Polylines.sliceSuffix(route, end,       segSuffix);

        // Slice for hull input
        const slice = Polylines.slice(route, start, end);
        if (slice.elements.length < 2) return;

        // ── Hull baseline ─────────────────────────────────────────────────────
        //
        // Pins at the slice start/end give us the local route direction.
        // Rotating each pin left (90°) points perpendicular to the route —
        // moving forward by OFFSET from those pins gives anchor points on the
        // far side of the hull, which locate the baseline arc via
        // Polygons.closestPosition.

        const hull       = ConvexHulls.topStart(slice);
        const offsetHull = Offsets.polygon(hull, OFFSET, true, 1);

        const dirs = Polylines.pinsAt(route, [{ value: start }, { value: end }]);
        const a1   = Pins.moveForward(Pins.rotateLeft(dirs[0]), OFFSET);
        const a2   = Pins.moveForward(Pins.rotateLeft(dirs[1]), OFFSET);
        const pos1 = Polygons.closestPosition(offsetHull, a1);
        const pos2 = Polygons.closestPosition(offsetHull, a2);

        Polygons.slice(offsetHull, pos1, pos2, baseline);

        // ── Sample and plot ───────────────────────────────────────────────────
        //
        // Data is in normalised route space [0, 1] — stable across zoom.
        // Each visible point is mapped to a baseline distance proportional to
        // its position within the window, placed on the baseline via
        // pinsAtDistances, then displaced perpendicularly by its value.

        const baselineLen = Polylines.len(baseline).value;

        const visible = DATA.filter(d => d.pos >= start && d.pos <= end);
        if (visible.length < 2) {
            curveFill.elements.length    = 0;
            curveOutline.elements.length = 0;
            return;
        }

        const baselineDists = visible.map(d => ({
            value: ((d.pos - start) / (end - start)) * baselineLen,
        }));

        const pins = Polylines.pinsAtDistances(baseline, baselineDists);

        const curvePoints = pins.map((pin, i) => {
            const displaced = Pins.moveForward(Pins.rotateLeft(pin), visible[i].value);
            return { x: displaced.x, y: displaced.y };
        });

        Polylines.copy(curvePoints, curveOutline);

        Polylines.concatenate(
            Polylines.toReversedPolyline(curveOutline),
            baseline,
            Cast.asPolyline(curveFill)
        );
    }
}

// ── Focused window ────────────────────────────────────────────────────────────

interface WindowResult { start: number; end: number }

function focusedWindow(
    polyline: Polyline,
    frame:    Box,
    inset:    number
): WindowResult | null {
    const box   = Boxes.inflate(frame, -inset, -inset);
    const verts = polyline.elements;
    const n     = verts.length;
    let first = -1, last = -1;

    for (let i = 0; i < n; i++) {
        if (Boxes.containsPoint(box, verts[i]).value) {
            if (first === -1) first = i;
            last = i;
        }
    }

    if (first === -1) return null;

    // If the route starts inside the box use the first vertex directly;
    // otherwise find the exact crossing point on the entry edge.
    const entryPt = first === 0
        ? verts[0]
        : (segmentBoxIntersection(verts[first - 1], verts[first], box) ?? verts[first]);

    // Same for the exit: if the route ends inside the box use the last vertex.
    const exitPt = last === n - 1
        ? verts[last]
        : (segmentBoxIntersection(verts[last], verts[last + 1], box) ?? verts[last]);

    const start = Math.max(Polylines.closestPosition(polyline, entryPt).value, 0.0001);
    const end   = Math.min(Polylines.closestPosition(polyline, exitPt).value,  0.9999);

    if (start >= end) return null;
    return { start, end };
}