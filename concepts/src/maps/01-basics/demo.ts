// @name MapLibre Basics
// @category Maps

/**
 * Demonstrates the two fundamental coordinate directions in a map overlay:
 *
 *   screen → world   A draggable handle lives in screen space. Its pixel
 *                    position is converted to lat/lng on every handle move
 *                    and on every map move (screenToLatLng + onMove).
 *
 *   world → screen   A fixed geographic point (Big Ben) is projected to
 *                    screen pixels on every render frame so the SVG marker
 *                    stays locked to the geography as the user pans and zooms
 *                    (latLngToScreen + onRender).
 */

import {
     Reactive,
    Circles, Vectors,  Attach, Points,
} from "@visquill/visquill-gdk";
import { MapAdapter } from "../utils/map-adapter";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

// A fixed world-space landmark used to demonstrate geo-anchored reprojection.
const BIG_BEN = { lat: 51.5007, lon: -0.1246 };

export function run(container: HTMLDivElement): void {

    // ── 1. Mount ──────────────────────────────────────────────────────────────
    //
    // MapAdapter.create() handles all overlay boilerplate:
    //   - two stacked divs (map below, SVG above)
    //   - pointer-events routing so the map receives input by default
    //   - wheel event forwarding so scroll-to-zoom works over SVG elements
    //   - a glass pane that blocks map input while a handle is being dragged

    const { map, rvg } = MapAdapter.create(container, "maps-basics-", {
        center: [-0.12, 51.5],
        zoom:   10,
    });

    const canvas = rvg.canvas;

    // ── 2. Screen-space handle (screen → world) ───────────────────────────────
    //
    // The handle lives in SVG pixel space. It does NOT follow the map when the
    // user pans or zooms — it stays at its screen position.
    //
    // screenToLatLng reads the geographic meaning of that pixel position.
    // It must be called both when the handle moves (new pixel, same view) and
    // when the map moves (same pixel, new view).

    const markerLayer  = canvas.layer("marker-");
    const markerHandle = markerLayer.handles.disk("handle", { x: 300, y: 200 });
    const markerRing   = markerLayer.visuals.circle("ring");

    // Register the handle so the glass pane activates during drag,
    // preventing the map from panning underneath.
    map.trackHandle(markerHandle);

    Reactive.do([markerHandle], () => {
        Circles.circleAt(markerHandle, 24, markerRing);
    });

    const screenLabel = markerLayer.text.label("", "coord-label");
    const worldLabel  = markerLayer.text.label("", "coord-label");

    Attach.pointToPoint(screenLabel, markerHandle, { offset: { x: 30, y: -15 } });
    Attach.pointToPoint(worldLabel,  markerHandle, { offset: { x: 30, y:  15 } });

    function updateWorldLabel(): void {
        const ll = map.screenToLatLng(Math.round(markerHandle.x), Math.round(markerHandle.y));
        worldLabel.value = `${ll.lat.toFixed(4)}° / ${ll.lng.toFixed(4)}°`;
    }

    Reactive.do([markerHandle], () => {
        screenLabel.value = `${Math.round(markerHandle.x)} / ${Math.round(markerHandle.y)} px`;
        updateWorldLabel();
    });

    // Re-read lat/lng on every map move — the handle hasn't moved but the
    // geographic meaning of its screen position has changed.
    map.onMove(updateWorldLabel);

    // ── 3. Geo-anchored marker (world → screen) ───────────────────────────────
    //
    // Big Ben is defined as a fixed lat/lng. On every render frame we call
    // latLngToScreen to find where it falls in the current viewport, then
    // move the SVG elements to that pixel position.
    //
    // This is the inverse of the handle above:
    //   - The handle stays fixed on pan/zoom (screen space).
    //   - This marker moves with the geography on pan/zoom (world space).
    //
    // onRender is used rather than onMove because it fires on every MapLibre
    // draw — including tile-loading redraws and animated pans — so the marker
    // never lags behind.

    const landmarkLayer = canvas.layer("landmark-");
    const landmarkDot   = landmarkLayer.visuals.point("dot");
    const landmarkRing  = landmarkLayer.visuals.circle("ring");
    const landmarkLabel = landmarkLayer.text.label("Big Ben", "label");

    function reprojectLandmark(): void {
        const s = map.latLngToScreen(BIG_BEN);
        Vectors.copy(s, landmarkDot);
        Circles.circleAt(s, 10, landmarkRing);
        Points.moveRight(Points.moveUp(s, 20), 14, landmarkLabel);
    }

    map.onRender(reprojectLandmark);
}