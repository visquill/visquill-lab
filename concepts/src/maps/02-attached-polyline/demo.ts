// @name Reprojected Geometry
// @category Maps

/**
 * Demonstrates how to keep SVG geometry locked to geography.
 *
 * A polyline is defined as a list of lat/lng waypoints. On every MapLibre
 * render frame, each waypoint is projected to screen pixels and the polyline
 * is rebuilt. The result stays pinned to the map through any pan, zoom, or
 * animated transition.
 *
 * A draggable handle floats freely over the map. When released, it snaps to
 * the nearest point on the route using Polylines.closestPoint — showing that
 * reprojected SVG geometry is fully interactive, not just decorative.
 * A label on the handle displays the distance along the route as a percentage.
 *
 * The key pattern:
 *
 *   map.onRender(() => {
 *       const screen = geoPoints.map(p => map.latLngToScreen(p));
 *       Polylines.smooth(screen, 2, route);
 *   });
 *
 * Everything else — snapping, labels, handle interaction — is plain VisQuill
 * with no map-specific code.
 */

import {
    Reactive,
    Polylines, Attach, Points, Segments,
} from "@visquill/visquill-gdk";
import { MapAdapter } from "../utils/map-adapter";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

// ── Route definition ──────────────────────────────────────────────────────────
//
// Rhine river waypoints from Basel to Rotterdam (the same strongly
// simplified course as in the Route Chart demo; don't use it for actual
// applications). Defined in geographic coordinates; never touched again
// after mount.

const RHINE: { lat: number; lon: number }[] = [
    { lat: 47.56, lon:  7.59 },  // Basel
    { lat: 47.68, lon:  7.58 },
    { lat: 47.82, lon:  7.57 },
    { lat: 47.96, lon:  7.59 },
    { lat: 48.10, lon:  7.62 },
    { lat: 48.25, lon:  7.68 },
    { lat: 48.40, lon:  7.74 },
    { lat: 48.58, lon:  7.79 },  // Strasbourg
    { lat: 48.72, lon:  7.87 },
    { lat: 48.84, lon:  8.00 },
    { lat: 48.94, lon:  8.18 },
    { lat: 49.02, lon:  8.31 },  // Karlsruhe
    { lat: 49.15, lon:  8.38 },
    { lat: 49.28, lon:  8.43 },
    { lat: 49.39, lon:  8.46 },
    { lat: 49.49, lon:  8.47 },  // Mannheim
    { lat: 49.58, lon:  8.43 },
    { lat: 49.67, lon:  8.38 },
    { lat: 49.78, lon:  8.34 },
    { lat: 49.88, lon:  8.30 },
    { lat: 50.00, lon:  8.27 },  // Mainz
    { lat: 49.98, lon:  8.05 },
    { lat: 49.97, lon:  7.90 },  // Bingen
    { lat: 50.06, lon:  7.77 },
    { lat: 50.15, lon:  7.72 },
    { lat: 50.24, lon:  7.60 },
    { lat: 50.36, lon:  7.60 },  // Koblenz
    { lat: 50.44, lon:  7.40 },
    { lat: 50.57, lon:  7.23 },
    { lat: 50.73, lon:  7.10 },  // Bonn
    { lat: 50.84, lon:  6.98 },
    { lat: 50.94, lon:  6.96 },  // Cologne
    { lat: 51.05, lon:  6.88 },
    { lat: 51.22, lon:  6.77 },  // Düsseldorf
    { lat: 51.38, lon:  6.74 },  // Duisburg
    { lat: 51.53, lon:  6.67 },
    { lat: 51.66, lon:  6.61 },
    { lat: 51.76, lon:  6.40 },
    { lat: 51.84, lon:  6.12 },
    { lat: 51.96, lon:  5.91 },
    { lat: 51.88, lon:  5.43 },
    { lat: 51.84, lon:  4.97 },
    { lat: 51.82, lon:  4.67 },  // Dordrecht
    { lat: 51.90, lon:  4.49 },  // Rotterdam
];

export function run(container: HTMLDivElement): void {

    // ── 1. Mount ──────────────────────────────────────────────────────────────

    const { map, rvg } = MapAdapter.create(container, "maps-reprojection-", {
        center: [8.0, 50.2],
        zoom:   6,
    });

    const canvas = rvg.canvas;

    // ── 2. Reprojected route polyline ─────────────────────────────────────────
    //
    // The route is stored in world space (RHINE). On every render frame we
    // project each waypoint to screen pixels and rebuild the polyline.
    //
    // Polylines.smooth() runs Chaikin corner-cutting (2 passes) so the route
    // looks like a river rather than a chain of straight segments.
    //
    // This is the core reprojection pattern:
    //   onRender → latLngToScreen per point → Polylines.smooth → polyline visual

    const routeLayer = canvas.layer("route-");
    const route      = routeLayer.visuals.polyline("line");

    map.onRender(() => {
        const screen = RHINE.map(p => map.latLngToScreen(p));
        Polylines.smooth(screen, 2, route);
    });

    // ── 3. Closest-point handle ───────────────────────────────────────────────
    //
    // A handle the user can drag freely. When released, it snaps to the nearest
    // point on the route. While dragging, the snap dot shows where it would
    // land. A label shows how far along the route the snap point is
    // (0% = Basel, 100% = Rotterdam).
    //
    // All of this is standard VisQuill — no map-specific code. The polyline
    // just happens to be reprojected from geo coordinates.

    const handleLayer = canvas.layer("handle-");
    const snapLayer   = canvas.layer("snap-");

    const handle    = handleLayer.handles.disk("handle", { x: 400, y: 300 });
    const snapDot   = snapLayer.visuals.point("dot");
    const connector = snapLayer.visuals.segment("connector");
    const posLabel  = handleLayer.text.label("", "pos-label");

    map.trackHandle(handle);

    Attach.pointToPoint(posLabel, handle, { offset: { x: 16, y: -16 } });

    Reactive.do([handle,snapDot],()=>{
        Segments.segment(handle,snapDot,connector)
    })

    Reactive.do([handle, route], () => {
        // Find the nearest point on the (reprojected) route
        Polylines.closestPoint(route, handle, snapDot);

        // Normalised position along the route (0 = Basel, 1 = Rotterdam)
        const t = Polylines.closestPosition(route, handle).value;
        posLabel.value = `${Math.round(t * 100)}%`;

        // Hide the connector when the handle is sitting on the route
        const dist = Points.distanceToPoint(handle, snapDot).value;
        connector.visible.value = dist > 2;
    });

    // On drag end, snap the handle onto the route
    Reactive.do([handle.active], () => {
        if (!handle.active.value) {
            Polylines.closestPoint(route, handle, handle);
        }
    }, false);
}