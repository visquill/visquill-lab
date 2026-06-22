// @name Along Baseline
// @category Plots
// @group Curves

/**
 * Demonstrates plotting data perpendicular to a dynamically derived baseline.
 *
 * The baseline is computed from a windowed slice of a winding route, wrapped
 * in a convex hull and offset outward. Data points are defined as pixel
 * distances along the route polyline. For each visible data point, its route
 * position is projected onto the baseline via Polylines.pinsAtDistances, then
 * displaced perpendicularly by its value using Pins.rotateLeft + Pins.moveForward.
 * The resulting displaced points form the curve outline; concatenating the
 * reversed curve with the baseline closes the filled area.
 *
 * Dragging the window corners changes which segment of the route is in view.
 * The baseline reshapes to follow that segment and the curve updates to match.
 */

import {
    VisQuill, Reactive, Boxes, Points, Segments, Polylines, Polygons,
    ConvexHulls, Offsets, Pins, Cast,
    type Box, type Polyline,
} from "@visquill/visquill-gdk";
import "./styles.css";
import { segmentBoxIntersection } from "../../utils/geometry";

// ── Layout ────────────────────────────────────────────────────────────────────

const POLYLINE_POINTS: [number, number][] = [
    [  60, 340], [120, 180], [190, 400], [270, 130],
    [350, 300], [420,  90], [510, 360], [590, 160],
    [670, 320], [750, 110], [830, 280], [900, 380],
];

const SMOOTHING    = 3;
const WINDOW_TL: [number, number] = [220, 110];
const WINDOW_BR: [number, number] = [660, 410];
const OFFSET       = 80;
const SAMPLE_COUNT = 40;

// ── Simulated data ────────────────────────────────────────────────────────────
//
// Values defined as pixel distances along the route polyline.
// Generated after the polyline is smoothed so the distances are stable.
// In a real use case these would be events snapped to their distance along
// the route (e.g. via Polylines.closestPosition × route length).

type DataPoint = { dist: number; value: number };
let DATA: DataPoint[] = []; // populated in run() once route length is known

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-curve-baseline-");
    const canvas = rvg.canvas;
    canvas.handles.defaultZIndex = 1;

    // ── Instructions ──────────────────────────────────────────────────────────

    const instructions = canvas.text.label(
        "Drag the window corners — the curve updates to the visible segment",
        "instructions"
    );
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions);
    });

    // ── Source polyline ───────────────────────────────────────────────────────

    const polyline = Polylines.smooth(POLYLINE_POINTS, SMOOTHING);

    // Initialise DATA in pixel distances along the route.
    // The route length is fixed (static polyline) so this runs once.
    {
        const routeLen = Polylines.len(polyline).value;
        DATA = Array.from({ length: SAMPLE_COUNT }, (_, i) => {
            const dist = (i / SAMPLE_COUNT) * routeLen;
            const t    = i / SAMPLE_COUNT;
            const v    = 60 * Math.exp(-((t - 0.25) ** 2) / 0.01)
                       + 90 * Math.exp(-((t - 0.65) ** 2) / 0.015)
                       + 20 * Math.sin(t * Math.PI * 8) * Math.exp(-t * 2);
            return { dist, value: Math.max(0, v) };
        });
    }

    const segPrefix = canvas.visuals.polyline("seg-prefix");
    const segSlice  = canvas.visuals.polyline("seg-slice");
    const segSuffix = canvas.visuals.polyline("seg-suffix");

    // ── Draggable window ──────────────────────────────────────────────────────

    const hTL = canvas.handles.disk("window-handle", WINDOW_TL);
    const hBR = canvas.handles.disk("window-handle", WINDOW_BR);

    const windowBox  = canvas.shapes.box();
    const windowRect = canvas.visuals.box("window-rect");

    Reactive.do([hTL, hBR], () => {
        Boxes.spannedBox(hTL, hBR, windowBox);
        Boxes.copy(windowBox, windowRect);
    });

    // ── Plot visuals ──────────────────────────────────────────────────────────

    const baseline     = canvas.visuals.polyline("baseline");
    const curveFill    = canvas.visuals.polygon("curve-fill");
    const curveOutline = canvas.visuals.polyline("curve-outline");

    // ── Reactive update ───────────────────────────────────────────────────────

    const routeLen = Polylines.len(polyline).value;

    Reactive.do([windowBox, polyline], () => {
        const result = windowPolyline(polyline, windowBox);

        if (!result) {
            Polylines.slicePrefix(polyline, 0,   segPrefix);
            Polylines.slice(polyline, 0, 0,      segSlice);
            Polylines.sliceSuffix(polyline, 1,   segSuffix);
            baseline.elements.length     = 0;
            curveFill.elements.length    = 0;
            curveOutline.elements.length = 0;
            return;
        }

        const { start, end } = result;

        // ── 1. Slice ──────────────────────────────────────────────────────────

        const slice = Polylines.slice(polyline, start, end);

        Polylines.slicePrefix(polyline, start, segPrefix);
        Polylines.copy(slice, segSlice);
        Polylines.sliceSuffix(polyline, end,   segSuffix);

        // ── 2. Hull baseline ──────────────────────────────────────────────────

        const hull       = ConvexHulls.topStart(slice);
        const offsetHull = Offsets.polygon(hull, OFFSET, true, 1);

        // Pins at the slice start and end give the local route direction.
        // Rotating each pin left (90°) and stepping forward by the offset
        // places anchor points on the far side of the hull.
        const dirs = Polylines.pinsAt(polyline, [{ value: start }, { value: end }]);
        const a1   = Pins.moveForward(Pins.rotateLeft(dirs[0]), OFFSET);
        const a2   = Pins.moveForward(Pins.rotateLeft(dirs[1]), OFFSET);
        const pos1 = Polygons.closestPosition(offsetHull, a1);
        const pos2 = Polygons.closestPosition(offsetHull, a2);

        Polygons.slice(offsetHull, pos1, pos2, baseline);

        // ── 3. Sample and plot ────────────────────────────────────────────────
        //
        // Filter data to the visible window (in pixel distance units).
        // For each visible point, find its position on the baseline by
        // projecting its route distance onto the baseline via pinsAtDistances,
        // then displace the pin perpendicularly (rotateLeft) by the data value.
        //
        // pinsAtDistances gives us a pin at each baseline position — the pin
        // carries both the location (x, y) and the local direction (dx, dy).
        // Pins.rotateLeft turns the direction 90° to face perpendicular to the
        // baseline. Pins.moveForward then steps along that perpendicular by the
        // data value, giving the displaced curve point.

        const startDist   = start * routeLen;
        const endDist     = end   * routeLen;
        const baselineLen = Polylines.len(baseline).value;

        const visible = DATA.filter(d => d.dist >= startDist && d.dist <= endDist);
        if (visible.length < 2) {
            curveFill.elements.length    = 0;
            curveOutline.elements.length = 0;
            return;
        }

        // Map each data point's route distance to a baseline distance.
        // (d.dist - startDist) / (endDist - startDist) gives normalised position
        // within the window; multiply by baselineLen for the absolute distance.
        const baselineDists = visible.map(d => ({
            value: ((d.dist - startDist) / (endDist - startDist)) * baselineLen,
        }));

        // Get one pin per data point — positioned on the baseline at the
        // corresponding distance, oriented tangent to the baseline.
        const pins = Polylines.pinsAtDistances(baseline, baselineDists);

        // Displace each pin perpendicularly by the data value
        const curvePoints = pins.map((pin, i) => {
            const displaced = Pins.moveForward(Pins.rotateLeft(pin), visible[i].value);
            return { x: displaced.x, y: displaced.y };
        });

        Polylines.copy(curvePoints, curveOutline);

        // Close the filled area: reversed curve + baseline
        Polylines.concatenate(
            Polylines.toReversedPolyline(curveOutline),
            baseline,
            Cast.asPolyline(curveFill)
        );
    });
}

// ── Windowing ─────────────────────────────────────────────────────────────────

interface WindowResult { start: number; end: number }

function windowPolyline(polyline: Polyline, box: Box): WindowResult | null {
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

    const entryPt = first > 0
        ? (segmentBoxIntersection(verts[first - 1], verts[first], box) ?? verts[first])
        : verts[first];
    const exitPt = last < n - 1
        ? (segmentBoxIntersection(verts[last], verts[last + 1], box) ?? verts[last])
        : verts[last];

    const start = Polylines.closestPosition(polyline, entryPt).value;
    const end   = Polylines.closestPosition(polyline, exitPt).value;
    if (start >= end) return null;

    return { start, end };
}