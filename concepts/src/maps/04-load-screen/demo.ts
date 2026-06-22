// @name Async Data & Loading Screen
// @category Maps

/**
 * Demonstrates how to handle async data loading in a map demo.
 *
 * A full-screen loading overlay is shown immediately while data is being
 * prepared. Once both the map style and the data are ready, the overlay is
 * dismissed by setting layer.mounted.value = false.
 *
 * The data — European capitals — is defined inline and returned after a short
 * simulated delay, keeping the demo self-contained while still exercising the
 * async loading pattern faithfully.
 *
 * Two things must be ready before the overlay can be dismissed:
 *   1. The MapLibre style ("load" event)
 *   2. The data (simulated async fetch)
 *
 * Promise.all() coordinates them so neither races ahead of the other.
 */

import {
    Reactive, Boxes, Vectors,
} from "@visquill/visquill-gdk";
import { MapAdapter } from "../utils/map-adapter";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

// ── Data ──────────────────────────────────────────────────────────────────────

const CAPITALS = [
    { lon:  2.35, lat: 48.85, name: "Paris"      },
    { lon: -0.12, lat: 51.50, name: "London"     },
    { lon: 13.40, lat: 52.52, name: "Berlin"     },
    { lon: 12.49, lat: 41.90, name: "Rome"       },
    { lon: -3.70, lat: 40.42, name: "Madrid"     },
    { lon:  4.90, lat: 52.37, name: "Amsterdam"  },
    { lon: 14.42, lat: 50.08, name: "Prague"     },
    { lon: 16.37, lat: 48.21, name: "Vienna"     },
    { lon:  4.35, lat: 50.85, name: "Brussels"   },
    { lon: 24.94, lat: 60.17, name: "Helsinki"   },
    { lon: 18.07, lat: 59.33, name: "Stockholm"  },
    { lon: 10.74, lat: 59.91, name: "Oslo"       },
    { lon: 12.57, lat: 55.68, name: "Copenhagen" },
    { lon: 23.32, lat: 42.70, name: "Sofia"      },
    { lon: 28.98, lat: 41.01, name: "Istanbul"   },
    { lon: 23.72, lat: 37.97, name: "Athens"     },
    { lon: 19.04, lat: 47.50, name: "Budapest"   },
    { lon: 21.01, lat: 52.23, name: "Warsaw"     },
    { lon: -9.14, lat: 38.72, name: "Lisbon"     },
    { lon: 24.11, lat: 56.95, name: "Riga"       },
    { lon: 25.28, lat: 54.69, name: "Vilnius"    },
    { lon: 24.75, lat: 59.44, name: "Tallinn"    },
    { lon: 14.51, lat: 46.05, name: "Ljubljana"  },
    { lon: 15.97, lat: 45.81, name: "Zagreb"     },
    { lon: 17.11, lat: 48.15, name: "Bratislava" },
    { lon: 26.10, lat: 44.44, name: "Bucharest"  },
    { lon: 20.46, lat: 44.80, name: "Belgrade"   },
    { lon: 21.43, lat: 41.99, name: "Skopje"     },
    { lon: 19.82, lat: 41.33, name: "Tirana"     },
    { lon: 19.24, lat: 42.44, name: "Podgorica"  },
];

// Returns the capitals after a simulated async delay.
// Swap this for a real fetch() without changing any other code.
function loadCapitals(): Promise<typeof CAPITALS> {
    return new Promise(resolve => setTimeout(() => resolve(CAPITALS), 1200));
}

export function run(container: HTMLDivElement): void {

    // ── 1. Mount ──────────────────────────────────────────────────────────────

    const { map, rvg } = MapAdapter.create(container, "maps-loading-", {
        center: [13.0, 50.0],
        zoom:   4,
    });

    const canvas = rvg.canvas;

    // ── 2. Layer order ────────────────────────────────────────────────────────
    //
    // contentLayer holds the actual visual elements,
    // hidden under the loading overlay until everything is ready.
    // loadingLayer is created second so it renders on top.
    // @ts-ignore
    const contentLayer = canvas.layer("content-");
    const loadingLayer = canvas.layer("loading-");

    // ── 3. Loading overlay ────────────────────────────────────────────────────
    //
    // A pane covering the full frame with a centred status label.
    // Dismissal is a single line: loadingLayer.mounted.value = false
    // This removes the entire layer — pane and label — from the SVG tree.

    const loadingPane  = loadingLayer.visuals.box("pane");
    const loadingLabel = loadingLayer.text.label("Loading…", "label");

    Reactive.do([rvg.frame], () => {
        Boxes.copy(rvg.frame, loadingPane);
        Vectors.copy(rvg.center, loadingLabel);
    });

    // ── 4. Parallel loading ───────────────────────────────────────────────────
    //
    // Two things must both be ready before we can build the scene:
    //   a) MapLibre style — required before addGroup can be called
    //   b) Capital data   — simulated here with a 1.2 s delay
    //
    // Promise.all waits for both. Neither races ahead of the other.

    const mapReady  = new Promise<void>(resolve => map.map!.once("load", resolve));
    const dataReady = loadCapitals();

    Promise.all([mapReady, dataReady]).then(([, capitals]) => {
        buildScene(capitals);
        loadingLayer.mounted.value = false;
    });

    // ── 5. Scene ──────────────────────────────────────────────────────────────
    //
    // Capitals are added as a MapLibre circle layer — the same addGroup pattern
    // as demo 03. The map "load" event is what makes this safe to call here.

    function buildScene(capitals: typeof CAPITALS): void {
        map.addGroup("capitals", {
            color:   "#6366f1",
            radius:  6,
            opacity: 0.9,
        });
        map.setGroupPoints("capitals", capitals);
    }
}