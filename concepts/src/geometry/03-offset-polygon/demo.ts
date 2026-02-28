// @name Polygon Offset
// @category Geometry

import { type Point, Reactive, VisQuill, ConvexHulls, Offsets, Vectors, Segments } from "@visquill/visquill-gdk";
import './styles.css';

/**
 * Demonstrates polygon offsetting: an outer polygon is computed by expanding
 * the convex hull outward by a fixed distance. Drag any handle to see both
 * the hull and its offset update reactively. Use the slider to adjust the
 * offset distance.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-geometry-polygon-offset-");
    const canvas = rvg.canvas.layer();
    const controls = rvg.canvas.layer();
    const distance = canvas.values.real(50);

    // ─── Create Handles ──────────────────────────────────────────────────────

    const handles: Point[] = [];
    for (let i = 0; i < 20; i++) {
        const handle = controls.handles.disk("handle", [100 + Math.random() * 500, 200 + Math.random() * 500])
        handle.zIndex.value = 1
        handles.push(handle);
    }

    // ─── Create Convex Hull and Offset ───────────────────────────────────────

    const polygon = canvas.visuals.polygon("contour");
    const offset  = canvas.visuals.polygon("offset");

    Reactive.do([...handles, distance], () => {
        ConvexHulls.topStart(handles, polygon);
        Offsets.polygon(polygon, distance, true, 1, offset);
    }, true);

    // ─── Distance Slider ─────────────────────────────────────────────────────

    const track  = controls.visuals.segment("track", [100, 50], [300, 50]);
    const slider = controls.handles.disk("handle", [100, 50]);
    const label  = controls.text.label("", "slider-label");

    Segments.pointAt(track, 0.5, slider);

    Reactive.do([slider], () => {
        Vectors.copy([Math.max(100, Math.min(300, slider.x)), 50], slider);
        distance.value = slider.x - 100;
        label.value = distance.value.toFixed(0) + "px";
        Vectors.add(slider, [0, 25], label);
    }, true);

    // ─── Instructions ────────────────────────────────────────────────────────

    rvg.canvas.text.labelAt(
        "Drag any point — the offset polygon maintains the specified distance.",
        [350, 30],
        "instructions"
    );
}