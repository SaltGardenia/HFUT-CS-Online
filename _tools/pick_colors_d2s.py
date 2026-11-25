# -*- coding: utf-8 -*-
"""为「大二上」11 门新课选主题色。
原则与既有体系一致：低饱和、暗而不刺眼；与全站已有课程 base 色尽量拉开（ΔE76），
新课之间色相间隔 ≥ 20°；暗色取同色相提亮版本。色相空间已被 31 门课占满，
阈值按现有事实标准：亮 ≥14（尽力 ≥16），暗 ≥10（尽力 ≥12）。
"""
import io, re, math, colorsys, json

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
    return colorsys.rgb_to_hls(r, g, b)[0] * 360

def hsl2hex(h, s_, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l, s_)
    return '#%02x%02x%02x' % (round(r*255), round(g*255), round(b*255))

def dhue(a, b):
    d = abs(a - b)
    return min(d, 360 - d)

BASE_VARS = ['os','net','pat','ai','sa','phys','ca','math','pd','ncd','nap','hd','mc','nlu','oscd','cpd',
             'ntr','cv','spm','bd','cap','aie','sec','db','se','st','dp','swt','dsd','ip']
EXTRA_HARD = ['accent','accent-2','hot','ok','warn','purple']
POOL_L = [grab(v, light_s) for v in BASE_VARS + EXTRA_HARD + ['deck1','deck2','deck3','deck4','deck5','deck6','deck7','deck8']]
POOL_L = [c for c in POOL_L if c]
POOL_D = [grab(v, dark_s) for v in BASE_VARS + EXTRA_HARD]
POOL_D = [c for c in POOL_D if c]

CAND_L = []
for h in range(0, 360, 2):
    for s_ in (0.26, 0.32, 0.38, 0.44):
        for l in (0.28, 0.32, 0.36, 0.40):
            CAND_L.append(hsl2hex(h, s_, l))

CAND_D = []
for h in range(0, 360, 2):
    for s_ in (0.40, 0.46, 0.52, 0.58):
        for l in (0.62, 0.68, 0.72, 0.76):
            CAND_D.append(hsl2hex(h, s_, l))

NAMES = ['py', 'dm', 'cm', 'prob', 'asm', 'eda', 'res', 'physlab', 'java', 'dl', 'robot']
chosen_l, chosen_d, result = [], [], {}

for name in NAMES:
    best = None
    for min_de, min_hue in ((16.0, 22), (15.0, 20), (14.0, 18), (13.0, 16), (12.0, 14)):
        for c in CAND_L:
            if c in chosen_l:
                continue
            if any(dhue(hue_of(c), hue_of(p)) < min_hue for p in chosen_l):
                continue
            mn = min(de(c, p) for p in POOL_L + chosen_l)
            if mn < min_de:
                continue
            if best is None or mn > best[1]:
                best = (c, mn)
        if best:
            break
    assert best, name
    bl = best[0]
    hint = hue_of(bl)
    bd, bdscore = None, None
    for c in CAND_D:
        if c in chosen_d or dhue(hue_of(c), hint) > 30:
            continue
        mn = min([de(c, p) for p in POOL_D + chosen_d] + [99.0])
        if bd is None or mn > bdscore:
            bd, bdscore = c, mn
    assert bd, name
    result[name] = {'light': bl, 'light_min': round(best[1], 1), 'dark': bd, 'dark_min': round(bdscore, 1)}
    chosen_l.append(bl); chosen_d.append(bd)
    print(f"{name}: light={bl} (min ΔE {best[1]:.1f})  dark={bd} (min ΔE {bdscore:.1f})")

print('\n新课两两（亮）:')
for i, a in enumerate(NAMES):
    print(' ', a, ' '.join(f"{b}:{de(result[a]['light'], result[b]['light']):.1f}" for b in NAMES[i+1:]))
print('\n新课两两（暗）:')
for i, a in enumerate(NAMES):
    print(' ', a, ' '.join(f"{b}:{de(result[a]['dark'], result[b]['dark']):.1f}" for b in NAMES[i+1:]))

io.open('_tools/color_pick_d2s.json', 'w', encoding='utf-8').write(json.dumps(result, ensure_ascii=False, indent=1))
