// @name Point Matching
// @category Geometry

import {
    type Point,
    Reactive,
    VisQuill,
    ConvexHulls,
    Offsets,
    Vectors,
    Segments,
    type Segment,
    Distribute,
    Match,
    Points
} from "@visquill/visquill-gdk";
import './styles.css';

/**
 * Demonstrates polygon offsetting combined with point matching: an outer
 * polygon is computed by expanding the convex hull outward by a fixed
 * distance, then each site is connected to its nearest port on the offset
 * polygon via a leader line. Drag any site or the slider to see everything
 * update reactively.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-geometry-polygon-offset-");
    const canvas = rvg.canvas.layer();
    const controls = rvg.canvas.layer();
    const distance = canvas.values.real(50);

    // ─── Create Sites and Leaders ─────────────────────────────────────────────

    const sites: Point[] = [];
    const leaders: Segment[] = [];
    for (let i = 0; i < 20; i++) {
        const handle =controls.handles.disk("site", [200 + Math.random() * 500, 200 + Math.random() * 500])
        handle.zIndex.value = 1
        sites.push(handle);
        leaders.push(canvas.visuals.segment("leader"));
    }

    // ─── Create Convex Hull and Offset ───────────────────────────────────────

    const polygon = canvas.visuals.polygon("contour");
    const offset  = canvas.visuals.polygon("offset");
    const ports   = Points.array(sites.length);

    Reactive.do([...sites, distance], () => {
        ConvexHulls.topStart(sites, polygon);
        Offsets.polygon(polygon, distance, true, 1, offset);
        Distribute.pointsOnPolygon(ports, offset);
        const assignment = Match.pointsWithPoints(sites, ports);
        for (let i = 0; i < sites.length; i++) {
            const p1 = ports[assignment[i]];
            const p2 = sites[i];
            Segments.segment(p1, p2, leaders[i]);
        }
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
        "Drag any site or the slider — leader lines connect each site to its nearest port on the offset polygon.",
        [20, 30],
        "instructions"
    );
}