import type {StringValue, Real, Vector, Pin, PinLike, VectorLike} from "@visquill/visquill-gdk"
import type {Point} from "@visquill/visquill-gdk";
import {isOriented} from "./guards";

/**
 * Converts a string or StringValue to a StringValue object.
 * If the input is already a StringValue, returns it unchanged.
 * If the input is a plain string, wraps it in a StringValue object.
 *
 * @param value - A string or StringValue to convert
 * @returns A StringValue object
 *
 * @example
 * ```typescript
 * toStringValue("hello") // Returns: {value: "hello"}
 * toStringValue({value: "world"}) // Returns: {value: "world"}
 * ```
 */
export function toStringValue(value: StringValue | string): StringValue {
    return typeof value == "string" ? {value} : value
}

/**
 * Converts a number or Real to a Real object.
 * If the input is already a Real, returns it unchanged.
 * If the input is a plain number, wraps it in a Real object.
 *
 * @param value - A number or Real to convert
 * @returns A Real object
 *
 * @example
 * ```typescript
 * toReal(42) // Returns: {value: 42}
 * toReal({value: 3.14}) // Returns: {value: 3.14}
 * ```
 */
export function toReal(value: Real | number): Real {
    return typeof value == "number" ? {value} : value
}

/**
 * Converts a numeric value or alignment keyword to a Real ratio object (0 to 1).
 * String keywords are mapped to ratio values: "start" → 0, "center" → 0.5, "end" → 1.
 *
 * @param value - A number, Real, or alignment keyword ("start", "center", "end")
 * @returns A Real object with a value between 0 and 1
 *
 * @example
 * ```typescript
 * toRatio("center") // Returns: {value: 0.5}
 * toRatio("start") // Returns: {value: 0}
 * toRatio("end") // Returns: {value: 1}
 * toRatio(0.75) // Returns: {value: 0.75}
 * ```
 */
export function toRatio(value: Real | number | "center" | "start" | "end"): Real {
    if (typeof value == "string") {
        return {value: value === "center" ? 0.5 : value === "start" ? 0 : 1}
    }
    return toReal(value)
}

/**
 * Converts a number array or Vector to a Vector object.
 * If the input is an array, creates a Vector from the first two elements as x and y coordinates.
 * If the input is already a Vector, returns it unchanged.
 *
 * @param vector - A two-element number array [x, y] or Vector object
 * @returns A Vector object with x and y properties
 *
 * @example
 * ```typescript
 * toVector([10, 20]) // Returns: {x: 10, y: 20}
 * toVector({x: 5, y: 15}) // Returns: {x: 5, y: 15}
 * ```
 */
export function toVector(vector: Vector | number[]): Vector {
    if (Array.isArray(vector)) {
        return {x: vector[0], y: vector[1]}
    }
    return vector
}

/**
 * Converts a VectorLike or Point to a Point object.
 * This is a type-casting wrapper around toVector for Point types.
 *
 * @param point - A VectorLike or Point to convert
 * @returns A Point object
 *
 * @example
 * ```typescript
 * toPoint([5, 10]) // Returns: {x: 5, y: 10} as Point
 * toPoint({x: 3, y: 7}) // Returns: {x: 3, y: 7} as Point
 * ```
 */
export function toPoint(point: Point | VectorLike) {
    return toVector(point) as Point
}

/**
 * Converts a PinLike value to a Pin object with position and direction.
 * Handles multiple input formats:
 * - Array with 4 elements [x, y, dx, dy]: full pin specification
 * - Array with 2 elements [x, y]: position only, defaults to rightward direction (dx=1, dy=0)
 * - Object with dx/dy properties: returns as-is if it's an oriented vector
 * - Vector without direction: adds default rightward direction (dx=1, dy=0)
 *
 * @param pin - A PinLike value (array or object) to convert
 * @returns A Pin object with x, y, dx, and dy properties
 *
 * @example
 * ```typescript
 * toPin([10, 20, 1, 0]) // Returns: {x: 10, y: 20, dx: 1, dy: 0}
 * toPin([5, 15]) // Returns: {x: 5, y: 15, dx: 1, dy: 0}
 * toPin({x: 3, y: 7, dx: 0, dy: 1}) // Returns: {x: 3, y: 7, dx: 0, dy: 1}
 * toPin({x: 8, y: 12}) // Returns: {x: 8, y: 12, dx: 1, dy: 0}
 * ```
 */
export function toPin(pin: PinLike): Pin {
    if (Array.isArray(pin)) {
        if (pin.length == 4) {
            return {x: pin[0], y: pin[1], dx: pin[2], dy: pin[3]}
        }
        return {x: pin[0], y: pin[1], dx: 1, dy: 0}
    }
    if (isOriented(pin)) {
        return pin
    }
    return {x: pin.x, y: pin.y, dx: 1, dy: 0}
}

