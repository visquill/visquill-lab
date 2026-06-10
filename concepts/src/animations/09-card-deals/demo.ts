//@name Card Deal
//@category Animations

// Demonstrates staggered animation of multiple independent objects.
// Cards fly from a deck to a fanned hand one by one using Animate.point.eased
// for position and Animate.real.eased for rotation, with setTimeout for stagger.
// Clicking again collects them back with a reverse stagger.

import {VisQuill, Animate, Reactive, Vectors, Pins, Svg, EasingFunctions} from "@visquill/visquill-gdk"
import {Controls} from "@visquill/visquill-blueprints"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const CARD_W = 52, CARD_H = 74
const CARD_COUNT = 7

const DECK_X = 250, DECK_Y = 330

// Fan: cards sit on a circular arc. ARC_X/Y is the arc centre far below
// the visible cards, so they appear to fan upward from a shared hand point.
const ARC_X = 250, ARC_Y = 610, ARC_R = 370, SPREAD = 0.65

function fanPosition(i: number) {
    const t = i / (CARD_COUNT - 1)
    const a = (t - 0.5) * SPREAD           // radians from centre of fan
    return {
        x: ARC_X + Math.sin(a) * ARC_R,
        y: ARC_Y - Math.cos(a) * ARC_R,
        angle: a,
    }
}

export function run(div: HTMLDivElement) {
    const rvg = VisQuill.create(div, "demos-")
    const canvas = rvg.layer("card-deal-")
    const controls = rvg.layer("controls-")

    // ─── Deck shadow (static cards for depth illusion) ─────────────────
    for (let i = 3; i >= 1; i--) {
        canvas.visuals.box("deck-shadow",
            [DECK_X - CARD_W / 2 + i,     DECK_Y - CARD_H / 2 - i * 2],
            [DECK_X + CARD_W / 2 + i,     DECK_Y + CARD_H / 2 - i * 2])
    }

    // ─── Cards ─────────────────────────────────────────────────────────
    // Each card is a position Point + angle Real driving a layer group.
    // The pattern mirrors the state machine demo: Vectors.copy(point, anchor)
    // moves the anchor without disturbing its orientation, then
    // Pins.withOrientation sets the rotation separately.

    const cards: Array<{
        pos:   ReturnType<typeof canvas.visuals.point>,
        angle: ReturnType<typeof canvas.values.real>,
    }> = []

    for (let i = 0; i < CARD_COUNT; i++) {
        const pos   = canvas.visuals.point("card-pos", {x: DECK_X, y: DECK_Y})
        const angle = canvas.values.real(0)

        const layer = canvas.layer()
        Vectors.copy([DECK_X, DECK_Y], layer.anchor)
        layer.visuals.box("card", [-CARD_W / 2, -CARD_H / 2], [CARD_W / 2, CARD_H / 2])

        // Keep the layer's pin in sync with position and angle
        Reactive.do([pos, angle], () => {
            Vectors.copy(pos, layer.anchor)
            Pins.withOrientation(layer.anchor, Vectors.fromAngle(angle), layer.anchor)
        })

        cards.push({pos, angle})
    }

    // ─── Deal / Collect ────────────────────────────────────────────────
    // Cards are created 0→6 so card 6 sits on top (SVG z-order).
    // Deal top card first (index 6 down to 0) so the topmost card leaves first.
    // Collect from the outside inward (index 0 and 6 first, 3 last).

    let dealt = false

    function deal() {
        for (let i = CARD_COUNT - 1; i >= 0; i--) {
            const card = cards[i]
            const fan  = fanPosition(i)
            const delay = (CARD_COUNT - 1 - i) * 130
            setTimeout(() => {
                Animate.point.eased(card.pos, {x: fan.x, y: fan.y}, 520, {
                    easing: EasingFunctions.easeOutCubic,
                })
                Animate.real.eased(card.angle, fan.angle, 520, {
                    easing: EasingFunctions.easeOutCubic,
                })
            }, delay)
        }
    }

    function collect() {
        // Stagger from outside inward: abs distance from centre determines delay
        const centre = (CARD_COUNT - 1) / 2
        for (let i = 0; i < CARD_COUNT; i++) {
            const card  = cards[i]
            const delay = Math.round(Math.abs(i - centre)) * 80
            setTimeout(() => {
                Animate.point.eased(card.pos, {x: DECK_X, y: DECK_Y}, 420, {
                    easing: EasingFunctions.easeInCubic,
                })
                Animate.real.eased(card.angle, 0, 420, {
                    easing: EasingFunctions.easeInCubic,
                })
            }, delay)
        }
    }

    // ─── Button ────────────────────────────────────────────────────────
    const button = Controls.button(controls, {
        bottomLeft: {x: 200, y: 430},
        label:      {text: "Deal"},
        width: 100, height: 24,
    })

    Svg.get(button.frame).addEventListener("click", () => {
        dealt ? collect() : deal()
        dealt = !dealt
    })
}