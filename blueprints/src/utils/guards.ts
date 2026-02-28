import type {Vector} from "@visquill/visquill-gdk";

/**
 * Type guard that checks if a Vector object has direction properties (dx, dy).
 * Verifies that dx and dy properties exist, are numbers, and are finite values.
 *
 * @param obj - A Vector object to check
 * @returns True if the object has valid dx and dy properties, false otherwise
 *
 * @example
 * ```typescript
 * isOriented({x: 1, y: 2, dx: 1, dy: 0}) // Returns: true
 * isOriented({x: 1, y: 2}) // Returns: false
 * isOriented({x: 1, y: 2, dx: NaN, dy: 0}) // Returns: false
 * ```
 */
export function isOriented(obj: Vector): obj is Vector & { dx: number; dy: number } {
    return (
        obj != null &&
        typeof (obj as any).dx === "number" &&
        typeof (obj as any).dy === "number" &&
        Number.isFinite((obj as any).dx) &&
        Number.isFinite((obj as any).dy)
    );
}