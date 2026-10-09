// @name Data Layers
// @category Maps

/**
 * Demonstrates MapLibre-native circle layers for dense point data.
 *
 * SVG handles the interactive UI; MapLibre renders the data points on its
 * WebGL canvas. This hybrid approach scales to thousands of points without
 * any SVG performance cost.
 *
 * Two point datasets are added as MapLibre circle layers with different
 * minZoom thresholds — capitals appear first, cities appear as you zoom in.
 * Each layer is created empty with addGroup and filled with setGroupPoints.
 *
 * A VisQuill SVG label overlays the current zoom level, updating on every
 * map move — showing how SVG and WebGL layers coexist and complement each other.
 */

import {
     Reactive, Vectors,
} from "@visquill/visquill-gdk";
import { MapAdapter } from "../utils/map-adapter";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

// ── Data ──────────────────────────────────────────────────────────────────────
//
// Two tiers of point data. Both are added to MapLibre as circle layers;
// the tier shown depends on the current zoom level (controlled by minZoom).

const CAPITALS: { lon: number; lat: number; name: string }[] = [
    { lon:  2.35, lat: 48.85, name: "Paris"     },
    { lon: -0.12, lat: 51.50, name: "London"    },
    { lon: 13.40, lat: 52.52, name: "Berlin"    },
    { lon: 12.49, lat: 41.90, name: "Rome"      },
    { lon: -3.70, lat: 40.42, name: "Madrid"    },
    { lon:  4.90, lat: 52.37, name: "Amsterdam" },
    { lon: 14.42, lat: 50.08, name: "Prague"    },
    { lon: 16.37, lat: 48.21, name: "Vienna"    },
    { lon:  4.35, lat: 50.85, name: "Brussels"  },
    { lon: 24.94, lat: 60.17, name: "Helsinki"  },
    { lon: 18.07, lat: 59.33, name: "Stockholm" },
    { lon: 10.74, lat: 59.91, name: "Oslo"      },
    { lon: 12.57, lat: 55.68, name: "Copenhagen"},
    { lon: 23.32, lat: 42.70, name: "Sofia"     },
    { lon: 28.98, lat: 41.01, name: "Istanbul"  },
    { lon: 23.72, lat: 37.97, name: "Athens"    },
    { lon: 19.04, lat: 47.50, name: "Budapest"  },
    { lon: 21.01, lat: 52.23, name: "Warsaw"    },
    { lon: -9.14, lat: 38.72, name: "Lisbon"    },
    { lon:  2.17, lat: 41.39, name: "Barcelona" },
];

// A denser second tier — major cities that appear only at closer zoom.
const CITIES: { lon: number; lat: number }[] = [
    { lon:  8.68, lat: 50.11 },  // Frankfurt
    { lon:  9.99, lat: 53.55 },  // Hamburg
    { lon: 11.58, lat: 48.14 },  // Munich
    { lon:  6.96, lat: 50.94 },  // Cologne
    { lon: -1.55, lat: 47.22 },  // Nantes
    { lon:  3.87, lat: 43.61 },  // Montpellier
    { lon:  5.37, lat: 43.30 },  // Marseille
    { lon:  7.27, lat: 43.70 },  // Nice
    { lon:  7.75, lat: 45.07 },  // Turin
    { lon:  9.19, lat: 45.46 },  // Milan
    { lon: 11.25, lat: 43.77 },  // Florence
    { lon: 14.26, lat: 40.85 },  // Naples
    { lon: 16.86, lat: 41.12 },  // Bari
    { lon: -5.99, lat: 37.39 },  // Seville
    { lon: -0.89, lat: 41.65 },  // Zaragoza
    { lon: -1.13, lat: 37.99 },  // Murcia
    { lon: -8.61, lat: 41.15 },  // Porto
    { lon:  3.72, lat: 51.05 },  // Ghent
    { lon: 17.04, lat: 51.11 },  // Wrocław
    { lon: 18.67, lat: 50.30 },  // Katowice
    { lon: 19.94, lat: 50.06 },  // Kraków
    { lon: 15.97, lat: 45.81 },  // Zagreb
    { lon: 16.64, lat: 49.20 },  // Brno
    { lon: 17.11, lat: 48.15 },  // Bratislava
];

// Zoom threshold at which the cities layer becomes visible.
const CITIES_MIN_ZOOM = 6;

export function run(container: HTMLDivElement): void {

    // ── 1. Mount ──────────────────────────────────────────────────────────────

    const { map, rvg } = MapAdapter.create(container, "maps-data-layers-", {
        center: [10.0, 50.0],
        zoom:   4,
    });

    const canvas = rvg.canvas;

    // ── 2. MapLibre circle layers ─────────────────────────────────────────────
    //
    // Points are rendered by MapLibre on its WebGL canvas — not as SVG elements.
    // This means thousands of points can be displayed with no SVG overhead.
    //
    // addGroup creates an empty, updatable layer. minZoom controls when
    // MapLibre starts rendering it; below that threshold the layer is invisible
    // regardless of what data it holds.
    //
    // We wait for the map "load" event before adding layers — MapLibre requires
    // the style to be fully loaded before sources and layers can be added.

    map.map!.once("load", () => {
        // Capitals: visible from the initial zoom (4+), larger radius.
        map.addGroup("capitals", {
            color:   "#6366f1",
            radius:  7,
            opacity: 0.9,
            minZoom: 3,
        });

        // Cities: only appear once the user zooms in past the threshold.
        // minZoom is the primary mechanism here — no JS logic needed to show/hide.
        map.addGroup("cities", {
            color:   "#9a069a",
            radius:  7,
            opacity: 0.75,
            minZoom: CITIES_MIN_ZOOM,
        });

        // Populate both layers. The cities layer is invisible until zoom >= 6
        // but the data is already there — MapLibre handles the threshold.
        map.setGroupPoints("capitals", CAPITALS);
        map.setGroupPoints("cities",   CITIES);
    });

    // ── 3. SVG zoom label ─────────────────────────────────────────────────────
    //
    // A VisQuill text label overlaying the current zoom level.
    // This demonstrates that SVG and WebGL layers coexist: the label updates
    // on every map move while the circle layers render underneath it.
    //
    // onMove fires on every pan/zoom frame, keeping the readout current.

    const infoLayer = canvas.layer("info-");
    const zoomLabel = infoLayer.text.label("", "zoom-label");

    Reactive.do([rvg.frame], () => {
        // Pin label to top-left corner with a small inset
        Vectors.copy({ x: 16, y: 16 }, zoomLabel);
    });

    function updateZoomLabel(): void {
        const z = map.getZoom().toFixed(1);
        const hint = map.getZoom() < CITIES_MIN_ZOOM
            ? `— zoom to ${CITIES_MIN_ZOOM} to see cities`
            : "— cities visible";
        zoomLabel.value = `zoom ${z}  ${hint}`;
    }

    updateZoomLabel();
    map.onMove(updateZoomLabel);
}