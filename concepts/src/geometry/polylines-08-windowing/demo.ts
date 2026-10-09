// @name Polyline Windowing
// @category Geometry
// @group Polylines

/**
 * Demonstrates how to find the portion of a polyline that passes through
 * a rectangular region.
 *
 * A draggable box defines the window. On every update, the algorithm walks
 * the polyline vertices to find where the path enters and exits the box,
 * computes the exact crossing points at the boundary edges, then converts
 * those points to normalised positions using Polylines.closestPosition.
 *
 * The result — a [start, end] range in [0, 1] — drives Polylines.slice to
 * highlight the windowed segment in a contrasting colour.
 *
 * This pattern is the foundation of the focused-route technique used in
 * map visualisations: when the box is the viewport frame and the polyline
 * is a reprojected route, the window range tells you exactly which part
 * of the route is currently visible.
 */

import {
    VisQuill, Reactive, Boxes, Points, Segments, Polylines, Vectors,
    type Box, type Polyline,
} from "@visquill/visquill-gdk";
import "./styles.css";
import {segmentBoxIntersection} from "../../utils/geometry";

// ── Layout ────────────────────────────────────────────────────────────────────

const POLYLINE_POINTS: [number, number][] = [
    [  60, 340], [120, 180], [190, 400], [270, 130],
    [350, 300], [420,  90], [510, 360], [590, 160],
    [670, 320], [750, 110], [830, 280], [900, 380],
];

const SMOOTHING = 3;

const WINDOW_TL: [number, number] = [240, 140];
const WINDOW_BR: [number, number] = [640, 390];

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-polyline-windowing-");
    const canvas = rvg.canvas;
    canvas.handles.defaultZIndex = 1;

    // ── Instructions ──────────────────────────────────────────────────────────

    const instructions = canvas.text.label(
        "Drag the window corners — the highlighted segment updates live",
        "instructions"
    );
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions);
    });

    // ── Polyline ──────────────────────────────────────────────────────────────

    const polyline = Polylines.smooth(POLYLINE_POINTS, SMOOTHING);

    // Three visual segments: prefix (dimmed), slice (highlighted), suffix (dimmed)
    const segPrefix = canvas.visuals.polyline("seg-prefix");
    const segSlice  = canvas.visuals.polyline("seg-slice");
    const segSuffix = canvas.visuals.polyline("seg-suffix");

    // ── Draggable window ──────────────────────────────────────────────────────
    //
    // Two corner handles define the window box via Boxes.spannedBox.
    // Either corner can be dragged past the other without breaking the box.

    const hTL = canvas.handles.disk("window-handle", WINDOW_TL);
    const hBR = canvas.handles.disk("window-handle", WINDOW_BR);

    const windowBox = canvas.visuals.box("window-rect");

    Reactive.do([hTL, hBR], () => {
        Boxes.spannedBox(hTL, hBR, windowBox);
    });

    // ── Entry / exit markers ──────────────────────────────────────────────────

    const entryDot = canvas.visuals.point("entry-dot");
    const exitDot  = canvas.visuals.point("exit-dot");
    entryDot.visible.value = false;
    exitDot.visible.value  = false;

    // ── Range label ───────────────────────────────────────────────────────────

    const rangeLabel = canvas.text.label("", "range-label");
    Reactive.do([rvg.frame], () => {
        const bl = Boxes.bottomLeft(rvg.frame);
        Points.move(bl, 20, -30, rangeLabel);
    });

    // ── Reactive windowing ────────────────────────────────────────────────────
    //
    // Every time the window box or the polyline changes, recompute the window.

    Reactive.do([windowBox, polyline], () => {
        const result = windowPolyline(polyline, windowBox);

        if (!result) {
            // No intersection — show the full polyline as dimmed
            Polylines.slicePrefix(polyline, 0,   segPrefix);
            Polylines.slice(polyline, 0, 0, segSlice);
            Polylines.sliceSuffix(polyline, 1,   segSuffix);
            entryDot.visible.value = false;
            exitDot.visible.value  = false;
            rangeLabel.value = "no intersection";
            return;
        }

        const { start, end, entryPt, exitPt } = result;

        Polylines.slicePrefix(polyline, start, segPrefix);
        Polylines.slice(polyline, start, end,  segSlice);
        Polylines.sliceSuffix(polyline, end,   segSuffix);

        Vectors.copy(entryPt, entryDot);
        Vectors.copy(exitPt,  exitDot);
        entryDot.visible.value = true;
        exitDot.visible.value  = true;

        const pct = (v: number) => `${Math.round(v * 100)}%`;
        rangeLabel.value = `window  ${pct(start)} → ${pct(end)}`
            + `   (span ${pct(end - start)})`;
    });
}

// ── Windowing algorithm ───────────────────────────────────────────────────────
//
// Finds where a polyline enters and exits a box, returning normalised [0,1]
// positions along the polyline for use with Polylines.slice.
//
// Strategy:
//   1. Walk vertices to find the first and last that are inside the box.
//   2. For each boundary, intersect the crossing segment with the box edges
//      to find the exact entry / exit point.
//   3. Convert those points to normalised positions via Polylines.closestPosition.

interface WindowResult {
    start:   number;
    end:     number;
    entryPt: { x: number; y: number };
    exitPt:  { x: number; y: number };
}

function windowPolyline(polyline: Polyline, box: Box): WindowResult | null {
    const verts = polyline.elements;
    const n     = verts.length;

    // Find the index range of vertices that fall inside the box.
    let first = -1;
    let last  = -1;

    for (let i = 0; i < n; i++) {
        if (Boxes.containsPoint(box, verts[i]).value) {
            if (first === -1) first = i;
            last = i;
        }
    }

    if (first === -1) return null;

    // Find the exact entry point: intersect the segment just before `first`
    // with the box edges. Fall back to the first inside vertex if unavailable.
    const entryPt = first > 0
        ? (segmentBoxIntersection(verts[first - 1], verts[first], box) ?? verts[first])
        : verts[first];

    // Find the exact exit point: intersect the segment just after `last`.
    const exitPt = last < n - 1
        ? (segmentBoxIntersection(verts[last], verts[last + 1], box) ?? verts[last])
        : verts[last];

    // Convert screen points → normalised positions along the polyline.
    const start = Polylines.closestPosition(polyline, entryPt).value;
    const end   = Polylines.closestPosition(polyline, exitPt).value;

    if (start >= end) return null;

    return { start, end, entryPt, exitPt };
}

