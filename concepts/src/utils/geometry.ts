import {type Box, Boxes} from "@visquill/visquill-gdk";

export function segmentBoxIntersection(
    a: { x: number; y: number }, b: { x: number; y: number }, box: Box
): { x: number; y: number } | null {
    const minX = Boxes.left(box).value,  maxX = Boxes.right(box).value;
    const minY = Boxes.top(box).value,   maxY = Boxes.bottom(box).value;
    const edges: [[number,number],[number,number]][] = [
        [[minX,minY],[maxX,minY]], [[maxX,minY],[maxX,maxY]],
        [[maxX,maxY],[minX,maxY]], [[minX,maxY],[minX,minY]],
    ];
    let best: { x: number; y: number } | null = null;
    let bestT = Infinity;
    for (const [[ex1,ey1],[ex2,ey2]] of edges) {
        const pt = segSegIntersection(a.x,a.y,b.x,b.y,ex1,ey1,ex2,ey2);
        if (pt) {
            const t = (pt.x-a.x)**2 + (pt.y-a.y)**2;
            if (t < bestT) { bestT = t; best = pt; }
        }
    }
    return best;
}

function segSegIntersection(
    ax:number,ay:number,bx:number,by:number,
    cx:number,cy:number,dx:number,dy:number
): { x:number; y:number } | null {
    const abx=bx-ax,aby=by-ay,cdx=dx-cx,cdy=dy-cy;
    const denom=abx*cdy-aby*cdx;
    if (Math.abs(denom)<1e-10) return null;
    const t=((cx-ax)*cdy-(cy-ay)*cdx)/denom;
    const u=((cx-ax)*aby-(cy-ay)*abx)/denom;
    if (t<0||t>1||u<0||u>1) return null;
    return { x:ax+t*abx, y:ay+t*aby };
}