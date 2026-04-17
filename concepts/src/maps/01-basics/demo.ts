// @name MapLibre Basics
// @category Maps

/**
 * demo.ts
 *
 * Demonstrates how to combine a VisQuill SVG scene with a MapLibre map.
 *
 * A draggable handle floats freely over the map. It is not reprojected when
 * the map pans or zooms — it simply stays where it is in screen space.
 * Two labels update reactively whenever the handle moves:
 *   - screen coordinates (px)
 *   - world coordinates (lat / lng), read from the map at the handle's position
 */

import {
    VisQuill, Reactive, Svg,
    Circles, Boxes, Attach, type RvgBox,
} from "@visquill/visquill-gdk";
import { MapAdapter } from "./map-adapter";
import "maplibre-gl/dist/maplibre-gl.css"; // required for MapLibre UI controls to render
import "./styles.css";

export function run(container: HTMLDivElement): void {

    // ── 1. DOM layout ─────────────────────────────────────────────────────────
    //
    // Two absolutely positioned divs share the same footprint inside container:
    //
    //   container  (position: relative, fills its parent)
    //   ├── mapDiv    z-index 1  ← MapLibre renders here
    //   └── sceneDiv  z-index 2  ← VisQuill SVG renders here
    //
    // sceneDiv sits on top visually, but pointer-events:none makes it
    // transparent to mouse and touch — events fall through to mapDiv by default.

    container.style.position = "relative";
    container.style.width    = "100%";
    container.style.height   = "100%";

    const mapDiv = document.createElement("div");
    mapDiv.className = "demo-map";
    container.appendChild(mapDiv);

    const sceneDiv = document.createElement("div");
    sceneDiv.className = "demo-scene";
    sceneDiv.style.pointerEvents = "none"; // passes all events to the map by default
    container.appendChild(sceneDiv);

    // ── 2. Initialise map and VisQuill scene ──────────────────────────────────

    const map = new MapAdapter();
    map.mount(mapDiv);

    const rvg    = VisQuill.create(sceneDiv, "demo-");
    const canvas = rvg.canvas;

    // The SVG root also needs pointer-events:none — without this, the <svg>
    // element itself would form a blocking surface on top of the map.
    Svg.get(canvas).style.pointerEvents = "none";

    // ── 3. Glass pane ─────────────────────────────────────────────────────────
    //
    // A transparent rectangle covering the entire SVG frame.
    //
    // Normally it is pointer-events:none, so the map receives all input.
    // When a handle drag starts, it switches to pointer-events:all — this
    // prevents the map from panning while the user is dragging the handle.
    // As soon as the drag ends it switches back to none.
    //
    // Without this, a slow drag would both move the handle and pan the map.

    const glassPane = canvas.visuals.box("glass-pane") as RvgBox;
    Reactive.do([rvg.frame], () => { Boxes.copy(rvg.frame, glassPane); });

    function setGlassPane(active: boolean): void {
        Svg.get(glassPane).style.pointerEvents = active ? "all" : "none";
    }

    // ── 4. Wheel forwarding ───────────────────────────────────────────────────
    //
    // SVG elements with pointer-events:all (like the handle) absorb wheel events
    // before they can reach the MapLibre canvas. We intercept them on the SVG
    // root and re-dispatch onto the map canvas so scroll-to-zoom always works.

    const mapCanvas = map.getCanvas();
    if (mapCanvas) {
        Svg.get(canvas).addEventListener("wheel", (e: WheelEvent) => {
            e.preventDefault();
            mapCanvas.dispatchEvent(new WheelEvent("wheel", e));
        }, { passive: false });
    }

    // ── 5. Draggable handle ───────────────────────────────────────────────────

    const markerLayer  = canvas.layer();
    const markerHandle = markerLayer.handles.disk("marker-handle", { x: 300, y: 200 });
    const markerCircle = markerLayer.visuals.circle("marker-ring");

    // Keep the ring centred on the handle as it moves
    Reactive.do([markerHandle], () => {
        Circles.circleAt(markerHandle, 24, markerCircle);
    });

    // Engage / release the glass pane in sync with the drag state
    Reactive.do([markerHandle.active], () => {
        setGlassPane(markerHandle.active.value);
    }, false);

    // ── 6. Coordinate labels ──────────────────────────────────────────────────
    //
    // Both labels follow the handle via Attach.pointToPoint.
    //
    // The screen label only needs to update when the handle moves — its value
    // is the handle's pixel position, which does not change on map pan/zoom.
    //
    // The world label must update in two situations:
    //   a) when the handle moves   → new pixel position means new lat/lng
    //   b) when the map moves      → same pixel position means different lat/lng
    //
    // updateWorldLabel is therefore called from both Reactive.do and map.onMove.

    const screenLabel = markerLayer.text.label("", "coord-label");
    const worldLabel  = markerLayer.text.label("", "coord-label");

    Attach.pointToPoint(screenLabel, markerHandle, { offset: { x: 30, y: -15 } });
    Attach.pointToPoint(worldLabel,  markerHandle, { offset: { x: 30, y:  15 } });

    function updateWorldLabel(): void {
        const ll = map.screenToLatLng(Math.round(markerHandle.x), Math.round(markerHandle.y));
        worldLabel.value = `world   ${ll.lat.toFixed(2)}° / ${ll.lng.toFixed(2)}°`;
    }

    Reactive.do([markerHandle], () => {
        const x = Math.round(markerHandle.x);
        const y = Math.round(markerHandle.y);
        screenLabel.value = `screen  ${x} / ${y} px`;
        updateWorldLabel();
    });

    // Re-read lat/lng whenever the map moves — the handle hasn't moved but the
    // geographic meaning of its screen position has changed.
    map.onMove(updateWorldLabel);
}