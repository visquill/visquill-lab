/**
 * map-adapter.ts
 *
 * Thin wrapper around MapLibre GL JS.
 * Exposes only what the VisQuill scene needs — keeps the demo focused on the
 * integration pattern rather than MapLibre's full API.
 */

import * as maplibregl from "maplibre-gl";

export interface LatLng      { lat: number; lng: number }
export interface ScreenPoint { x:   number; y:   number }

export class MapAdapter {
    private map: maplibregl.Map | null = null;

    mount(container: HTMLDivElement): void {
        container.style.position = "absolute";
        container.style.inset    = "0";

        this.map = new maplibregl.Map({
            container,
            style:  "https://tiles.openfreemap.org/styles/liberty",
            center: [10.0, 51.0],
            zoom:   5,
            // compact:false shows the full attribution text immediately.
            // Attribution strings for OpenFreeMap + OpenStreetMap are embedded
            // in the style JSON — no custom text needed.
            attributionControl: { compact: false },
        });
    }

    destroy(): void {
        this.map?.remove();
        this.map = null;
    }

    // Converts a screen position (px) to geographic coordinates.
    // Used by the coordinate labels to display lat/lng as the handle moves.
    screenToLatLng(x: number, y: number): LatLng {
        if (!this.map) return { lat: 0, lng: 0 };
        const ll = this.map.unproject([x, y] as maplibregl.PointLike);
        return { lat: ll.lat, lng: ll.lng };
    }

    // Returns the MapLibre canvas element, used to forward wheel events from
    // the SVG overlay so scroll-to-zoom works over SVG elements.
    getCanvas(): HTMLCanvasElement | null {
        return this.map?.getCanvas() ?? null;
    }

    // Registers a callback that fires whenever the map moves or zooms.
    // The same callback is used for both "move" (every frame during interaction)
    // and "moveend" (when the map comes to rest) so labels stay current throughout.
    onMove(cb: () => void): void {
        if (!this.map) return;
        this.map.on("move",    cb);
        this.map.on("moveend", cb);
    }
}