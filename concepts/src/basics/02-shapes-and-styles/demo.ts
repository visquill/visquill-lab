// @name Shapes & Styles
// @category Basics

import "./styles.css"
import {VisQuill, Rectangles, Circles} from "@visquill/visquill-gdk";

/**
 * Showcases every basic shape primitive and styling option.
 *
 * Layout is arranged in two rows so shapes don't overlap:
 *   Top row    (y ≈ 50–200):  polygon, box, rounded rectangle, circle
 *   Bottom row (y ≈ 300–500): circle-3p, points, segment, polyline + text along path
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    // ─── Prefix chain ─────────────────────────────────────────────────────
    // Every CSS class is built by concatenating three parts:
    //
    //   graphic prefix   +   layer prefix   +   class name you pass in
    //   "demos-basics-"      "shapes-"          e.g. "title"
    //                                           ─────────────────────────►
    //                                           → "demos-basics-shapes-title"
    //
    // So when you write  canvas.textAt("...", [...], "title")
    // the resulting <text> element gets the class "demos-basics-shapes-title".
    // This means your CSS file only needs that one fully-qualified class —
    // VisQuill assembles it for you automatically.
    // ──────────────────────────────────────────────────────────────────────

    const rvg = VisQuill.create(div, "demos-basics-shapes-")
    const canvas = rvg.canvas

    // ─── Title ────────────────────────────────────────────────────────────
    canvas.text.labelAt("Shapes & Styles", [350, 20], "title")

    // ─── Top row ──────────────────────────────────────────────────────────

    // Polygon — defined by an array of points
    canvas.visuals.polygon("polygon",[
        {x: 60, y: 60},
        {x: 160, y: 60},
        {x: 110, y: 160}
    ])

    // Box — axis-aligned rectangle defined by two corner points (no rounding)
    canvas.visuals.box("box",[200, 60], [310, 160])

    // Rounded rectangle — same as box but with a corner radius (last numeric arg)
    // Inline @style lets you override fill/stroke without a separate CSS class
    Rectangles.alongSegment([340, 60], [450, 160], 20,true,canvas.visuals.rectangle(
        "@style fill:darkred; stroke-width: 1px; stroke: black;"));

    // Circle — center point + radius
    Circles.circleAt([540, 110], 55, canvas.visuals.circle("circle"))

    // ─── Bottom row ───────────────────────────────────────────────────────

    // Circle from 3 points — useful when you know points on the arc
    // rather than the center and radius directly
    canvas.visuals.circle(
        "circle circle-3p",
        [100, 320],
        [200, 420],
        [100, 420]
    )

    // Points — single dots on the canvas
    // Default style (uses the "point" CSS class → "demos-basics-shapes-point")
    canvas.visuals.point("point",[320, 350] )
    // Inline override — @class sets the class, @style overrides fill color
    canvas.visuals.point("@class point @style fill:red;",[350, 350] )
    canvas.visuals.point("@class point @style fill:#5da9ff;",[380, 350] )

    // Segment — a straight line between two points
    // This one uses the default "segment" class for its style
    canvas.visuals.segment("segment",[320, 390], [380, 440])
    // A second segment with an inline style override to show it can be
    // styled independently, just like points and other shapes
    canvas.visuals.segment("@class segment @style stroke:#f0a050; stroke-width:3px;",[390, 390], [450, 440])

    // Polyline — an open path through a sequence of points
    const polyline = canvas.visuals.polyline("polyline",[
        {x: 470, y: 390},
        {x: 570, y: 390},
        {x: 600, y: 490},
        {x: 670, y: 590},
        {x: 770, y: 590}
    ])

    // Text along a path — the text follows the shape of the polyline
    // Args: text content, path to follow, start offset along path, whether to auto-flip
    canvas.text.labelAlongPolyline("Shapes & Styles", polyline, 5, false, "text-on-path")
}