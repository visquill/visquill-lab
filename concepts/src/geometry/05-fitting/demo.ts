// @name Fits
// @category Geometry
// @group Misc

import {VisQuill, Reactive, Boxes, Circles, Fits, Shapes,} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Centre of each panel in the 2×2 grid.
const panelCentres: [number, number][] = [
    [250, 250], // box-in-box    (top-left)
    [750, 250], // box-in-circle (top-right)
    [250, 750], // circle-in-box (bottom-left)
    [750, 750], // circle-in-circle (bottom-right)
]

// Starting size of each target shape.
const targetBoxSize     = 160
const targetCircleRadius = 80

// The source shapes are fixed — only the targets are draggable.
const sourceBoxWidth   = 100
const sourceBoxHeight  = 60
const sourceCircleRadius = 50

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-fits-")
    const canvas = rvg.canvas

    // ─── Box in Box ───────────────────────────────────────────────────
    {
        const [cx, cy] = panelCentres[0]

        // Target: resizable box controlled by a corner handle.
        const targetBox = canvas.visuals.box("target-box")
        const corner    = canvas.handles.disk("handle", [cx + targetBoxSize / 2, cy + targetBoxSize / 2])

        Reactive.do([corner], () => {
            Boxes.centeredBox([cx, cy], Math.abs(corner.x - cx) * 2, Math.abs(corner.y - cy) * 2, targetBox)
        })

        // Source: fixed-size box, fitted inside the target.
        const sourceBox    = Boxes.centeredBox([0, 0], sourceBoxWidth, sourceBoxHeight)
        const fittedSource = canvas.visuals.box("source-box")

        Reactive.do([corner], () => {
            const pin = Fits.boxInBox(sourceBox, targetBox)
            // apply pin transform to source corners and draw
            Shapes.transform(sourceBox, pin, fittedSource)
        })

        canvas.text.labelAt("boxInBox", { x: cx, y: cy  }, "panel-label")
    }

    // ─── Box in Circle ────────────────────────────────────────────────
    {
        const [cx, cy] = panelCentres[1]

        const targetCircle = canvas.visuals.circle("target-circle")
        const radiusHandle = canvas.handles.disk("handle", [cx + targetCircleRadius, cy])

        Reactive.do([radiusHandle], () => {
            const r = Math.abs(radiusHandle.x - cx)
            Circles.circleAt([cx, cy], r, targetCircle)
        })

        const sourceBox    = Boxes.centeredBox([0, 0], sourceBoxWidth, sourceBoxHeight)
        const fittedSource = canvas.visuals.box("source-box")

        Reactive.do([radiusHandle], () => {
            const pin = Fits.boxInCircle(sourceBox, targetCircle)
            Shapes.transform(sourceBox, pin, fittedSource)
        })

        canvas.text.labelAt("boxInCircle", { x: cx, y: cy }, "panel-label")
    }

    // ─── Circle in Box ────────────────────────────────────────────────
    {
        const [cx, cy] = panelCentres[2]

        const targetBox = canvas.visuals.box("target-box")
        const corner    = canvas.handles.disk("handle", [cx + targetBoxSize / 2, cy + targetBoxSize / 2])

        Reactive.do([corner], () => {
            Boxes.centeredBox([cx, cy], Math.abs(corner.x - cx) * 2, Math.abs(corner.y - cy) * 2, targetBox)
        })

        const sourceCircle = Circles.circleAt([0, 0], sourceCircleRadius)
        const fittedSource = canvas.visuals.circle("source-circle")

        Reactive.do([corner], () => {
            const pin = Fits.circleInBox(sourceCircle, targetBox)
            Shapes.transform(sourceCircle, pin, fittedSource)
        })

        canvas.text.labelAt("circleInBox", { x: cx, y: cy  }, "panel-label")
    }

    // ─── Circle in Circle ─────────────────────────────────────────────
    {
        const [cx, cy] = panelCentres[3]

        const targetCircle = canvas.visuals.circle("target-circle")
        const radiusHandle = canvas.handles.disk("handle", [cx + targetCircleRadius, cy])

        Reactive.do([radiusHandle], () => {
            const r = Math.abs(radiusHandle.x - cx)
            Circles.circleAt([cx, cy], r, targetCircle)
        })

        const sourceCircle = Circles.circleAt([0, 0], sourceCircleRadius)
        const fittedSource = canvas.visuals.circle("source-circle")

        Reactive.do([radiusHandle], () => {
            const pin = Fits.circleInCircle(sourceCircle, targetCircle)
            Shapes.transform(sourceCircle, pin, fittedSource)
        })

        canvas.text.labelAt("circleInCircle", { x: cx, y: cy  }, "panel-label")
    }
}