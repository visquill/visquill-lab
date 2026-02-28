import {Animate, type Bool, type Point, type Real, type StringValue, Vectors} from "@visquill/visquill-gdk"

/**
 * A generic utility class that manages a cycleable collection of values with a descriptive title.
 * Useful for creating option toggles or cyclic controls in UI components.
 *
 * @template T - The type of values stored in the options collection
 */
export abstract class Options<T, V> {
    private currentIndex = 0
    protected variables: V[] = []

    public readonly values: T[]
    public readonly title: string


    /**
     * Creates a new Options instance.
     *
     * @param values - Array of values to cycle through
     * @param title - Descriptive title for this options group (e.g., "Rotation", "Size")
     */
    constructor(options: {
                    values: T[],
                    title: string,
                },
    ) {
        this.values = options.values
        this.title = options.title
    }

    /**
     * Advances to and returns the next value in the cycle.
     * Wraps around to the first value after reaching the end.
     *
     * @returns The next value in the options array
     */
    next(): T {
        const value = this.values[++this.currentIndex % this.values.length]
        for (const variable of this.variables) {
            this.update(variable, value)
        }
        return value
    }

    /**
     * Gets the current value without advancing the index.
     *
     * @returns The currently selected value
     */
    get current(): T {
        return this.values[this.currentIndex % this.values.length]
    }

    public bind(variable: V) {
        this.variables.push(variable)
        this.update(variable, this.current)
        return variable
    }

    public remove(variable: V) {
        this.variables = this.variables.filter(v => v !== variable)
    }

    protected abstract update(variable: V, value: T): void;

    public valueToString(): string{
        return this.current+""
    }

}

class NumberBasedOptions extends Options<number, Real> {
    public readonly animationTime? : number


    constructor(options: { values: number[]; title: string, animationTime?: number }) {
        super(options);
        this.animationTime = options.animationTime;
    }

    protected update(v: Real, value: number): void {
        if(this.animationTime){
            Animate.eased(v, value, this.animationTime)
        }else{
            v.value = value
        }
    }
}

/**
 * Specialized Options class for cycling through radian angle values.
 * Commonly used for rotation controls in visualizations.
 */
export class Radians extends NumberBasedOptions {
    valueToString(): string {
        const value = this.current / Math.PI
        if(Math.abs(value-1.0) < 0.01){
            return "π"
        }
        return value.toFixed(2) + "π";
    }
}

/**
 * Specialized Options class for cycling through pixel measurement values.
 * Commonly used for size, distance, or dimension controls.
 */
export class Pixels extends NumberBasedOptions {
    valueToString(): string {
        return this.current.toFixed(0) + "px";
    }
}

/**
 * Specialized Options class for cycling through string values.
 * Commonly used for text options, labels, or style class names.
 */
export class Strings extends Options<string, StringValue> {
    protected update(variable: StringValue, value: string): void {
        variable.value = value
    }
}

/**
 * Specialized Options class for cycling through boolean values.
 * Commonly used for toggle switches or binary state controls.
 */
export class Booleans extends Options<boolean, Bool> {
    protected update(variable: Bool, value: boolean): void {
        variable.value = value
    }
    valueToString(): string{
        return this.current ? "On" : "Off"
    }
}

/**
 * Specialized Options class for cycling through Point coordinate values.
 * Commonly used for position or anchor point controls in visualizations.
 */
export class Points extends Options<Point, Point> {
    protected update(variable: Point, value: Point): void {
        Vectors.copy(value, variable)
    }

    valueToString(): string {
        return `(${this.current.x.toFixed(0)}, ${this.current.y.toFixed(0)})`
    }
}
