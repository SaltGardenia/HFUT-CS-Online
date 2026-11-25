# -*- coding: utf-8 -*-
"""为线性代数 / 数据结构 / 数据结构课程设计 / 电路与电子技术基础 选 4 个课程基础色（亮+暗）。"""
import io, re, math, colorsys

s = io.open('src/styles/tokens.css', encoding='utf-8').read()
i2 = s.index("[data-theme='dark']")
light_s, dark_s = s[:i2], s[i2:]

def grab(var, text):
    m = re.search(r'--%s:\s*(#[0-9a-fA-F]{6})' % re.escape(var), text)
    return m.group(1) if m else None

def hex2lab(h):
    def f(c): return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    X = 0.4124*f(r) + 0.3576*f(g) + 0.1805*f(b)
    Y = 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)
    Z = 0.0193*f(r) + 0.1192*f(g) + 0.9505*f(b)
    def g(t): return t ** (1/3) if t > 0.008856 else 7.787 * t + 16/116
    return (116*g(Y)-16, 500*(g(X/0.95047)-g(Y)), 200*(g(Y)-g(Z/1.08883)))

def de(a, b): return math.dist(hex2lab(a), hex2lab(b))

def hue_of(h):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    hh, _, _ = colorsys.rgb_to_hls(r, g, b)
    return hh * 360

def hsl2hex(h, s_, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l, s_)
    return '#%02x%02x%02x' % (round(r*255), round(g*255), round(b*255))

def dhue(a, b):
    d = abs(a - b); return min(d, 360 - d)

COURSE_BASES = ['os','net','pat','ai','sa','phys','ca','math','pd','ncd','nap','hd',
                'mc','nlu','oscd','cpd','ntr','cv','spm','bd','cap','aie','sec','db','se','st','dp','swt','dsd','ip']
CHAPTER_PRE = ['os','net','pat','sa','phys','ca','math','pd','hd','aie','sec','db','se','st']
DECKS = [f'deck{i}' for i in range(1, 9)]

def pools(text):
    hard, soft = set(), set()
    for v in COURSE_BASES:
        c = grab(v, text)
        if c: hard.add(c)
    for v in ('ok','hot','warn','accent','accent-2','purple'):
        c = grab(v, text)
        if c: hard.add(c)
    for v in DECKS + [c + '-att' for c in COURSE_BASES] + [c + '-practice' for c in COURSE_BASES]:
        c = grab(v, text)
        if c: soft.add(c)
    for pre in CHAPTER_PRE:
        for i in range(1, 16):
            c = grab(f'{pre}{i}', text)
            if c: soft.add(c)
    return hard, soft

Lh, Ls = pools(light_s)
Dh, Ds = pools(dark_s)
Lbase = {grab(v, light_s) for v in COURSE_BASES}
Dbase = {grab(v, dark_s) for v in COURSE_BASES}

def score_light(c):
    hard = min(de(c, x) for x in Lh)
    soft = min(de(c, x) for x in Ls)
    hue = min(dhue(hue_of(c), hue_of(x)) for x in Lbase)
    return hard + 0.35*soft + 0.12*min(hue, 60)

def score_dark(c):
    hard = min(de(c, x) for x in Dh)
    soft = min(de(c, x) for x in Ds)
    return hard + 0.35*soft

# 候选：亮色低饱和暗调；暗色同色相提亮
def best_for(hue_target=None, exclude=()):
    res = []
    for h in range(0, 360, 2):
        for s_ in [0.26, 0.32, 0.38, 0.44]:
            for l in [0.30, 0.34, 0.38, 0.42]:
                c = hsl2hex(h, s_, l)
                if any(de(c, e) < 20 for e in exclude): continue
                if min(de(c, x) for x in Lh) < 19: continue
                res.append((score_light(c), c, h))
    res.sort(reverse=True)
    return res

print('light top candidates:')
seen = []
for sc, c, h in best_for():
    if all(dhue(h, hh) > 28 for hh in seen):
        seen.append(h)
        print(f'  {c}  hue={h:3d}  score={sc:.1f}  hard={min(de(c,x) for x in Lh):.1f} soft={min(de(c,x) for x in Ls):.1f}')
    if len(seen) >= 8: break
