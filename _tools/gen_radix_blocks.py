#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""课程配色：24 色设计色卡（Radix Colors + Tailwind 600 级）→ 每课一色。

59 门课不追求 59 个互异色（清亮 + 互异 + 大量课程三者不可兼得，且旧站本就
允许跨课程复用色）。做法：
  1) 从色卡挑 24 个鲜色（FPS 最远点采样，两两 CIEDE2000 ≥6.5，白底对比
     2.8~5.0 之间：读得清字又不暗沉，近灰的不要）；
  2) 课程按注册序 i → 色卡 (i*7)%24（7 与 24 互质）：相邻课程跨色相，
     同色复用的两课注册序相距 24（不同学期，永不同屏）；
  3) 暗色：每个色卡色取 Radix 同族暗阶中与已选最远者（设计系统为暗底调好）；
  4) 毛概朱红为品牌色锚定，不参与。

用法：python _tools/gen_radix_blocks.py
输出：_tools/course_colors.json + _tools/course_color_blocks.txt（供 apply_course_colors.py）
"""
import json
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

COURSES = [
    ('algo', '算法设计与分析'), ('os', '操作系统'), ('net', '计算机网络'),
    ('pat', '程序设计艺术与方法'), ('ai', '人工智能原理'), ('sa', '软件体系结构'),
    ('phys', '大学物理'), ('ca', '计算机体系结构'), ('math', '高等数学'),
    ('pd', '程序设计基础'), ('ncd', '计算机网络课程设计'), ('nap', '网络攻防实践'),
    ('hd', '系统硬件综合设计'), ('mc', '移动计算与应用开发'), ('nlu', '自然语言理解'),
    ('oscd', '操作系统课程设计'), ('cpd', '编译原理课程设计'), ('ntr', '网络工程师综合实训'),
    ('cv', '计算机视觉与深度学习'), ('spm', '软件项目管理'), ('bd', '大数据处理技术'),
    ('cap', '计算机应用项目实训'), ('aie', '人工智能经济学'), ('sec', '信息安全技术'),
    ('db', '数据库系统'), ('se', '软件工程'), ('st', '软件测试'),
    ('dp', '分布式程序设计'), ('swt', '软件工程师综合训练'), ('dsd', '领域方向综合设计'),
    ('ip', '创新实践'), ('py', 'Python程序设计'), ('dm', '离散数学'),
    ('cm', '计算方法'), ('prob', '概率论与数理统计'), ('asm', '汇编语言程序设计'),
    ('eda', 'EDA实训'), ('res', '科研训练'), ('physlab', '大学物理实验'),
    ('java', 'Java技术'), ('dl', '数字逻辑'), ('robot', '机器人技术'),
    ('ds', '数据结构'), ('dscd', '数据结构课程设计'), ('la', '线性代数'),
    ('ee', '电路与电子技术基础'), ('comp', '编译原理'), ('co', '计算机组成原理'),
    ('emb', '嵌入式系统原理'), ('ml', '机器学习'), ('ste', '软件工具与环境'),
    ('comb', '组合数学'), ('cg', '计算机图形学'), ('sma', '软件建模与分析'),
    ('dmt', '数字媒体技术'), ('np', '网络程序设计'), ('micro', '微机原理与接口技术'),
    ('het', '硬件工程师综合训练'), ('maogai', '学习通题库·毛概'),
]

ANCHOR = {'maogai': ('#de2910', '#ec6f5e')}

WHITE = (255, 255, 255)
DARK_PANEL = (0x1e, 0x1e, 0x20)
SEMANTIC = {
    'light': ['#d70015', '#248a3d', '#ad5700'],   # hot / ok / warn
    'dark': ['#ff453a', '#30d158', '#ff9f0a'],
}
MIN_SEM = 6.0        # 与语义色最小 ΔE（quiz 红绿只在选项行内，语境分隔）
MIN_CT_DARK = 3.2    # 暗面板文字可读下限
PALETTE_N = 24       # 色卡容量
MIN_PAIR = 6.5       # 色卡两两最小 ΔE

# Tailwind 600 级（公开常量）与 Radix 族名映射（暗阶取 Radix 同族）
TW600 = {
    'red': '#dc2626', 'orange': '#ea580c', 'amber': '#d97706', 'lime': '#65a30d',
    'green': '#16a34a', 'emerald': '#059669', 'teal': '#0d9488', 'cyan': '#0891b2',
    'sky': '#0284c7', 'blue': '#2563eb', 'indigo': '#4f46e5', 'violet': '#7c3aed',
    'purple': '#9333ea', 'fuchsia': '#c026d3', 'pink': '#db2777', 'rose': '#e11d48',
}
ALIAS = {'emerald': 'green', 'fuchsia': 'plum', 'rose': 'crimson'}


def srgb_to_lab(rgb):
    def inv(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (inv(v) for v in rgb)

    def f(t):
        return t ** (1 / 3) if t > 216 / 24389 else (841 / 108) * t + 4 / 29
    x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b
    y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b
    z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b
    fx, fy, fz = f(x / 0.95047), f(y), f(z / 1.08883)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def hex_to_rgb(hx):
    hx = hx.lstrip('#')
    return tuple(int(hx[i:i + 2], 16) for i in (0, 2, 4))


def rel_lum(rgb):
    def chan(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (chan(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def ciede2000(lab1, lab2):
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    C1 = math.hypot(a1, b1)
    C2 = math.hypot(a2, b2)
    Cb = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7))) if Cb ** 7 else 0
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360 if (a1p or b1) else 0
    h2p = math.degrees(math.atan2(b2, a2p)) % 360 if (a2p or b2) else 0
    dLp = L2 - L1
    dCp = C2p - C1p
    if C1p * C2p == 0:
        dhp = 0
    elif abs(h2p - h1p) <= 180:
        dhp = h2p - h1p
    elif h2p - h1p > 180:
        dhp = h2p - h1p - 360
    else:
        dhp = h2p - h1p + 360
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dhp / 2))
    Lbp = (L1 + L2) / 2
    Cbp = (C1p + C2p) / 2
    if C1p * C2p == 0:
        hbp = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hbp = (h1p + h2p) / 2
    elif h2p - h1p > 180:
        hbp = (h1p + h2p + 360) / 2
    else:
        hbp = (h1p + h2p - 360) / 2
    T = (1 - 0.17 * math.cos(math.radians(hbp - 30)) + 0.24 * math.cos(math.radians(2 * hbp))
         + 0.32 * math.cos(math.radians(3 * hbp + 6)) - 0.20 * math.cos(math.radians(4 * hbp - 63)))
    dtheta = 30 * math.exp(-(((hbp - 275) / 25) ** 2))
    Rc = 2 * math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) if Cbp ** 7 else 0
    Sl = 1 + 0.015 * (Lbp - 50) ** 2 / math.sqrt(20 + (Lbp - 50) ** 2)
    Sc = 1 + 0.045 * Cbp
    Sh = 1 + 0.015 * Cbp * T
    Rt = -math.sin(math.radians(2 * dtheta)) * Rc
    return math.sqrt(
        (dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2
        + Rt * (dCp / Sc) * (dHp / Sh))


def main():
    sem = {k: [srgb_to_lab(hex_to_rgb(s)) for s in SEMANTIC['light' if not d else 'dark']]
           for k, d in (('light', False), ('dark', True))}

    with open(os.path.join(HERE, 'radix_index.mjs'), encoding='utf-8') as f:
        src = f.read()
    blocks = dict(re.findall(r'const (\w+) = \{(.*?)\};', src, re.S))

    def scale(hue, dark):
        name = hue + ('Dark' if dark else '')
        assert name in blocks, f'Radix 缺 {name}'
        return dict(re.findall(r'(\w+): "(#(?:[0-9a-f]{6}))"', blocks[name]))

    FAMS = ['red', 'tomato', 'orange', 'amber', 'yellow', 'lime', 'grass', 'green',
            'jade', 'mint', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'iris',
            'violet', 'purple', 'plum', 'pink', 'crimson', 'ruby', 'gold', 'bronze',
            'brown', 'sand', 'mauve', 'slate', 'sage', 'olive']

    # 候选池：Radix 9/10/11 + Tailwind 600，过滤：对比 2.8~5.0（读得清不暗沉）、
    # 彩度 ≥10（不要近灰）、语义 ≥6
    pool = []
    for fam in FAMS:
        s = scale(fam, False)
        for st in (9, 10, 11):
            hx = s[f'{fam}{st}']
            rgb = hex_to_rgb(hx)
            ct = contrast(rgb, WHITE)
            lab = srgb_to_lab(rgb)
            if not (2.8 <= ct <= 5.0):
                continue
            if math.hypot(*lab[1:]) < 10:
                continue
            if min(ciede2000(lab, x) for x in sem['light']) < MIN_SEM:
                continue
            pool.append({'label': f'{fam}-r{st}', 'fam': fam, 'hex': hx, 'lab': lab, 'ct': ct})
    for fam, hx in TW600.items():
        rgb = hex_to_rgb(hx)
        ct = contrast(rgb, WHITE)
        lab = srgb_to_lab(rgb)
        if not (2.8 <= ct <= 5.0):
            continue
        if math.hypot(*lab[1:]) < 10:
            continue
        if min(ciede2000(lab, x) for x in sem['light']) < MIN_SEM:
            continue
        pool.append({'label': f'{fam}-tw600', 'fam': ALIAS.get(fam, fam), 'hex': hx, 'lab': lab, 'ct': ct})

    # FPS：以毛概朱红为种子挑 24 个互异色
    a_lab = srgb_to_lab(hex_to_rgb(ANCHOR['maogai'][0]))
    pcolor = []
    mind = [ciede2000(p['lab'], a_lab) for p in pool]
    used = set()
    while len(pcolor) < PALETTE_N:
        bi, bd = -1, -1
        for i, p in enumerate(pool):
            if i in used:
                continue
            if mind[i] > bd:
                bi, bd = i, mind[i]
        if bi < 0:
            break
        p = pool[bi]
        pcolor.append(p)
        used.add(bi)
        for i, q in enumerate(pool):
            if i not in used:
                d = ciede2000(q['lab'], p['lab'])
                if d < mind[i]:
                    mind[i] = d
    assert len(pcolor) == PALETTE_N, f'色卡不足 {len(pcolor)}'

    # 暗色：每卡色取 Radix 同族暗阶中与已选最远者
    dark_by_fam = {}
    for fam in {p['fam'] for p in pcolor}:
        s = scale(fam, True)
        cands = []
        for st in range(9, 13):
            hx = s[f'{fam}{st}']
            rgb = hex_to_rgb(hx)
            if contrast(rgb, DARK_PANEL) < MIN_CT_DARK:
                continue
            lab = srgb_to_lab(rgb)
            d = min(ciede2000(lab, x) for x in sem['dark'])
            cands.append({'label': f'{fam}-dark{st}', 'hex': hx, 'lab': lab, 'step': st, 'sem': d})
        dark_by_fam[fam] = cands
    dcolor = []
    for p in pcolor:
        best, bd = None, -1
        for q in dark_by_fam[p['fam']]:
            d = min((ciede2000(q['lab'], c['lab']) for c in dcolor), default=1e9)
            if d > bd:
                best, bd = q, d
        dcolor.append(best)

    # 分配：课程（跳过毛概）按注册序 i → 色卡 (i*7)%24
    maogai_idx = COURSES.index(('maogai', '学习通题库·毛概'))
    course_order = [i for i in range(len(COURSES)) if i != maogai_idx]
    idx_of = {ci: k for k, ci in enumerate(course_order)}
    stride = 7

    out = {}
    for i, (key, name) in enumerate(COURSES):
        if key == 'maogai':
            out[key] = {'name': name, 'light': ANCHOR[key][0], 'dark': ANCHOR[key][1],
                        'label': 'maogai(锚定)', 'palette': -1}
            continue
        k = (idx_of[i] * stride) % PALETTE_N
        lp, dp_ = pcolor[k], dcolor[k]
        out[key] = {'name': name, 'light': lp['hex'], 'dark': dp_['hex'],
                    'label': lp['label'], 'palette': k}
        print(f"{key:<8} 卡{k:<2} {lp['label']:<14} {lp['hex']}  暗阶 {dp_['hex']}"
              f"  白底 {lp['ct']:.2f}  暗板 {contrast(hex_to_rgb(dp_['hex']), DARK_PANEL):.2f}")

    lh, dh = ANCHOR['maogai']
    print(f"maogai   锚定  {'':<14} {lh}  暗阶 {dh}"
          f"  白底 {contrast(hex_to_rgb(lh), WHITE):.2f}（品牌红豁免）")

    def pairwise(items):
        m = 1e9
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                m = min(m, ciede2000(items[i]['lab'], items[j]['lab']))
        return m

    print('')
    print(f'色卡 {PALETTE_N} 色两两 min ΔE {pairwise(pcolor):.1f}；暗色卡 min ΔE {pairwise(dcolor):.1f}')
    print(f'复用的两课注册序相距 {PALETTE_N}（不同学期），相邻课程色相相隔 {stride} 张卡')

    light_lines = [f'  --{k}: {out[k]["light"]};' for k, _ in COURSES]
    dark_lines = [f'  --{k}: {out[k]["dark"]};' for k, _ in COURSES]
    map_lines = [f":root[data-deck='{k}'] {{ --deck-accent: var(--{k}); }}" for k, _ in COURSES]
    nl = chr(10)
    with open(os.path.join(HERE, 'course_color_blocks.txt'), 'w', encoding='utf-8', newline='') as f:
        f.write('=== LIGHT (替换「每讲一色」注释行起至 --het-att 行止，保留 --deck-accent 行) ===' + nl
                + nl.join(light_lines)
                + nl + nl + '=== DARK (替换 --deck1 行起至暗色 --het-att 行止) ===' + nl
                + nl.join(dark_lines)
                + nl + nl + '=== MAP (替换 tokens.css 中「当前讲次 → 主题色」注释起至最后一条 data-pg 规则止) ===' + nl
                + nl.join(map_lines) + nl)

    with open(os.path.join(HERE, 'course_colors.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print('已写 course_colors.json / course_color_blocks.txt')


if __name__ == '__main__':
    main()
