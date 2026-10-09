// @name Convex Hull Baseline
// @category Geometry
// @group Polylines

/**
 * Demonstrates how to derive a curved baseline from a polyline slice using
 * a convex hull and polygon offset.
 *
 * This builds directly on the Polyline Windowing demo. The windowed slice
 * is wrapped in a convex hull, expanded outward with Offsets.polygon, and
 * then the "far side" of the hull — the side running parallel to the slice
 * but offset away from it — is extracted with Polygons.slice as the baseline.
 *
 * The result is a smooth curve that follows the shape and orientation of the
 * original path. Perpendicular bars rising from this baseline would form a
 * chart that respects the geometry of the route.
 *
 * Drag the window corners to change the slice. Drag the offset slider to
 * see how the baseline moves away from the route.
 */

import {
    VisQuill, Reactive, Boxes, Points, Segments, Polylines, Polygons,
    ConvexHulls, Offsets, Pins, Values,
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
const OFFSET_MIN   = 20;
const OFFSET_MAX   = 120;
const OFFSET_START = 60;

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-hull-baseline-");
    const canvas = rvg.canvas;
    canvas.handles.defaultZIndex = 1;

    // ── Instructions ──────────────────────────────────────────────────────────

    const instructions = canvas.text.label(
        "Drag the window corners or offset handle to reshape the baseline",
        "instructions"
    );
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions);
    });

    // ── Source polyline ───────────────────────────────────────────────────────

    const polyline = Polylines.smooth(POLYLINE_POINTS, SMOOTHING);

    // Dimmed prefix / suffix outside the window; highlighted slice inside
    const segPrefix = canvas.visuals.polyline("seg-prefix");
    const segSlice  = canvas.visuals.polyline("seg-slice");
    const segSuffix = canvas.visuals.polyline("seg-suffix");

    // ── Draggable window ──────────────────────────────────────────────────────

    const hTL = canvas.handles.disk("window-handle", WINDOW_TL);
    const hBR = canvas.handles.disk("window-handle", WINDOW_BR);

    const windowBox = canvas.visuals.box("window-rect");

    Reactive.do([hTL, hBR], () => {
        Boxes.spannedBox(hTL, hBR, windowBox);
    });

    // ── Offset slider ─────────────────────────────────────────────────────────

    const sliderTrack  = canvas.visuals.segment("slider-track");
    const sliderHandle = canvas.handles.disk("slider-handle", [0, 0]);
    const sliderLabel  = canvas.text.label("", "slider-label");
    const offset       = canvas.values.real(OFFSET_START);

    // Position the slider track reactively below the frame
    Reactive.do([rvg.frame], () => {
        const bl = Boxes.bottomLeft(rvg.frame);
        const br = Boxes.bottomRight(rvg.frame);
        Points.move(bl,  80, -40, sliderTrack.at(0));
        Points.move(br, -80, -40, sliderTrack.at(1));

        // Clamp the handle to the track on resize
        const t = Values.inverseLerp(OFFSET_MIN, OFFSET_MAX, offset);
        Segments.pointAt(sliderTrack, t, sliderHandle);
    });

    Reactive.do([sliderHandle], () => {
        Points.closestPointOnSegment(sliderHandle, sliderTrack, sliderHandle);
        const t = Points.relativePositionOnSegment(sliderHandle, sliderTrack);
        Values.lerp(OFFSET_MIN, OFFSET_MAX, t, offset);
        Points.moveUp(sliderHandle, 16, sliderLabel);
        sliderLabel.value = `offset  ${Math.round(offset.value)} px`;
    }, true);

    // ── Hull and baseline visuals ─────────────────────────────────────────────

    const hullPolygon = canvas.visuals.polygon("hull");
    const baseline    = canvas.visuals.polyline("baseline");

    // ── Reactive computation ──────────────────────────────────────────────────

    Reactive.do([windowBox, polyline, offset], () => {
        const result = windowPolyline(polyline, windowBox);

        if (!result) {
            Polylines.slicePrefix(polyline, 0,   segPrefix);
            Polylines.slice(polyline, 0, 0,      segSlice);
            Polylines.sliceSuffix(polyline, 1,   segSuffix);
            hullPolygon.elements.length = 0;
            baseline.elements.length    = 0;
            return;
        }

        const { start, end } = result;

        // ── 1. Slice ──────────────────────────────────────────────────────────

        Polylines.slicePrefix(polyline, start, segPrefix);
        Polylines.slice(polyline, start, end,  segSlice);
        Polylines.sliceSuffix(polyline, end,   segSuffix);

        // ── 2. Convex hull ────────────────────────────────────────────────────
        //
        // ConvexHulls.topStart wraps the slice vertices in a convex polygon,
        // starting from the topmost point. Consistent winding makes the hull
        // boundary positions predictable for Polygons.slice later.
        // The result is written into hullPolygon so it is visible.

        ConvexHulls.topStart(segSlice, hullPolygon);

        // ── 3. Offset ─────────────────────────────────────────────────────────
        //
        // Expands the hull outward by the current offset distance.
        // Returns a plain polygon value — not a reactive object.
        // The third argument (true) offsets to the left of the hull's
        // winding, which is outward here; the fourth (1) adds one extra
        // point at each corner.

        const offsetHull = Offsets.polygon(hullPolygon, offset.value, true, 1);

        // ── 4. Extract the baseline ───────────────────────────────────────────
        //
        // Pins at the slice start and end give the local route direction.
        // Rotating each pin left (90°) and stepping forward by the offset
        // places anchor points on the far side of the hull. closestPosition
        // locates those anchors on the hull boundary; Polygons.slice extracts
        // the arc between them directly into the baseline visual.

        const dirs = Polylines.pinsAt(polyline, [{ value: start }, { value: end }]);
        const a1   = Pins.moveForward(Pins.rotateLeft(dirs[0]), offset.value);
        const a2   = Pins.moveForward(Pins.rotateLeft(dirs[1]), offset.value);
        const pos1 = Polygons.closestPosition(offsetHull, a1);
        const pos2 = Polygons.closestPosition(offsetHull, a2);

        Polygons.slice(offsetHull, pos1, pos2, baseline);
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