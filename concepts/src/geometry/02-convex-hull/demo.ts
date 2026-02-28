// @name Convex Hull
// @category Geometry

import { type Point, Reactive, VisQuill, ConvexHulls } from "@visquill/visquill-gdk";
import './styles.css';

/**
 * Interactive convex hull demonstrating reactive geometry computation.
 * Drag any of the 20 handles to see the hull update in real time.
 * The hull is recomputed whenever any point moves, showing how
 * Reactive.do() can depend on an entire array of points.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-geometry-convex-hull-");
    const canvas = rvg.canvas.layer();
    const controls = rvg.canvas.layer();

    // ─── Create Handles ──────────────────────────────────────────────────────

    const handles: Point[] = [];
    for (let i = 0; i < 20; i++) {
        const handle = controls.handles.disk("handle", [100 + Math.random() * 500, 200 + Math.random() * 500])
        handle.zIndex.value = 1
        handles.push(handle);
    }

    // ─── Create Convex Hull ──────────────────────────────────────────────────

    const polygon = canvas.visuals.polygon("contour");

    Reactive.do(handles, () => {
        ConvexHulls.topStart(handles, polygon);
    }, true);

    // ─── Instructions ────────────────────────────────────────────────────────

    rvg.canvas.text.labelAt(
        "Drag any point to update the convex hull",
        [350, 30],
        "instructions"
    );
}