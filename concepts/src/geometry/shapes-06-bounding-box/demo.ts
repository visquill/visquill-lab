// @name Bounding Box
// @category Geometry
// @group Shapes

import {
    VisQuill, Reactive, Shapes, Symbols, Boxes, Segments, Points, type RvgHandle, type RvgPolygon, type RvgBox
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
// Five shapes spread across the canvas with varied sizes.
const shapeConfigs: {
    type:   'diamond' | 'rectangle' | 'square' | 'triangle-up' | 'triangle-down'
    center: [number, number]
    cls:    string
}[] = [
    { type: 'diamond',        center: [180, 200], cls: 'shape-a' },
    { type: 'rectangle',      center: [550, 160], cls: 'shape-b' },
    { type: 'square',         center: [390, 310], cls: 'shape-c' },
    { type: 'triangle-up',    center: [230, 390], cls: 'shape-d' },
    { type: 'triangle-down',  center: [590, 370], cls: 'shape-e' },
]

/**
 * Demonstrates `Shapes.boundingBox()` and `Shapes.boundingBoxOfShapes()`.
 *
 * Five draggable symbol shapes are shown on the canvas.  Each shape has
 * a faint individual bounding box.  A prominent collective bounding box
 * encloses all five shapes together and updates as any shape is moved.
 *
 * @param div - The div element that will contain the graphic.
 */
export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-shapes-boundingbox-")
    const canvas = rvg.canvas

    canvas.handles.defaultZIndex = 1

    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag any shape · Individual boxes update · Collective box encloses all",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Per-shape setup ──────────────────────────────────────────────
    const handles:      RvgHandle[] = []
    const shapeVisuals: RvgPolygon[] = []
    const indivBoxes:   RvgBox[] = []

    shapeConfigs.forEach(({ center, cls }) => {
        const handle = canvas.handles.disk("shape-handle", center)
        handles.push(handle)

        const shapeVis = canvas.visuals.polygon(cls)
        shapeVisuals.push(shapeVis)

        const indivBox = canvas.visuals.box("individual-box")
        indivBoxes.push(indivBox)
    })

    // ─── Collective bounding box ──────────────────────────────────────
    const collectiveBox = canvas.visuals.box("collective-box")
    const collectiveLabel = canvas.text.label("boundingBoxOfShapes", "collective-label")

    // ─── Reactive block ───────────────────────────────────────────────
    Reactive.do([...handles], () => {
        const builtShapes = shapeConfigs.map(({ type }, i) => {
            const h = handles[i]
            switch (type) {
                case 'diamond':
                    return Symbols.diamond(h, 70)
                case 'rectangle':
                    return Symbols.rectangle(h, 120, 60)
                case 'square':
                    return Symbols.square(h, 80)
                case 'triangle-up':
                    return Symbols.triangle(h, 100, 'up')
                case 'triangle-down':
                    return Symbols.triangle(h, 100, 'down')
            }
        })

        // Draw each shape and its individual bounding box.
        builtShapes.forEach((shape, i) => {
            Shapes.copy(shape, shapeVisuals[i])
            const bb = Shapes.boundingBox(shape)
            Boxes.copy(bb, indivBoxes[i])
        })

        // Collective bounding box of all shapes.
        const collective = Shapes.boundingBoxOfShapes(builtShapes)
        Boxes.copy(collective, collectiveBox)

        // Label at top-left corner of collective box.
        Points.moveUp(
            Points.moveLeft(Boxes.topLeft(collective), 0),
            10,
            collectiveLabel
        )
    }, true)
}