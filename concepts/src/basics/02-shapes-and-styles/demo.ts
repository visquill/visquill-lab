// @name Shapes & Styles
// @category Basics

import "./styles.css"
import {VisQuill, Rectangles} from "@visquill/visquill-gdk";

/**
 * Showcases every basic shape primitive and styling option.
 *
 * Layout is arranged in two rows so shapes don't overlap:
 *   Top row    (y ≈ 50–200):  polygon, box, rectangle, circle
 *   Bottom row (y ≈ 300–500): circle-3p, points, segment, polyline + text along path
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    // ─── Class prefix ─────────────────────────────────────────────────────
    // Every CSS class is the graphic's prefix plus the name you pass:
    //   VisQuill.create(div, "demos-basics-shapes-")  +  "title"
    //   → "demos-basics-shapes-title"
    // Layers add their own prefix in between (see basics/04-layers).
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

    // Rectangle — a baseline and a height, so unlike a box it can be rotated.
    // This one stands 20 px high on the diagonal baseline (340,60)→(450,160).
    // Inline @style sets fill/stroke without a CSS class.
    Rectangles.alongSegment([340, 60], [450, 160], 20, true, canvas.visuals.rectangle(
        "@style fill:darkred; stroke-width: 1px; stroke: black;"));

    // Circle — center point + radius
    canvas.visuals.circleAt("circle", [540, 110], 55)

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
    // Args: text, path to follow, distance from the path (px), flip, class
    canvas.text.labelAlongPolyline("Shapes & Styles", polyline, 5, false, "text-on-path")
}