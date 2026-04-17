// @name Masked Background
// @category Lenses

import {VisQuill, Reactive, Attach, Boxes} from "@visquill/visquill-gdk"
import {Options, Controls} from "@visquill/visquill-blueprints";
import './styles.css'
import {createPoints} from "../../utils/decoration";

// Configuration
// Each Options object cycles through predefined values when control buttons are clicked.

const radii = new Options.Pixels({values: [80, 100, 120, 140],title: "Radius", animationTime: 1000})

const dataTypes = ["red", "green", "blue", "orange"]
const numberOfDataPoints = 100

// Bounding box for scatter points. The lens moves freely within this area.
const pointBox = Boxes.box([150, 50], 800, 600)

/**
 * Creates an interactive lens that counts scattered data points by category.
 * The lens is draggable. Bars update reactively as points enter or leave the lens area.
 *
 * @param div - HTML element where the graphic renders
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("lenses-masked-background-")
    const controls = rvg.layer("controls-")

    // Layer organization
    const pointLayer = canvas.layer()
    const cover = canvas.layer()

    // Lens in dedicated sub-layer for group movement
    const lens = canvas.layer()
    const lensRadius = radii.bind(lens.values.real())

    // Invisible handle provides drag target for lens
    const handle = canvas.handles.disk("handle", Boxes.center(pointBox))

    // Build scene
    createPoints(pointLayer, pointBox, numberOfDataPoints, dataTypes)
    createCover()
    createLens()

    Controls.optionsPanel(controls,{anchor: {x: 10, y: 40}, entries:[radii]})

    function createCover() {
        const box = cover.visuals.box("@style fill:#000000AA")
        Reactive.do([rvg.frame], () => {
            Boxes.copy(rvg.frame, box)
        })
        cover.mask.box(rvg.frame, "white")
        cover.mask.circle(handle, lensRadius, "black")
    }

    function createLens() {
        // Circular boundary
        const ring = lens.visuals.circle("ring")
        Attach.circleRadiusToValue(ring, lensRadius)

        // Pin lens group to draggable handle
        Attach.pointToPoint(lens.anchor, handle)
    }
}