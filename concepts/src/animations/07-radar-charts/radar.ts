import {
    Circles,
    Distribute,
    type Polygon,
    Reactive,
    type Real,
    type RvgGroup, type Segment,
    Points,
    Values
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
        const outerMask = curveCanvas.mask.circle("white" )
        const innerMask = curveCanvas.mask.circle("black")
        Reactive.do([outerRadius],()=>{
            Circles.circleAt([0,0],outerRadius,outerMask)
        })
        Reactive.do([innerRadius],()=>{
            Circles.circleAt([0,0],innerRadius,innerMask)
        })
        return curves
    }

    // A value is a ratio along its ray (0 = inner circle, 1 = outer circle).
    // Stacked curves add up the values of the curves below them.
    function updateCurves(): void {
        rays.forEach((ray, rayIndex) => {
            let ratio = 0
            curves.forEach((curve, curveIndex) => {
                const value = data[curveIndex][rayIndex].value
                ratio = options.stackedCurves ? ratio + value : value
                Points.placeOnSegment(ray.at(0), ray.at(1), ratio, curve.at(rayIndex))
            })
        })
    }
}