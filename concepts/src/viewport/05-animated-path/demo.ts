// @name Viewport Along Path
// @category Viewports

import {
    VisQuill, Reactive, Boxes, Circles, Symbols,
    Viewports, Polylines, Points,
    type Real, Segments
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Number of diamond shapes scattered across the content world.
const shapeCount = 25

// World-space area in which shapes are placed (pixels).
const worldSize = 600

// Size range for the scattered diamond shapes.
const minShapeSize = 10
const maxShapeSize = 28

// Inset between the container edge and the viewport boundary.
const viewportInset = 50

// Extra inset at the bottom to make room for the sliders.
const bottomInset = 100

// Radius of the centre-point marker on the frame layer.
const centerMarkerRadius = 6

// Half-width of each slider track (pixels).
const sliderHalfWidth = 100

// Distance from the bottom edge to the slider tracks.
const sliderBottomOffset = 50

// Waypoints defining the camera path through the content world.
// These are the coarse control points — Polylines.smooth() will
// interpolate a smooth curve through them.
const pathWaypoints: [number, number][] = [
    [50, 50],
    [100, 200],
    [300, 200],
    [400, 100],
    [600, 200],
    [700, 400],
    [400, 600],
]

// Number of interpolation steps for the smoothed trajectory.
const smoothingSteps = 10

// Zoom range mapped from the zoom slider (0 → minZoom, 1 → maxZoom).
const minZoom = 0.5
const maxZoom = 2.5

/**
 * Demonstrates viewport navigation along a path.
 *
 * A smooth trajectory is drawn through a set of waypoints inside the
 * content world.  Two sliders below the viewport control the camera:
 *  - **Position** — slides the viewport's focus point along the path.
 *  - **Zoom** — scales the viewport in and out around the focus point.
 *
 * This introduces several new concepts on top of the earlier viewport
 * demos:
 *  - `Polylines.smooth()` to generate a smooth curve from coarse
 *    waypoints.
 *  - `Polylines.pinAt()` to sample a pin (position + direction) at
 *    any ratio along the curve.
 *  - `Viewports.focusOn()` to centre the viewport on a pin without
 *    changing zoom.
 *  - `Viewports.zoomTo()` to change zoom level around the viewport
 *    centre.
 *  - A reusable slider pattern: a draggable handle constrained to a
 *    track segment, its position mapped to a reactive Real value.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-viewport-path-")
    const canvas = rvg.canvas

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the sliders to navigate along the path",
        "instructions"
    )
    Reactive.do([rvg.frame],()=>{
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)),25,instructions)
    })
    // ─── Box viewport ─────────────────────────────────────────────────
    const viewport = canvas.viewports.box({ panning: true, zooming: true })
    const content = viewport.content
    const frame   = viewport.frame

    // ─── Boundary rim & centre marker ─────────────────────────────────
    const rim          = frame.visuals.box("rim")
    const centerMarker = frame.visuals.circle("center-marker")

    // ─── Content shapes ───────────────────────────────────────────────
    // Same deterministic scatter as the earlier viewport demos, giving
    // the camera something to fly over.
    for (let i = 0; i < shapeCount; i++) {
        const x    = (i * 197 + 50) % worldSize
        const y    = (i * 313 + 30) % worldSize
        const size = minShapeSize + (i * 7) % (maxShapeSize - minShapeSize)

        Symbols.diamond(
            [x, y],
            size,
            content.visuals.rectangle("shape")
        )
    }

    // ─── Camera path ──────────────────────────────────────────────────
    // The coarse waypoints are drawn as a dashed polyline so the user
    // can see the original control points.
    content.visuals.polyline("path-control", pathWaypoints)

    // The smoothed trajectory interpolates between the waypoints,
    // producing a gentle curve for the camera to follow.
    const trajectory = content.visuals.polyline(
        "path-smooth",
        Polylines.smooth(
            content.visuals.polyline("path-control-hidden", pathWaypoints),
            smoothingSteps
        )
    )

    // ─── Reactive boundary sizing ─────────────────────────────────────
    Reactive.do([rvg.frame], () => {
        Boxes.inflate(rvg.frame, -viewportInset, -bottomInset, viewport.boundary)
        Boxes.copy(viewport.boundary, rim)
        Circles.circleAt(Boxes.center(viewport.boundary), centerMarkerRadius, centerMarker)
    })

    // ─── Slider values ───────────────────────────────────────────────
    // Two reactive reals drive the viewport: `position` (0–1 along the
    // path) and `zoom` (0–1 mapped to the zoom range).
    const position = canvas.values.real(0.5)
    const zoom     = canvas.values.real(0.5)

    // ─── Position → viewport focus ────────────────────────────────────
    // Whenever the position slider changes, sample a pin on the smooth
    // trajectory at that ratio and centre the viewport on it.
    Reactive.do([position], () => {
        const vCenter = Boxes.center(viewport.boundary)
        const pin     = Polylines.pinAt(trajectory, position)
        Viewports.focusOn(viewport.origin, pin, vCenter, viewport.origin)
    })

    // ─── Zoom slider → viewport zoom ─────────────────────────────────
    // Map the 0–1 slider value to the [minZoom, maxZoom] range and
    // apply it around the viewport centre.
    Reactive.do([zoom], () => {
        const vCenter   = Boxes.center(viewport.boundary)
        const zoomLevel = zoom.value * (maxZoom - minZoom) + minZoom
        Viewports.zoomTo(viewport.origin, zoomLevel, vCenter, viewport.origin)
    })

    // ─── Sliders ──────────────────────────────────────────────────────
    buildSlider(canvas, rvg, position, "left",  "Position")
    buildSlider(canvas, rvg, zoom,     "right", "Zoom")
}

// ─── Slider helper ────────────────────────────────────────────────────────
/**
 * Creates a horizontal slider below the viewport: a track segment with a
 * draggable handle whose position is mapped to a reactive Real (0–1).
 *
 * The handle is constrained to the track via closestPointOnSegment, so
 * dragging it sideways writes the normalised position back into `value`.
 */
function buildSlider(
    canvas: ReturnType<typeof VisQuill.create>["canvas"],
    rvg:    ReturnType<typeof VisQuill.create>,
    value:  Real,
    side:   "left" | "right",
    label:  string
) {
    // Track segment — positioned reactively below the viewport.
    const track = canvas.visuals.segment("slider-track")

    Reactive.do([rvg.frame], () => {
        const bottom  = Boxes.bottomSide(rvg.frame)
        const mid     = Points.moveUp(
            Points.midPoint(bottom.at(0), bottom.at(1)),
            sliderBottomOffset
        )
        const anchor  = side === "left"
            ? Points.midPoint(bottom.at(0), mid)
            : Points.midPoint(bottom.at(1), mid)

        Points.moveLeft(anchor,  sliderHalfWidth, track.at(0))
        Points.moveRight(anchor, sliderHalfWidth, track.at(1))
    })

    // Label above the track.
    const trackLabel = canvas.text.label(label, "slider-label")
    Reactive.do([rvg.frame], () => {
        const mid = Points.midPoint(track.at(0), track.at(1))
        Points.moveUp(mid, 18, trackLabel)
    })

    // Draggable handle — placed at the current value along the track
    // and constrained so it can only slide left/right.
    const handle = canvas.handles.disk("slider-handle")
    Points.placeOnSegment(track.at(0), track.at(1), value, handle)

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, value)
    })
}