# 大三下 12 课主题色精调 v2（快速版）：预计算 minΔE，Top-N 亮色 × 同族暗色配对
import math, colorsys, re

def hex2lab(h):
    def f(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16)/255 for i in (1, 3, 5))
    X = 0.4124*f(r)+0.3576*f(g)+0.1805*f(b); Y = 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); Z = 0.0193*f(r)+0.1192*f(g)+0.9505*f(b)
    def g(t, n=0.95047): return t ** (1/3) if t > 0.008856 else 7.787*t + 16/116
    return (116*g(Y/1.0)-16, 500*(g(X/0.95047)-g(Y/1.0)), 200*(g(Y/1.0)-g(Z/1.08883)))

def de(a, b): return math.dist(hex2lab(a), hex2lab(b))
def lum(h):
    def f(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16)/255 for i in (1, 3, 5))
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def contrast(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb)
    return (hi+0.05)/(lo+0.05)
def hsl2hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l, s)
    return '#%02x%02x%02x' % (round(r*255), round(g*255), round(b*255))
def hue_of(h):
    r, g, b = (int(h[i:i+2], 16)/255 for i in (1, 3, 5)); hh, _, _ = colorsys.rgb_to_hls(r, g, b)
    return hh*360
def hue_dist(a, b):
    d = abs(a-b) % 360
    return min(d, 360-d)

text = open('src/styles/tokens.css', encoding='utf-8').read()
lb = text[:text.index("[data-theme='dark']")]
db = text[text.index("[data-theme='dark']"):]

def grab(v, blk):
    m = re.search(rf'--{v}:\s*(#[0-9a-fA-F]{{6}})', blk)
    return m.group(1).lower() if m else None

BASES = ['os','net','pat','ai','sa','phys','ca','math','pd','ncd','nap','hd','mc','nlu']
SEM = ['ok','hot','warn','accent']
Lsel = {n: grab(n, lb) for n in BASES+SEM}
Dsel = {n: grab(n, db) for n in BASES+SEM}
Lsel = {n: c for n, c in Lsel.items() if c}
Dsel = {n: c for n, c in Dsel.items() if c}

NEW = ['oscd','cpd','ntr','cv','spm','bd','cap','aie','sec','db','se','st']

# 粗网格（h步4 / s步4 / L步3）
gridL, gridD = [], []
for h in range(0, 360, 4):
    for s in [x/100 for x in range(20, 53, 4)]:
        for L in [x/100 for x in range(28, 53, 3)]:
            c = hsl2hex(h, s, L)
            if contrast(c, '#ffffff') >= 4.2:
                gridL.append((c, s, hue_of(c)))
        for L in [x/100 for x in range(58, 79, 3)]:
            c = hsl2hex(h, s, L)
            if contrast(c, '#161617') >= 5.0:
                gridD.append((c, s, hue_of(c)))
print('gridL', len(gridL), 'gridD', len(gridD))

def score(ml, md, sl, sd):
    return min(ml, md) - 8 * max(0, (sl + sd) / 2 - 0.42)

for name in NEW:
    ml_all = [(min(de(c, rc) for rc in Lsel.values()), c, s, h) for c, s, h in gridL]
    md_all = [(min(de(c, rc) for rc in Dsel.values()), c, s, h) for c, s, h in gridD]
    ml_all.sort(reverse=True)
    best = None
    for ml, cl, sl, hl in ml_all[:400]:
        if best is not None and ml + 4 < best[1]:
            break
        for md, cd, sd, hd in md_all:
            if hue_dist(hl, hd) > 24:
                continue
            sc = score(ml, md, sl, sd)
            if best is None or sc > best[0]:
                best = (sc, ml, md, cl, cd, hl)
    sc, ml, md, cl, cd, hl = best
    Lsel[name] = cl
    Dsel[name] = cd
    print(f'{name:5s} hue {hl:3.0f}  light {cl} (minΔE {ml:.1f})  dark {cd} (minΔE {md:.1f})  score {sc:.1f}', flush=True)
