import {
    Circles,
    Distribute,
    type Polygon,
    Reactive,
    type Real,
    type RvgGroup, type Segment,
    Values,
    Vectors
} from "@visquill/visquill-gdk";

export type RadarChart =
    { group: RvgGroup, innerRadius: Real, rayLength: Real, data: Real[][] }

export function createRadarChart(canvas: RvgGroup, options: {
    numberOfRays: number,
    numberOfCurves: number,
    stackedCurves: boolean,
    classPrefix?: string,
    innerRadius: number,
    rayLength: number
}): RadarChart {
    const group = canvas.layer(options.classPrefix ?? "")
    const innerRadius = group.values.real(options.innerRadius)
    const rayLength = group.values.real(options.rayLength)

    const outerCircle = group.visuals.circle("@css outer-circle")
    const innerCircle = group.visuals.circle("@css inner-circle")
    const outerRadius = group.values.real()
    const rays = createRays()
    const curves = createCurves()
    const data = curves.map(_ => rays.map(_ => group.values.real()))

    Reactive.do([innerRadius, rayLength], () => {
        Values.add(innerRadius, rayLength, outerRadius)
    })

    Reactive.do(data.flat().concat(outerRadius), () => {
        Circles.circleAt([0, 0], innerRadius, innerCircle)
        Circles.circleAt([0, 0], outerRadius, outerCircle)
        Distribute.pointsOnCircle(rays.map(ray => ray.at(0)), innerCircle, 0, true)
        Distribute.pointsOnCircle(rays.map(ray => ray.at(1)), outerCircle, 0, true)
        updateCurves()
    })

    return { group, innerRadius, rayLength, data }

    function createRays(): Segment[] {
        return Array.from({ length: options.numberOfRays }, () =>
            group.visuals.segment("@css ray")
        )
    }

    function createCurves(): Polygon[] {
        const curveCanvas = group.layer()
        const curves: Polygon[] = []

        for (let j = 0; j < options.numberOfCurves; j++) {
            const hue = (j * 360) / options.numberOfCurves
            // Curves intentionally keep @style for fine-grained per-curve colour
            const fill = `hsl(${hue}, 90%, 70%)`
            const curve = curveCanvas.visuals.polygon(
                `@style stroke: none; fill: ${fill}; fill-opacity: 0.72;`,
                options.numberOfRays
            )
            curve.zIndex.value = options.numberOfCurves - j
            curves.push(curve)
        }

        Reactive.linkVertices(curves[0])
        curveCanvas.mask.circle([0, 0], outerRadius, "white")
        curveCanvas.mask.circle([0, 0], innerRadius, "black")
        return curves
    }

    function updateCurves(): void {
        for (let rayIndex = 0; rayIndex < rays.length; rayIndex++) {
            const ray = rays[rayIndex]
            let start = ray.at(0)
            const dir = Vectors.normalize(Vectors.direction(start, ray.at(1)))

            for (let curveIndex = 0; curveIndex < curves.length; curveIndex++) {
                const curve = curves[curveIndex]
                const value = data[curveIndex][rayIndex]
                const length = rayLength.value * value.value
                const p = Vectors.add(start, Vectors.scale(dir, length), curve.at(rayIndex))
                if (options.stackedCurves) {
                    start = p
                }
            }
        }
    }
}