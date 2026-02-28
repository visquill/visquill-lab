import type {StringValue, Real, Vector, Pin, PinLike,VectorLike} from "@visquill/visquill-gdk"
import type {Point} from "@visquill/visquill-gdk";

export function toStringValue(value: StringValue|string) : StringValue {
    return typeof value == "string" ? {value} : value
}

export function toReal(value: Real|number) : Real {
    return typeof value == "number" ? {value} : value
}

export function toRatio(value: Real|number|"center"|"start"|"end") : Real {
    if(typeof value == "string"){
        return {value: value === "center" ? 0.5 : value === "start" ? 0 : 1}
    }
    return toReal(value)
}

export function toVector(vector: Vector|number[]) : Vector {
    if(Array.isArray(vector)){
        return {x: vector[0], y: vector[1]}
    }
    return vector
}

export function toPoint(point: Point|VectorLike){
    return toVector(point) as Point
}
export function toPin(pin: PinLike) : Pin {
    if(Array.isArray(pin)){
        if(pin.length == 4){
            return {x: pin[0], y: pin[1], dx: pin[2], dy: pin[3]}
        }
        return {x: pin[0], y: pin[1], dx: 1, dy: 0}
    }
    if(isOriented(pin)){
        return pin
    }
    return {x:pin.x, y:pin.y, dx: 1, dy:0}
}

export function isOriented(obj: Vector): obj is Vector & { dx: number; dy: number } {
    return (
        obj != null &&
        typeof (obj as any).dx === "number" &&
        typeof (obj as any).dy === "number" &&
        Number.isFinite((obj as any).dx) &&
        Number.isFinite((obj as any).dy)
    );
}


