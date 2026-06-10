// @name Inspection
// @category Geometry
// @group Boxes

import {
    VisQuill, Reactive, Boxes, Segments, Points, Circles
} from "@visquill/visquill-gdk"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const startTopLeft     = [220, 160]
const startBottomRight = [650, 430]
const cornerRadius     = 5
const sideLabelOffset  = 14
const infoLeft         = 20
const infoTop          = 55
const infoLineH        = 20

export function run(div: HTMLDivElement) {
    const rvg    = VisQuill.create(div, "demos-boxes-inspection-")
    const canvas = rvg.canvas
    canvas.handles.defaultZIndex = 1
    // ─── Instruction label ────────────────────────────────────────────
    const instructions = canvas.text.label(
        "Drag the corner handles to resize the box",
        "instructions"
    )
    Reactive.do([rvg.frame], () => {
        Points.moveDown(
            Segments.midPoint(Boxes.topSide(rvg.frame)),
            25,
            instructions
        )
    })

    // ─── Box defined by two corner handles ───────────────────────────
    // spannedBox() builds the smallest box that contains both points,
    // so either handle can be dragged past the other without breaking.
    const hTL = canvas.handles.disk("handle", startTopLeft)
    const hBR = canvas.handles.disk("handle", startBottomRight)


    const box = canvas.shapes.box()
    Reactive.do([hTL, hBR], () => {
        Boxes.spannedBox(hTL, hBR, box)
    })

    // ─── Box fill ─────────────────────────────────────────────────────
    const fill = canvas.visuals.box("box-fill")
    Reactive.do([box], () => { Boxes.copy(box, fill) })

    // ─── Sides — each a distinct colour ──────────────────────────────
    // topSide / bottomSide / leftSide / rightSide return Segment values.
    const sides = [
        { cls: "side-top",    mid: canvas.text.label("topSide",    "side-label"), seg: canvas.visuals.segment("side-top")    },
        { cls: "side-bottom", mid: canvas.text.label("bottomSide", "side-label"), seg: canvas.visuals.segment("side-bottom") },
        { cls: "side-left",   mid: canvas.text.label("leftSide",   "side-label"), seg: canvas.visuals.segment("side-left")   },
        { cls: "side-right",  mid: canvas.text.label("rightSide",  "side-label"), seg: canvas.visuals.segment("side-right")  },
    ]

    Reactive.do([box], () => {
        const t = Boxes.topSide(box)
        const b = Boxes.bottomSide(box)
        const l = Boxes.leftSide(box)
        const r = Boxes.rightSide(box)

        Points.copy(t.at(0), sides[0].seg.at(0)); Points.copy(t.at(1), sides[0].seg.at(1))
        Points.copy(b.at(0), sides[1].seg.at(0)); Points.copy(b.at(1), sides[1].seg.at(1))
        Points.copy(l.at(0), sides[2].seg.at(0)); Points.copy(l.at(1), sides[2].seg.at(1))
        Points.copy(r.at(0), sides[3].seg.at(0)); Points.copy(r.at(1), sides[3].seg.at(1))

        Points.moveUp(   Segments.midPoint(t), sideLabelOffset, sides[0].mid)
        Points.moveDown( Segments.midPoint(b), sideLabelOffset, sides[1].mid)
        Points.moveLeft( Segments.midPoint(l), sideLabelOffset, sides[2].mid)
        Points.moveRight(Segments.midPoint(r), sideLabelOffset, sides[3].mid)
    })

    // ─── Corners ──────────────────────────────────────────────────────
    const corners = [
        { get: (b: typeof box) => Boxes.topLeft(b),     cls: "corner-tl", label: "topLeft",     dx: -1, dy: -1 },
        { get: (b: typeof box) => Boxes.topRight(b),    cls: "corner-tr", label: "topRight",    dx:  1, dy: -1 },
        { get: (b: typeof box) => Boxes.bottomLeft(b),  cls: "corner-bl", label: "bottomLeft",  dx: -1, dy:  1 },
        { get: (b: typeof box) => Boxes.bottomRight(b), cls: "corner-br", label: "bottomRight", dx:  1, dy:  1 },
        { get: (b: typeof box) => Boxes.center(b),      cls: "corner-c",  label: "center",      dx:  1, dy: -1 },
    ]

    corners.forEach(({ get, cls, label: name, dx, dy }) => {
        const dot   = canvas.visuals.circle(cls)
        const label = canvas.text.label(name, "corner-label")
        Reactive.do([box], () => {
            const pt = get(box)
            Circles.circleAt(pt, cornerRadius, dot)
            const step = 16
            const moved = dx > 0
                ? Points.moveRight(pt, step)
                : Points.moveLeft(pt, step)
            dy > 0
                ? Points.moveDown(moved, step * 0.6, label)
                : Points.moveUp(moved, step * 0.6, label)
        })
    })

    // ─── Info panel ───────────────────────────────────────────────────
    const infoData: { name: string; get: (b: typeof box) => string }[] = [
        { name: "width",         get: b => Boxes.width(b).value.toFixed(1)         },
        { name: "height",        get: b => Boxes.height(b).value.toFixed(1)        },
        { name: "area",          get: b => Boxes.area(b).value.toFixed(0)          },
        { name: "circumference", get: b => Boxes.circumference(b).value.toFixed(1) },
        { name: "diameter",      get: b => Boxes.diameter(b).value.toFixed(1)      },
        { name: "aspectRatio",   get: b => Boxes.aspectRatio(b).value.toFixed(2)   },
        { name: "longestSide",   get: b => Boxes.longestSide(b).value.toFixed(1)   },
        { name: "shortestSide",  get: b => Boxes.shortestSide(b).value.toFixed(1)  },
        { name: "isSquare",      get: b => String(Boxes.isSquare(b).value)         },
        { name: "isEmpty",       get: b => String(Boxes.isEmpty(b).value)          },
    ]

    const infoLabels = infoData.map((_, i) => {
        const lbl = canvas.text.label("", "info-label")
        Reactive.do([rvg.frame], () => {
            const tl = Boxes.topSide(rvg.frame).at(0)
            Points.moveRight(Points.moveDown(tl, infoTop + i * infoLineH), infoLeft, lbl)
        })
        return lbl
    })

    Reactive.do([box], () => {
        infoData.forEach(({ name, get }, i) => {
            infoLabels[i].value = `${name.padEnd(14)}: ${get(box)}`
        })
    })
}