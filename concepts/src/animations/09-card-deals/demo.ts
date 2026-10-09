//@name Card Deal
//@category Animations

// Demonstrates staggered animation of multiple independent objects.
// Cards fly from a deck to a fanned hand one by one. Each card is a layer;
// Animate.pin.eased moves and turns its anchor pin in one animation, with
// setTimeout for the stagger. Clicking again collects them back.

import {VisQuill, Animate, Pins, Svg, EasingFunctions} from "@visquill/visquill-gdk"
import {Controls} from "@visquill/visquill-blueprints"
import './styles.css'

// ─── Layout ───────────────────────────────────────────────────────────────
const CARD_W = 52, CARD_H = 74
const CARD_COUNT = 7

const DECK_X = 250, DECK_Y = 330

// Fan: cards sit on a circular arc. ARC_X/Y is the arc centre far below
// the visible cards, so they appear to fan upward from a shared hand point.
const ARC_X = 250, ARC_Y = 610, ARC_R = 370, SPREAD = 0.65

// The pin of card i in the fan: on the circle, turned along its tangent.
// Angles start at 3 o'clock, so -π/2 is the top of the circle.
function fanPin(i: number) {
    const t = i / (CARD_COUNT - 1)
    const angle = -Math.PI / 2 + (t - 0.5) * SPREAD
    return Pins.placeAndAlignOnCircle([ARC_X, ARC_Y], ARC_R, angle)
}

// The pin of the deck: upright, at the deck position.
const DECK_PIN = Pins.withOrientation([DECK_X, DECK_Y], [1, 0])

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
    // Each card is a layer with the card drawn around its origin. The layer's
    // anchor is a pin (position + orientation), so animating the anchor moves
    // and turns the card together.

    const cards = Array.from({length: CARD_COUNT}, () => {
        const layer = canvas.layer()
        Pins.copy(DECK_PIN, layer.anchor)
        layer.visuals.box("card", [-CARD_W / 2, -CARD_H / 2], [CARD_W / 2, CARD_H / 2])
        return layer.anchor
    })

    // ─── Deal / Collect ────────────────────────────────────────────────
    // Cards are created 0→6 so card 6 sits on top (SVG z-order).
    // Deal top card first (index 6 down to 0) so the topmost card leaves first.
    // Collect from the outside inward (index 0 and 6 first, 3 last).

    let dealt = false

    function deal() {
        for (let i = CARD_COUNT - 1; i >= 0; i--) {
            const delay = (CARD_COUNT - 1 - i) * 130
            setTimeout(() => {
                Animate.pin.eased(cards[i], fanPin(i), 520, {
                    easing: EasingFunctions.easeOutCubic,
                })
            }, delay)
        }
    }

    function collect() {
        // Stagger from outside inward: abs distance from centre determines delay
        const centre = (CARD_COUNT - 1) / 2
        for (let i = 0; i < CARD_COUNT; i++) {
            const delay = Math.round(Math.abs(i - centre)) * 80
            setTimeout(() => {
                Animate.pin.eased(cards[i], DECK_PIN, 420, {
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