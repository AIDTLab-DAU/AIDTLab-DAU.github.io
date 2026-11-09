"""Extract a compact feature-edge wireframe from a CityGML LOD4 building.
Output: little-endian binary  [uint32 n] then n*(6 int16 coords in cm, centred) + n uint8 category."""
import re,sys,struct,math,collections
src=open(sys.argv[1],encoding='utf-8').read()
KEEP={'bldg:WallSurface':0,'bldg:RoofSurface':0,'bldg:FloorSurface':0,'bldg:GroundSurface':0,
      'bldg:Window':1,'bldg:Door':1,'bldg:BuildingInstallation':2,'other':0}
SEM=set(KEEP)|{'bldg:IntBuildingInstallation','bldg:BuildingFurniture','bldg:CeilingSurface','bldg:InteriorWallSurface','bldg:ClosureSurface'}
stack=[];polys=[]
for m in re.finditer(r'<(/?)(bldg:\w+)[^>]*?(/?)>|<gml:posList[^>]*>([^<]+)</gml:posList>',src):
    if m.group(4):
        t=next((s for s in reversed(stack) if s in SEM),'other')
        if t in KEEP:
            v=list(map(float,m.group(4).split()))
            pts=[tuple(round(v[i+k]/10) for k in range(3)) for i in range(0,len(v),3)]  # cm grid
            polys.append((KEEP[t],pts))
    else:
        if m.group(3): continue
        if m.group(1):
            while stack and stack.pop()!=m.group(2): pass
        else: stack.append(m.group(2))
def normal(p):
    nx=ny=nz=0.0
    for i in range(len(p)):
        a,b=p[i],p[(i+1)%len(p)]
        nx+=(a[1]-b[1])*(a[2]+b[2]); ny+=(a[2]-b[2])*(a[0]+b[0]); nz+=(a[0]-b[0])*(a[1]+b[1])
    l=math.sqrt(nx*nx+ny*ny+nz*nz) or 1
    return (nx/l,ny/l,nz/l)
edges=collections.defaultdict(list)
for cat,p in polys:
    if p[0]==p[-1]: p=p[:-1]
    if len(p)<3: continue
    n=normal(p)
    for i in range(len(p)):
        a,b=p[i],p[(i+1)%len(p)]
        if a==b: continue
        k=(min(a,b),max(a,b)); edges[k].append((cat,n))
out=[]
for k,lst in edges.items():
    if len(lst)>=2:
        n0=lst[0][1]
        if all(abs(sum(x*y for x,y in zip(n0,n)))>0.999 for _,n in lst[1:]): continue  # coplanar seam
    (a,b)=k; l=math.dist(a,b)
    if l<4: continue  # drop sub-4cm detail
    out.append((a,b,min(c for c,_ in lst)))
xs=[c for a,b,_ in out for c in (a[0],b[0])];ys=[c for a,b,_ in out for c in (a[1],b[1])];zs=[c for a,b,_ in out for c in (a[2],b[2])]
cx=(min(xs)+max(xs))//2;cy=(min(ys)+max(ys))//2;cz=min(zs)
with open(sys.argv[2],'wb') as f:
    f.write(struct.pack('<I',len(out)))
    for a,b,_ in out: f.write(struct.pack('<6h',a[0]-cx,a[1]-cy,a[2]-cz,b[0]-cx,b[1]-cy,b[2]-cz))
    f.write(bytes(c for *_,c in out))
print(len(polys),'polys ->',len(out),'edges; extent cm',max(xs)-min(xs),max(ys)-min(ys),max(zs)-min(zs))
print(collections.Counter(c for *_,c in out))
