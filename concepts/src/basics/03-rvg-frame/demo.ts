// @name Frame and Center
// @category Basics

import { Attach, Boxes, Reactive, VisQuill } from "@visquill/visquill-gdk";
import './styles.css';

/**
 * Demonstrates the two coordinate references every Rvg exposes:
 *
 * - `rvg.frame`  — a Box whose vertices coincide with the four corners of the
 *                  SVG element. Reactive: it updates when the container is resized,
 *                  so visuals anchored to it always hug the boundary.
 * - `rvg.center` — the midpoint of that frame. Use it as a stable origin for
 *                  centred layouts and animations.
 *
 * The demo draws the frame boundary, labels each corner, and marks the centre
 * with a crosshair and label.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-basics-rvg-frame-");
    const canvas = rvg.canvas;

    // rvg.frame  → Box   : axis-aligned box spanning the full SVG element
    // rvg.center → Point : midpoint of rvg.frame — updates reactively as the SVG is resized
    const center = rvg.center;

    // ─── Frame Border ────────────────────────────────────────────────────────

    const frame = canvas.visuals.box("frame");
    const topLeft     = canvas.visuals.point("corner");
    const topRight    = canvas.visuals.point("corner");
    const bottomLeft  = canvas.visuals.point("corner");
    const bottomRight = canvas.visuals.point("corner");

    canvas.visuals.segment("edge", topLeft,     topRight);
    canvas.visuals.segment("edge", topRight,    bottomRight);
    canvas.visuals.segment("edge", bottomRight, bottomLeft);
    canvas.visuals.segment("edge", bottomLeft,  topLeft);

    Reactive.do([rvg.frame], () => {
        Boxes.copy(rvg.frame, frame);
        Boxes.topLeft(rvg.frame, topLeft);
        Boxes.topRight(rvg.frame, topRight);
        Boxes.bottomLeft(rvg.frame, bottomLeft);
        Boxes.bottomRight(rvg.frame, bottomRight);
    }, true);

    // ─── Corner Labels ────────────────────────────────────────────────────────

    const corners = [
        { point: topLeft,     text: "frame.topLeft",     ox:  10, oy:  16, side: "left"  },
        { point: topRight,    text: "frame.topRight",    ox: -10, oy:  16, side: "right" },
        { point: bottomLeft,  text: "frame.bottomLeft",  ox:  10, oy: -10, side: "left"  },
        { point: bottomRight, text: "frame.bottomRight", ox: -10, oy: -10, side: "right" },
    ];

    for (const { point, text, ox, oy, side } of corners) {
        const label = canvas.text.label(text, "corner-label-" + side);
        Attach.pointToPoint(label, point, { offset: { x: ox, y: oy } });
    }

    // ─── Centre Crosshair ────────────────────────────────────────────────────

    // Two short segments crossing at rvg.center, defined in local coordinates
    // around the group anchor — moving the anchor moves the whole crosshair
    const centerGroup = canvas.layer();
    const arm = 20;
    centerGroup.visuals.segment("crosshair", [-arm, 0], [arm, 0]);
    centerGroup.visuals.segment("crosshair", [0, -arm], [0,  arm]);

    // ─── Centre Label ────────────────────────────────────────────────────────

    centerGroup.text.labelAt("rvg.center", [10, -10], "center-label");

    // Position the whole group at rvg.center
    Attach.pointToPoint(centerGroup.anchor, center);
}