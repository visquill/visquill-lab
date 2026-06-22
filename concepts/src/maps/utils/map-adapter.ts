/**
 * map-adapter.ts
 *
 * Shared MapLibre GL JS wrapper used by all map demos.
 *
 * The static MapAdapter.create() method handles all mounting boilerplate
 * (DOM layout, z-indexing, pointer-event routing, wheel forwarding) so each
 * demo's run() can focus on what it actually demonstrates.
 *
 */

import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
    VisQuill, Reactive, Svg,
    Boxes, type RvgBox, type RvgHandle, type RvgGroup,
} from "@visquill/visquill-gdk";
import type { Point } from "@visquill/visquill-gdk";

export interface LatLng { lat: number; lng: number }

export interface MapOptions {
    center?:  [number, number]; // [lng, lat], default [10.0, 51.0]
    zoom?:    number;           // default 5
    minZoom?: number;
    maxZoom?: number;
    style?:   string;           // default OpenFreeMap liberty
}

export interface MapScene {
    map: MapAdapter;
    rvg: ReturnType<typeof VisQuill.create>;
}

export class MapAdapter {

    // ── Static factory ───────────────────────────────────────────────────────

    /**
     * Creates a MapLibre map and a VisQuill scene layered on top of it,
     * inside the given container element.
     *
     * DOM structure produced:
     *
     *   container  (position: relative)
     *   ├── mapDiv    z-index 1  ← MapLibre WebGL canvas
     *   └── sceneDiv  z-index 2  ← VisQuill SVG overlay
     *
     * The SVG overlay is pointer-events:none by default so all input falls
     * through to the map. Call trackHandle(handle) on any draggable handle
     * to enable the glass pane during drag — this prevents the map from
     * panning while the user is dragging an SVG handle.
     *
     * Wheel events are automatically forwarded from the SVG overlay to the
     * MapLibre canvas so scroll-to-zoom works regardless of where the
     * pointer is.
     */
    static create(
        container:  HTMLDivElement,
        cssPrefix:  string,
        options:    MapOptions = {}
    ): MapScene {
        // Ensure MapLibre CSS is present regardless of when this chunk loads
        if (!document.querySelector('link[data-maplibre]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = new URL('maplibre-gl/dist/maplibre-gl.css', import.meta.url).href;
            link.dataset.maplibre = '';
            document.head.appendChild(link);
        }
        // ── DOM layout ────────────────────────────────────────────────────
        container.style.position = "relative";
        container.style.width    = "100%";
        container.style.height   = "100%";

        const mapDiv = document.createElement("div");
        mapDiv.style.cssText = "position:absolute;inset:0;z-index:1";
        container.appendChild(mapDiv);

        const sceneDiv = document.createElement("div");
        sceneDiv.style.cssText = "position:absolute;inset:0;z-index:2;pointer-events:none";
        container.appendChild(sceneDiv);

        // ── Map + scene ───────────────────────────────────────────────────
        const map = new MapAdapter();
        map.mount(mapDiv, options);

        const rvg    = VisQuill.create(sceneDiv, cssPrefix);
        const canvas = rvg.canvas;

        // The SVG root must also be pointer-events:none — without this the
        // <svg> element itself forms a blocking surface on top of the map.
        Svg.get(canvas).style.pointerEvents = "none";

        // ── Glass pane ────────────────────────────────────────────────────
        //
        // A transparent rectangle covering the entire SVG frame.
        // Stays pointer-events:none until a tracked handle becomes active,
        // then switches to pointer-events:all to absorb the drag and prevent
        // the map from panning underneath.
        const glassPane = canvas.visuals.box("glass-pane") as RvgBox;
        Reactive.do([rvg.frame], () => { Boxes.copy(rvg.frame, glassPane); });
        Svg.get(glassPane).style.pointerEvents = "none";

        map.glassPane   = glassPane;
        map.rvgCanvas   = canvas;

        // ── Wheel forwarding ──────────────────────────────────────────────
        //
        // SVG elements with pointer-events:all absorb wheel events before
        // they reach the MapLibre canvas. Intercept them on the SVG root
        // and re-dispatch on the map canvas so scroll-to-zoom always works.
        const mapCanvas = map.getCanvas();
        if (mapCanvas) {
            Svg.get(canvas).addEventListener("wheel", (e: WheelEvent) => {
                e.preventDefault();
                mapCanvas.dispatchEvent(new WheelEvent("wheel", e));
            }, { passive: false });
        }

        return { map, rvg };
    }

    // ── Instance state ───────────────────────────────────────────────────────

    // Exposed publicly so demos that need direct MapLibre access (e.g. waiting
    // for the "load" event before adding layers) can reach it.
    public map: maplibregl.Map | null = null;

    public glassPane:  RvgBox    | null = null;
    public rvgCanvas:  RvgGroup  | null = null;
    private _activeCount: number = 0;

    // ── Lifecycle ────────────────────────────────────────────────────────────

    private mount(container: HTMLDivElement, options: MapOptions = {}): void {
        container.style.position = "absolute";
        container.style.inset    = "0";

        const {
            center  = [10.0, 51.0],
            zoom    = 5,
            minZoom,
            maxZoom,
            style   = "https://tiles.openfreemap.org/styles/liberty",
        } = options;

        this.map = new maplibregl.Map({
            container,
            style,
            center,
            zoom,
            ...(minZoom !== undefined && { minZoom }),
            ...(maxZoom !== undefined && { maxZoom }),
            attributionControl: { compact: false },
        });
    }

    destroy(): void {
        this.map?.remove();
        this.map = null;
    }

    // ── Handle tracking ──────────────────────────────────────────────────────

    /**
     * Registers a draggable handle so the glass pane activates during drag.
     *
     * While any tracked handle is active (being dragged), the glass pane
     * intercepts pointer events — preventing the map from panning underneath.
     * When all tracked handles are released, the glass pane becomes transparent
     * again so normal map interaction resumes.
     *
     * Call once per handle that should have this behaviour:
     *   map.trackHandle(myHandle);
     */
    trackHandle(handle: RvgHandle): void {
        if (!this.glassPane) return;
        const glassPane = this.glassPane;

        Reactive.do([handle.active], () => {
            if (handle.active.value) {
                this._activeCount++;
            } else {
                this._activeCount = Math.max(0, this._activeCount - 1);
            }
            // Glass pane is active as long as at least one handle is being dragged.
            Svg.get(glassPane).style.pointerEvents =
                this._activeCount > 0 ? "all" : "none";
        }, false);
    }

    // ── Coordinate conversion ────────────────────────────────────────────────

    /**
     * Converts a screen position (px) to geographic coordinates.
     *
     * Use when a screen-space element (e.g. a draggable handle) needs to know
     * its geographic meaning. Must be called both on handle move and on map
     * move, since panning changes the geographic meaning of a fixed pixel.
     */
    screenToLatLng(x: number, y: number): LatLng {
        if (!this.map) return { lat: 0, lng: 0 };
        const ll = this.map.unproject([x, y] as maplibregl.PointLike);
        return { lat: ll.lat, lng: ll.lng };
    }

    /**
     * Converts geographic coordinates to a screen position (px).
     *
     * Use to place SVG elements at a fixed geographic location. Must be called
     * on every render frame — the result changes on every pan and zoom even
     * though the geographic position is constant.
     */
    latLngToScreen(p: { lat: number; lon: number }): Point {
        if (!this.map) return { x: 0, y: 0 };
        return this.map.project([p.lon, p.lat]);
    }

    // ── Event hooks ──────────────────────────────────────────────────────────

    /**
     * Fires whenever the map view changes (every frame during pan/zoom).
     * Also fires on "moveend" so callbacks stay correct when animation settles.
     *
     * Use for: refreshing labels that display the geographic meaning of a
     * fixed screen-space element (e.g. a draggable handle's lat/lng readout).
     */
    onMove(cb: () => void): void {
        if (!this.map) return;
        this.map.on("move",    cb);
        this.map.on("moveend", cb);
    }

    /**
     * Fires on every MapLibre render frame.
     *
     * Use for: re-projecting geo-anchored SVG geometry (polylines, markers,
     * polygons) so it stays locked to geography as the user pans and zooms.
     * More frequent than onMove — fires even during tile-loading redraws.
     */
    onRender(cb: () => void): void {
        if (!this.map) return;
        this.map.on("render",()=>{
          Reactive.block(()=>{
              cb()
          })
        } );
    }

    // ── MapLibre canvas ──────────────────────────────────────────────────────

    /**
     * Returns the MapLibre WebGL canvas element.
     * Used internally by create() to forward wheel events. Exposed here for
     * demos that need direct canvas access.
     */
    getCanvas(): HTMLCanvasElement | null {
        return this.map?.getCanvas() ?? null;
    }

    // ── Zoom ─────────────────────────────────────────────────────────────────

    getZoom(): number {
        return this.map?.getZoom() ?? 0;
    }

    // ── MapLibre data layers ─────────────────────────────────────────────────
    //
    // Use for dense point data where rendering individual SVG elements would
    // be too slow. These render on the WebGL canvas, not in the SVG overlay.

    /**
     * Adds a static set of points as a MapLibre circle layer.
     * Use addGroup/setGroupPoints instead if you need to update the data.
     */
    addPoints(
        id:      string,
        points:  { lon: number; lat: number }[],
        options: {
            color?:   string;
            radius?:  number;
            opacity?: number;
            minZoom?: number;
        } = {}
    ): void {
        if (!this.map) return;

        const { color = "#e63946", radius = 5, opacity = 0.7, minZoom = 0 } = options;

        if (this.map.getLayer(id))  this.map.removeLayer(id);
        if (this.map.getSource(id)) this.map.removeSource(id);

        this.map.addSource(id, {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: points.map(p => ({
                    type:       "Feature",
                    geometry:   { type: "Point", coordinates: [p.lon, p.lat] },
                    properties: {},
                })),
            },
        } as maplibregl.GeoJSONSourceSpecification);

        this.map.addLayer({
            id,
            type:    "circle",
            source:  id,
            minzoom: minZoom,
            paint: {
                "circle-color":   color,
                "circle-radius":  radius,
                "circle-opacity": opacity,
            },
        });
    }

    /** Removes a point layer and its source created by addPoints. */
    removePoints(id: string): void {
        if (!this.map) return;
        if (this.map.getLayer(id))  this.map.removeLayer(id);
        if (this.map.getSource(id)) this.map.removeSource(id);
    }

    /**
     * Creates an empty, updatable circle layer.
     * Use when you need to swap point data frequently (e.g. on filter changes).
     * More efficient than removePoints + addPoints on every update.
     */
    addGroup(
        id:      string,
        options: {
            color?:   string;
            radius?:  number;
            opacity?: number;
            minZoom?: number;
        } = {}
    ): void {
        if (!this.map) return;

        const { color = "#e63946", radius = 5, opacity = 0.7, minZoom = 0 } = options;

        this.map.addSource(id, {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
        });

        this.map.addLayer({
            id,
            type:    "circle",
            source:  id,
            minzoom: minZoom,
            paint: {
                "circle-color":   color,
                "circle-radius":  radius,
                "circle-opacity": opacity,
            },
        });
    }

    /** Replaces the point data in a group created with addGroup. */
    setGroupPoints(id: string, points: { lon: number; lat: number }[]): void {
        if (!this.map) return;
        const source = this.map.getSource(id) as maplibregl.GeoJSONSource | undefined;
        if (!source) return;

        source.setData({
            type: "FeatureCollection",
            features: points.map(p => ({
                type:       "Feature",
                geometry:   { type: "Point", coordinates: [p.lon, p.lat] },
                properties: {},
            })),
        });
    }
}