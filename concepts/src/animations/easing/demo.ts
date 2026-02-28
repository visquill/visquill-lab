// @name Easing
// @category Animations

import {VisQuill, Svg, Animate, Attach, Rectangles} from "@visquill/visquill-gdk";
import {Controls, Options} from "@visquill/visquill-blueprints";
import './styles.css';

// Configuration

const easingFunctions = [
    {name: "linear", fn: Animate.linear, color: "linear"},
    {name: "easeOutCubic", fn: Animate.easeOutCubic, color: "out-cubic"},
    {name: "easeInCubic", fn: Animate.easeInCubic, color: "in-cubic"},
    {name: "easeInOutCubic", fn: Animate.easeInOutCubic, color: "in-out-cubic"},
    {name: "easeOutSine", fn: Animate.easeOutSine, color: "out-sine"},
    {name: "easeInSine", fn: Animate.easeInSine, color: "in-sine"},
    {name: "easeInOutSine", fn: Animate.easeInOutSine, color: "in-out-sine"},
    {name: "easeOutBack", fn: Animate.easeOutBack, color: "out-back"},
];

const values = new Options.Pixels({values: [50, 120, 200, 320, 450], title: "Cubic"});

/**
 * Creates an interactive demonstration of easing functions.
 * Each row displays a rectangle animated with a different easing curve.
 *
 * @param div - Container element for the graphic
 */
export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-");
    const canvas = rvg.layer("animations-easing-");
    const controls = rvg.layer("controls-");

    // Build visualization rows
    easingFunctions.forEach((ease, i) => {
        const y = 60 + i * 60;

        // Rectangle bar with reactive height
        const barValue = canvas.values.real(values.current);
        const bar = canvas.visuals.rectangle(`bar-${ease.color}`);
        Rectangles.alongSegment([150, y - 20], [150, y], 400, true, bar);
        Attach.rectangleHeightToValue(bar, barValue);

        // Trigger button for animation
        const button = Controls.button(controls, {
            bottomLeft: {x: 20, y: y},
            label: {text: ease.name},
            width: 120,
            height: 20
        });
        Svg.get(button.frame).addEventListener("click", () => {
            const targetValue = values.next();
            Animate.eased(barValue, targetValue, 1000, {easing: ease.fn});
        });
    })
    ;
}