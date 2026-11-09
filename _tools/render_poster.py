"""Render a static isometric poster (fallback for no-WebGL) from the twin .bin.
Usage: python3 _tools/render_poster.py assets/twin/smartcity-lab.bin assets/twin/poster.webp"""
import struct, math, sys
from PIL import Image, ImageDraw
d = open(sys.argv[1], 'rb').read(); n = struct.unpack_from('<I', d)[0]
seg = struct.unpack_from('<%dh' % (6 * n), d, 4); cat = d[4 + 12 * n:]
S = 2; W, Hh = 1000 * S, 720 * S
img = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); dr = ImageDraw.Draw(img)
a = math.radians(40)
col = [(90, 180, 255, 110), (255, 180, 80, 150), (120, 255, 205, 120), (90, 150, 255, 55)]
def proj(x, y, z):
    X = x * math.cos(a) - y * math.sin(a); Y = x * math.sin(a) + y * math.cos(a)
    return X, -z + Y * 0.39
# fit the building (not the site) into ~70% of the width
pts = [proj(*seg[6 * i + k:6 * i + k + 3]) for i in range(n) if cat[i] != 3 for k in (0, 3)]
span = max(p[0] for p in pts) - min(p[0] for p in pts)
sc = W * 0.70 / span
oy = Hh * 0.62 - sc * (max(p[1] for p in pts) + min(p[1] for p in pts)) / 2
def P(x, y, z):
    X, Y = proj(x, y, z); return (W / 2 + X * sc, oy + Y * sc)
R = int(span * 0.6 / 100) // 5 * 5 + 5
for g in range(-R, R + 1, 1 if R < 30 else 2):  # ground grid (1 m or 2 m)
    for (p, q) in (((g * 100, -R * 100, 0), (g * 100, R * 100, 0)), ((-R * 100, g * 100, 0), (R * 100, g * 100, 0))):
        dr.line([P(*p), P(*q)], fill=(60, 120, 230, 60 if g % 10 == 0 else 22), width=S)
for i in sorted(range(n), key=lambda i: cat[i] != 3):
    s = seg[6 * i:6 * i + 6]; dr.line([P(*s[:3]), P(*s[3:])], fill=col[min(cat[i], 3)], width=S)
img = img.resize((W // S, Hh // S), Image.LANCZOS)
img.save(sys.argv[2], quality=60, method=6) if sys.argv[2].endswith('.webp') else img.save(sys.argv[2], optimize=True)
