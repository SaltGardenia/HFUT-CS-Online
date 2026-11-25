# -*- coding: utf-8 -*-
"""选色（大二下 12 门课）：comp/co/emb/ml/ste/cm/cg/sma/dmt/np/micro/het。
31 门课已上线，全站色相高度饱和；沿用大四批次的阈值事实标准并逐级回退：
- 亮 base：对既有课程 base+语义色 ΔE76 ≥18（回退 16/14）；对 deck/章色/att/practice 软池 ≥12（回退 10）；
- 暗 base：同色相（±40°）提亮，对暗硬池 ≥14（回退 12/10）、对软池 ≥8；
- 新课互相：亮 ≥12、暗 ≥10、色相间隔 ≥18°；
- att：亮对硬池 ≥16（回退 14/12）、暗 ≥12（回退 10）。
目标 = 各项最小值最大化，逐门贪心。"""
import io, re, math, json, colorsys

s = io.open('src/styles/tokens.css', encoding='utf-8').read()
i2 = s.index("[data-theme='dark']")
light_s, dark_s = s[:i2], s[i2:]


def grab(var, text):
    m = re.search(r'--%s:\s*(#[0-9a-fA-F]{6})' % re.escape(var), text)
    return m.group(1) if m else None


def hex2lab(h):
    def f(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    X = 0.4124 * f(r) + 0.3576 * f(g) + 0.1805 * f(b)
    Y = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    Z = 0.0193 * f(r) + 0.1192 * f(g) + 0.9505 * f(b)

    def g(t):
        return t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    return (116 * g(Y) - 16, 500 * (g(X / 0.95047) - g(Y)), 200 * (g(Y) - g(Z / 1.08883)))


def de(a, b):
    return math.dist(hex2lab(a), hex2lab(b))


def hue_of(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    hh, _, _ = colorsys.rgb_to_hls(r, g, b)
    return hh * 360


def hsl2hex(h, s_, l):
    r, g, b = colorsys.hls_to_rgb(h / 360, l, s_)
    return '#%02x%02x%02x' % (round(r * 255), round(g * 255), round(b * 255))


def dhue(a, b):
    d = abs(a - b)
    return min(d, 360 - d)


def candidates(mode):
    out = set()
    if mode == 'light':
        for h in range(0, 360, 2):
            for s_ in [0.26, 0.32, 0.38, 0.44, 0.50]:
                for l in [0.26, 0.30, 0.34, 0.38, 0.42]:
                    out.add(hsl2hex(h, s_, l))
    else:
        for h in range(0, 360, 2):
            for s_ in [0.40, 0.46, 0.52, 0.58, 0.64]:
                for l in [0.62, 0.66, 0.70, 0.74, 0.78]:
                    out.add(hsl2hex(h, s_, l))
    return out


EXIST_BASES = ['os', 'net', 'pat', 'ai', 'sa', 'phys', 'ca', 'math', 'pd', 'ncd', 'nap', 'hd',
               'mc', 'nlu', 'oscd', 'cpd', 'ntr', 'cv', 'spm', 'bd', 'cap', 'aie', 'sec', 'db',
               'se', 'st', 'dp', 'swt', 'dsd', 'ip',
               # 并行批次（大二上 11 门 + 大一 4 门）已在工作区落地，一并计入硬池
               'py', 'dm', 'cm', 'prob', 'asm', 'eda', 'res', 'physlab', 'java', 'dl', 'robot',
               'ds', 'dscd', 'la', 'ee']
DECKS = [f'deck{i}' for i in range(1, 9)]
CHAPTER_PRE = ['os', 'net', 'pat', 'sa', 'phys', 'ca', 'math', 'pd', 'hd', 'aie', 'sec', 'db',
               'se', 'st']


def pools(text):
    hard, soft = set(), set()
    for v in EXIST_BASES:
        c = grab(v, text)
        if c:
            hard.add(c)
    for v in ('ok', 'hot', 'warn', 'accent', 'accent-2', 'purple'):
        c = grab(v, text)
        if c:
            hard.add(c)
    for v in DECKS + [c + '-att' for c in EXIST_BASES]:
        c = grab(v, text)
        if c:
            soft.add(c)
    for pre in CHAPTER_PRE:
        for i in range(1, 16):
            c = grab(f'{pre}{i}', text)
            if c:
                soft.add(c)
    for c in EXIST_BASES + ['deck']:
        v = grab(c + '-practice', text)
        if v:
            soft.add(v)
    return hard, soft


HARD_L, SOFT_L = pools(light_s)
HARD_D, SOFT_D = pools(dark_s)
CAND_L = candidates('light')
CAND_D = candidates('dark')


def best_dark(hint, taken_d, mn_min, soft_min):
    dd, dc = None, None
    for x in CAND_D:
        if x in taken_d or dhue(hue_of(x), hint) > 40:
            continue
        mn_x = min(de(x, p) for p in HARD_D | taken_d)
        if mn_x < mn_min:
            continue
        if min([de(x, p) for p in SOFT_D] + [99.0]) < soft_min:
            continue
        if dd is None or mn_x > dd:
            dd, dc = mn_x, x
    return dd, dc


def joint_pick(taken_l, taken_d, hue_sep=12, l_mins=(14.0, 12.0, 10.0), d_mins=(10.0, 9.0, 8.0)):
    for ml in l_mins:
        for md in d_mins:
            best = None
            for c in CAND_L:
                if c in taken_l:
                    continue
                if any(dhue(hue_of(c), hue_of(p)) < hue_sep for p in taken_l):
                    continue
                mn_l = min(de(c, p) for p in HARD_L | taken_l)
                if mn_l < ml:
                    continue
                if min([de(c, p) for p in SOFT_L] + [99.0]) < 8.0:
                    continue
                dd, dc = best_dark(hue_of(c), taken_d, md, 6.0)
                if dc is None:
                    continue
                score = (min(mn_l, dd), mn_l, dd)
                if best is None or score > best[0]:
                    best = (score, c, dc, mn_l, dd)
            if best:
                return best
    return None


def light_pick(taken, extra, mins=(14.0, 12.0, 10.0)):
    for m in mins:
        best = None
        for c in CAND_L:
            if c in taken:
                continue
            mn = min(de(c, p) for p in HARD_L | taken | extra)
            if mn < m:
                continue
            if min([de(c, p) for p in SOFT_L] + [99.0]) < 8.0:
                continue
            if best is None or mn > best[0]:
                best = (mn, c)
        if best:
            return best
    return None


def dark_pick(taken, extra, hint, mins=(10.0, 9.0, 8.0)):
    for m in mins:
        dd, dc = best_dark(hint, taken, m, 6.0)
        if dc is not None:
            return min(de(dc, p) for p in HARD_D | taken | extra), dc
    return None


NAMES = ['comp', 'co', 'emb', 'ml', 'ste', 'comb', 'cg', 'sma', 'dmt', 'np', 'micro', 'het']
result = {}
chosen_l, chosen_d = [], []
for name in NAMES:
    b = joint_pick(set(chosen_l), set(chosen_d))
    assert b, f'{name} base 无解'
    result[name] = {'base_light': b[1], 'base_light_hard': round(b[3], 1),
                    'base_dark': b[2], 'base_dark_hard': round(b[4], 1)}
    chosen_l.append(b[1])
    chosen_d.append(b[2])
    print(f'{name}: base_l={b[1]} (hard {b[3]:.1f})  base_d={b[2]} (hard {b[4]:.1f})')

for name in NAMES:
    bl = light_pick(set(chosen_l), {result[name]['base_light']})
    assert bl, f'{name} att light 无解'
    result[name]['att_light'] = bl[1]
    result[name]['att_light_hard'] = round(bl[0], 1)
    bd = dark_pick(set(chosen_d), {result[name]['base_dark']}, hue_of(bl[1]))
    assert bd, f'{name} att dark 无解'
    result[name]['att_dark'] = bd[1]
    result[name]['att_dark_hard'] = round(bd[0], 1)
    chosen_l.append(bl[1])
    chosen_d.append(bd[1])
    print(f'{name}: att_l={bl[1]} (hard {bl[0]:.1f})  att_d={bd[1]} (hard {bd[0]:.1f})')

print('新课互相（亮）最小:', min(round(de(result[a]['base_light'], result[b]['base_light']), 1)
                                for i, a in enumerate(NAMES) for b in NAMES[i + 1:]))
print('新课互相（暗）最小:', min(round(de(result[a]['base_dark'], result[b]['base_dark']), 1)
                                for i, a in enumerate(NAMES) for b in NAMES[i + 1:]))
print(json.dumps(result, ensure_ascii=False, indent=1))
io.open('_tools/color_pick_d2x.json', 'w', encoding='utf-8').write(
    json.dumps(result, ensure_ascii=False, indent=1))
