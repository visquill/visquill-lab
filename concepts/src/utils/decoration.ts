import {type RvgGroup, type Point, type Box, Boxes, Symbols} from "@visquill/visquill-gdk"


/**
 * Creates randomly positioned points within a bounding box, organized by type.
 * Each type gets its own array of points, all placed at random coordinates
 * within the specified box.
 *
 * @param group - Layer to create points on
 * @param box - Bounding box for random point placement
 * @param countPerType - Number of points to generate for each type
 * @param types - Array of type identifiers (used as point styles/classes)
 * @returns Array of point arrays, where each inner array contains all points of one type
 */
export function createPoints(group: RvgGroup, box: Box, countPerType: number, types:string[]){
    const points: Point[][] = []
    const topLeft = Boxes.topLeft(box)
    const bottomRight = Boxes.bottomRight(box)
    const width = bottomRight.x - topLeft.x
    const height = bottomRight.y - topLeft.y
    for(const type of types) {
        const pointsOfType: Point[] =  []
        for (let i = 0; i < countPerType; i++) {
            const rx = Math.random() * width
            const ry = Math.random() * height
            const x = topLeft.x + rx
            const y = topLeft.y + ry
            pointsOfType.push(group.visuals.point(type,{x,y}))
        }
        points.push(pointsOfType)
    }
    return points
}


/**
 * Scatters points across two independent dimensions (e.g. color × shape).
 * Each point receives both a primary and a secondary class so it can be
 * styled by one dimension (typically the primary) while still being
 * countable along the other.
 *
 * @param group          - Layer to create points on
 * @param box            - Bounding box for random placement
 * @param countPerType   - Number of points per unique combination
 * @param primaryTypes   - First dimension (e.g. colors) — used as the visual style
 * @param secondaryTypes - Second dimension (e.g. shapes) — carried as a second class
 * @returns points[primaryIndex][secondaryIndex][] — nested array for easy counting along either axis
 */
export function createPoints2D(group: RvgGroup, box: Box, countPerType: number, primaryTypes: string[], secondaryTypes: string []) {
    const points: Point[][][] = []
    const topLeft = Boxes.topLeft(box)
    const bottomRight = Boxes.bottomRight(box)
    const width = bottomRight.x - topLeft.x
    const height = bottomRight.y - topLeft.y

    for (const primary of primaryTypes) {
        const pointsOfPrimary: Point[][] = []
        for (const secondary of secondaryTypes) {
            const pointsOfCombination: Point[] = []
            for (let i = 0; i < countPerType; i++) {
                const x = topLeft.x + Math.random() * width
                const y = topLeft.y + Math.random() * height
                // Primary class drives the visual style (e.g. color).
                // Secondary class is carried along for counting but doesn't affect appearance.
                createShape(secondary,{x,y},primary + " " + secondary)
                pointsOfCombination.push({x,y})
            }
            pointsOfPrimary.push(pointsOfCombination)
        }
        points.push(pointsOfPrimary)
    }
    return points

    function createShape(shape: string, p : Point, style: string) {
        if(shape == "diamond") Symbols.diamond(p,5,group.visuals.rectangle(style))
        else if (shape == "triangle") Symbols.triangle(p, 10,"up", group.visuals.triangle(style))
        else if (shape == "square") Symbols.square(p, 10,  group.visuals.rectangle(style))
        else if (shape == "circle") Symbols.circle(p, 5, group.visuals.circle(style))
        else throw new Error("Invalid shape")
    }
}