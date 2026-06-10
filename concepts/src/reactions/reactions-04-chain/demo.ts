// @name Reactive Chains
// @category Reactions
// @group Reactive

// Demonstrates how reactive values can form a dependency chain:
// A → B → C, where changing A automatically propagates through B into C.
// A slider sets a radius; a second block derives area from radius;
// a third block derives a colour from area. Each block knows only its
// immediate dependency.

import { VisQuill, Reactive, Circles, Boxes, Points, Segments, Svg } from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const cx          = 500           // canvas horizontal centre
const cy          = 260           // canvas vertical centre
const maxRadius   = 180           // maximum slider-driven radius
const minRadius   = 10

const trackHalfW  = 180
const trackY      = 480           // y of the slider track

/**
 * Demonstrates reactive dependency chains.
 *
 * Three `Reactive.do` blocks form a chain A → B → C:
 *  - Block A reads the slider handle and writes `radius`.
 *  - Block B reads `radius` and writes `area`.
 *  - Block C reads `area` and updates the circle's fill colour.
 *
 * Only block A knows the slider exists.  Only block C touches the colour.
 * Each block has a single, clear responsibility — and none of them need
 * to know about the others.
 *
 * @param div - The div element that will contain the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-reactive-chains-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the slider · radius → area → colour update in sequence",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(Segments.midPoint(Boxes.topSide(rvg.frame)), 25, instructions)
    })

    // ─── Reactive values — the chain ──────────────────────────────────
    // Each value is the output of one block and the input of the next.
    // All declared outside callbacks so no reactive node is ever created
    // inside a Reactive.do.
    const radius  = canvas.values.real(100)
    const area    = canvas.values.real(0)

    // ─── Visuals ──────────────────────────────────────────────────────
    const circle      = canvas.visuals.circle("circle")
    const circleSvg   = Svg.get(circle)
    const radiusLabel = canvas.text.labelAt("", [cx, cy + 30], "value-label")
    const areaLabel   = canvas.text.labelAt("", [cx, cy + 54], "value-label")
    const colourLabel = canvas.text.labelAt("", [cx, cy + 78], "value-label")

    // ─── Slider ───────────────────────────────────────────────────────
    const track       = canvas.visuals.segment("slider-track")
    const handle      = canvas.handles.disk("slider-handle")
    const sliderLabel = canvas.text.label("radius", "slider-label")

    // Use a normalised t value to remember the handle position across
    // frame resizes — same pattern as in the geometry slider helpers.
    const t = canvas.values.real(0.5)

    Reactive.do([rvg.frame], () => {
        const mid = Points.midPoint(
            Boxes.bottomSide(rvg.frame).at(0),
            Boxes.bottomSide(rvg.frame).at(1)
        )
        const centre = Points.moveUp(mid, Boxes.height(rvg.frame).value - trackY)
        Points.moveLeft( centre, trackHalfW, track.at(0))
        Points.moveRight(centre, trackHalfW, track.at(1))
        Points.moveUp(centre, 18, sliderLabel)
        Points.placeOnSegment(track.at(0), track.at(1), t, handle)
    })

    Reactive.do([handle], () => {
        Points.closestPointOnSegment(handle, track, handle)
        Points.relativePositionOnSegment(handle, track, t)
    })

    // ─── Block A — slider → radius ────────────────────────────────────
    // Reads the normalised slider position and maps it to a pixel radius.
    // Writes into `radius`, which triggers blocks B and the circle draw.
    Reactive.do([t], () => {
        radius.value = minRadius + t.value * (maxRadius - minRadius)
    })

    // ─── Block B — radius → circle + area ────────────────────────────
    // The first consumer of radius. Draws the circle, updates the radius
    // label, and computes area — writing into `area` to trigger block C.
    Reactive.do([radius], () => {
        Circles.circleAt([cx, cy], radius, circle)
        radiusLabel.value = `radius  =  ${radius.value.toFixed(0)} px`
        area.value = Math.PI * radius.value * radius.value
        areaLabel.value   = `area    =  ${Math.round(area.value).toLocaleString()} px²`
    })

    // ─── Block C — area → colour ──────────────────────────────────────
    // Subscribes only to `area`, not to `radius` or the slider.
    // Maps normalised area to a hue: cool (blue) when small, warm (orange) when large.
    const maxArea = Math.PI * maxRadius * maxRadius
    Reactive.do([area], () => {
        const ratio     = Math.min(1, area.value / maxArea)
        const hue       = Math.round(240 - ratio * 200)   // blue → orange
        const lightness = Math.round(40 + ratio * 15)
        circleSvg.style.fill = `hsl(${hue}, 70%, ${lightness}%)`
        colourLabel.value    = `colour  =  hsl(${hue}, 70%, ${lightness}%)`
    })
}