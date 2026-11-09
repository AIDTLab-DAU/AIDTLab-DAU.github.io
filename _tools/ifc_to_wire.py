"""Extract a compact feature-edge wireframe from an IFC building model (e.g. a Revit export).

Usage:  pip install ifcopenshell numpy
        python3 _tools/ifc_to_wire.py "SMARTCITY LAB.ifc" assets/twin/smartcity-lab.bin

Output: same little-endian binary as citygml_to_wire.py, read by assets/js/twin.js
        [uint32 n] then n*(6 int16 coords in cm, Z-up, centred on the building) + n uint8 category
        category 0 = structure (walls, slabs, columns, beams) · 1 = windows/doors
                 2 = facade details (louvers, railings, stairs) · 3 = site context (road, curbs, parking)
"""
import sys, re, math, struct, collections, multiprocessing
import numpy as np
import ifcopenshell, ifcopenshell.geom

CREASE = math.cos(math.radians(25))   # keep edges where faces meet at more than 25°
MIN_LEN = 5                           # cm — drop tiny detail
SITE_RADIUS = 4200                    # cm from the building centre — how much of the site to keep

SKIP_NAME = re.compile(r'PEDESTAL|수로관|저류조|집수정|맨홀|Trench', re.I)
SITE_NAME = re.compile(r'경계석|경계블록|주차|볼라드|잔디|Surface', re.I)
FACADE_NAME = re.compile(r'루버|Curtain Box|Wall Sweep', re.I)

def category(el):
    t, name = el.is_a(), el.Name or ''
    if t in ('IfcFooting', 'IfcOpeningElement', 'IfcFlowTerminal', 'IfcPipeSegment') or SKIP_NAME.search(name):
        return None
    if t in ('IfcRoad', 'IfcRoadPart') or SITE_NAME.search(name):
        return 3
    if t in ('IfcWindow', 'IfcDoor'):
        return 1
    if t in ('IfcRailing', 'IfcStairFlight', 'IfcStair') or FACADE_NAME.search(name):
        return 2
    if t in ('IfcWall', 'IfcSlab', 'IfcColumn', 'IfcBeam', 'IfcCovering', 'IfcRoof', 'IfcMember', 'IfcPlate'):
        return 0
    return None  # anything else (furniture-like proxies, MEP) is left out

def feature_edges(verts, faces):
    """verts in metres → set of ((x,y,z),(x,y,z)) integer-cm edges on boundaries or creases."""
    q = np.round(verts * 100).astype(np.int64)
    uniq, inv = np.unique(q, axis=0, return_inverse=True)
    inv = inv.reshape(-1)
    tri = inv[faces]
    tri = tri[(tri[:, 0] != tri[:, 1]) & (tri[:, 1] != tri[:, 2]) & (tri[:, 0] != tri[:, 2])]
    if not len(tri):
        return []
    p = uniq.astype(np.float64)
    n = np.cross(p[tri[:, 1]] - p[tri[:, 0]], p[tri[:, 2]] - p[tri[:, 0]])
    ln = np.linalg.norm(n, axis=1, keepdims=True); ln[ln == 0] = 1; n /= ln
    adj = collections.defaultdict(list)
    for i, (a, b, c) in enumerate(tri):
        for u, v in ((a, b), (b, c), (c, a)):
            adj[(u, v) if u < v else (v, u)].append(i)
    out = []
    for (u, v), fs in adj.items():
        if len(fs) == 2 and abs(float(n[fs[0]] @ n[fs[1]])) > CREASE:
            continue  # flat seam inside a face, or a smooth curve
        out.append((tuple(int(x) for x in uniq[u]), tuple(int(x) for x in uniq[v])))
    return out

def main(src, dst):
    f = ifcopenshell.open(src)
    s = ifcopenshell.geom.settings(); s.set('use-world-coords', True)
    it = ifcopenshell.geom.iterator(s, f, multiprocessing.cpu_count())
    edges = {}
    if it.initialize():
        while True:
            sh = it.get(); el = f.by_id(sh.id); cat = category(el)
            if cat is not None:
                v = np.array(sh.geometry.verts).reshape(-1, 3)
                fa = np.array(sh.geometry.faces).reshape(-1, 3)
                for a, b in feature_edges(v, fa):
                    if math.dist(a, b) < MIN_LEN: continue
                    k = (a, b) if a < b else (b, a)
                    edges[k] = min(cat, edges.get(k, 9))
            if not it.next(): break
    bld = [k for k, c in edges.items() if c != 3]
    xs = [p[0] for k in bld for p in k]; ys = [p[1] for k in bld for p in k]; zs = [p[2] for k in bld for p in k]
    cx, cy, cz = (min(xs) + max(xs)) // 2, (min(ys) + max(ys)) // 2, min(zs)
    out = []
    for (a, b), c in edges.items():
        a = (a[0] - cx, a[1] - cy, a[2] - cz); b = (b[0] - cx, b[1] - cy, b[2] - cz)
        if c == 3 and max(math.hypot(a[0], a[1]), math.hypot(b[0], b[1])) > SITE_RADIUS: continue
        if min(a[2], b[2]) < -150: continue  # below ground (foundations)
        out.append((a, b, c))
    out.sort(key=lambda e: e[2])
    with open(dst, 'wb') as fh:
        fh.write(struct.pack('<I', len(out)))
        for a, b, _ in out: fh.write(struct.pack('<6h', *a, *b))
        fh.write(bytes(c for *_, c in out))
    print(len(out), 'edges; building extent cm', max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))
    print(sorted(collections.Counter(c for *_, c in out).items()))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
