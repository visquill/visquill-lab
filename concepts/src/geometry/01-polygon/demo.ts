// @name Interactive Polygon
// @category Geometry

import {VisQuill, Attach} from "@visquill/visquill-gdk";
import './styles.css';

/**
 * Interactive polygon demonstrating that shapes are point arrays.
 * Drag the handles to see how the polygon updates as its vertices move.
 * The polygon visually shows it's just a collection of connected points.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-polygon-editor-");
    const canvas = rvg.canvas;

    // ─── Create Polygon ─────────────────────────────────────────────────────

    // Position vertices in a pentagon pattern
    const centerX = 300;
    const centerY = 250;
    const radius = 120;

    const handles = []
    for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        handles.push(canvas.handles.disk("vertex", [x, y]));
    }
    const polygon = canvas.visuals.polygon("shape", handles);

    // ─── Create Vertex Labels ───────────────────────────────────────────────

    for (let i = 0; i < polygon.elements.length; i++) {
        const label = canvas.text.label(`P${i}`, "label");

        // Position label above and to the right of vertex
        Attach.pointToPoint(label, polygon.at(i), {
            offset: { x: 15, y: -15 }
        });
    }

    // ─── Instructions ───────────────────────────────────────────────────────

    canvas.text.labelAt(
        "Drag any vertex to reshape the polygon",
        [300, 30],
        "instructions"
    );
}
