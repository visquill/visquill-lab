// @name External Labeling
// @category Geometry
// @group Match

import {
    type Point,
    Reactive,
    VisQuill,
    ConvexHulls,
    Offsets,
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
 * distance, then each site is connected to its own port on the offset
 * polygon via a leader line (one-to-one, shortest total length). Drag any site or the slider to see everything
 * update reactively.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-geometry-match-separated-");
    const canvas = rvg.canvas.layer();
    const controls = rvg.canvas.layer();
    controls.handles.defaultZIndex = 1
    const distance = canvas.values.real(50);

    // ─── Create Sites and Leaders ─────────────────────────────────────────────

    const sites: Point[] = [];
    const leaders: Segment[] = [];
    for (let i = 0; i < 20; i++) {
        const handle = controls.handles.disk("site", [200 + Math.random() * 500, 200 + Math.random() * 500])
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

    // Keep the handle on the track; the distance is how far it is from the track's start.
    Reactive.do([slider], () => {
        Points.closestPointOnSegment(slider, track, slider);
        Points.distanceToPoint(track.at(0), slider, distance);
        label.value = distance.value.toFixed(0) + "px";
        Points.moveDown(slider, 25, label);
    }, true);

    // ─── Instructions ────────────────────────────────────────────────────────

    rvg.canvas.text.labelAt(
        "Drag any site or the slider — each site gets its own port on the offset polygon, with the shortest total leader length.",
        [20, 30],
        "instructions"
    );
}