#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一课一色：为全站 59 门课程重排主题色（亮 / 暗两套）。

约束（亮色）：
  - 白底对比 ≥ 4.5（--deck-accent 大量用作正文小字色）
  - OKLCH 彩度 ≤ 0.115（低饱和不刺眼）、明度 ≤ 0.62
  - 课与课两两 CIEDE2000 尽量大（硬下限 11）
  - 与语义色 hot/ok/warn 拉开 ≥ 9（练习页对/错红绿不被主题色混淆）
暗色：
  - 对 #1e1e20 面板对比 ≥ 4.5
  - 明度 ≥ 0.70、彩度 ≤ 0.13
  - 两两距离同亮色，且色相须落在对应亮色 ±14° 内（同一课跨主题不跳色相）
毛概朱红为品牌色，固定不参与重排（#de2910 / #ec6f5e）。

用法：python _tools/pick_course_colors.py
输出：_tools/course_colors.json + 每课十六进制与最终 min ΔE 摘要。
"""

import json
import math
import os
import sys

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
MIN_SEM = 9.5
HUE_WINDOW = 14.0

# ---------------------------------------------------------------- 色彩数学（同 pick_colors3.py 家族）

def oklch_to_srgb(h, l, c):
    rad = math.radians(h)
    a, b = c * math.cos(rad), c * math.sin(rad)
    l_ = l + 0.3963377774 * a + 0.2158037573 * b
    m_ = l - 0.1055613458 * a - 0.0638541728 * b
    s_ = l - 0.0894841775 * a - 1.2914855480 * b
    l3, m3, s3 = l_ ** 3, m_ ** 3, s_ ** 3
    r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
    g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
    bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3
    if min(r, g, bl) < -0.002 or max(r, g, bl) > 1.002:
        return None

    def gamma(x):
        x = max(0.0, min(1.0, x))
        return 12.92 * x if x <= 0.0031308 else 1.055 * (x ** (1 / 2.4)) - 0.055
    return tuple(round(255 * gamma(v)) for v in (r, g, bl))


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


def rgb_to_hex(rgb):
    return '#%02x%02x%02x' % rgb


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


# ---------------------------------------------------------------- 选色

def build_pool(light):
    """OKLCH 网格 → 过滤色域 / 对比度，返回 [(hex, lab, hue, L, C)]。"""
    if light:
        l_steps = [0.40 + 0.015 * i for i in range(15)]     # 0.400..0.610
        c_steps = [0.065 + 0.01 * i for i in range(7)]      # 0.065..0.125
        bg = WHITE
    else:
        l_steps = [0.70 + 0.02 * i for i in range(9)]       # 0.70..0.86
        c_steps = [0.07 + 0.01 * i for i in range(8)]       # 0.07..0.14
        bg = DARK_PANEL
    pool = []
    for h in range(0, 360, 2):
        for L in l_steps:
            for C in c_steps:
                rgb = oklch_to_srgb(h, L, C)
                if rgb is None or contrast(rgb, bg) < 4.5:
                    continue
                pool.append((rgb_to_hex(rgb), srgb_to_lab(rgb), h, L, C))
    return pool


def fps(pool, k, seeds, sem_labs):
    """惰性更新最远点采样；语义色作为虚拟已选点参与距离，天然避开。"""
    chosen = list(seeds)

    def dist_to_chosen(lab):
        m = min((ciede2000(lab, s[1]) for s in chosen), default=1e9)
        return min(m, min(ciede2000(lab, s) for s in sem_labs))

    mind = [dist_to_chosen(p[1]) for p in pool]
    used = {s[0] for s in chosen}
    while len(chosen) < k:
        best_i, best_d = -1, -1
        for i, p in enumerate(pool):
            if p[0] in used:
                continue
            if mind[i] > best_d:
                best_i, best_d = i, mind[i]
        if best_i < 0:
            break
        p = pool[best_i]
        chosen.append(p)
        used.add(p[0])
        for i, q in enumerate(pool):
            if q[0] in used:
                continue
            d = ciede2000(q[1], p[1])
            if d < mind[i]:
                mind[i] = d
    return chosen


def refine(chosen, pool, fixed_flags, sem_labs, rounds=8):
    """局部爬山：每点在 OKLCH 邻域内找能抬高自身最小距离的替换（含语义色距离）。"""
    def own_min_of(cand, idx):
        m = min(ciede2000(cand[1], o[1]) for i, o in enumerate(chosen) if i != idx)
        return min(m, min(ciede2000(cand[1], s) for s in sem_labs))

    for _ in range(rounds):
        moved = False
        for idx in range(len(chosen)):
            if fixed_flags[idx]:
                continue
            cur = own_min_of(chosen[idx], idx)
            h0, L0, C0 = chosen[idx][2], chosen[idx][3], chosen[idx][4]
            best, best_d = chosen[idx], cur
            for p in pool:
                if p[0] == chosen[idx][0] or abs((p[2] - h0 + 180) % 360 - 180) > 30 \
                        or abs(p[3] - L0) > 0.10 or abs(p[4] - C0) > 0.05:
                    continue
                d = own_min_of(p, idx)
                if d > best_d + 1e-4:
                    best, best_d = p, d
            if best is not chosen[idx]:
                chosen[idx] = best
                moved = True
        if not moved:
            break
    return chosen


def main():
    light_pool = build_pool(True)
    dark_pool = build_pool(False)
    print(f'候选池：亮 {len(light_pool)} / 暗 {len(dark_pool)}', file=sys.stderr)

    keys = [k for k, _ in COURSES]
    anchor_l = hex_to_rgb(ANCHOR['maogai'][0])
    anchor_d = hex_to_rgb(ANCHOR['maogai'][1])

    sem_l = [srgb_to_lab(hex_to_rgb(s)) for s in SEMANTIC['light']]
    sem_d = [srgb_to_lab(hex_to_rgb(s)) for s in SEMANTIC['dark']]
    light_sel = fps(light_pool, len(keys),
                    [(rgb_to_hex(anchor_l), srgb_to_lab(anchor_l), None, 0, 0)], sem_l)
    # fps 返回 [种子, 其余逐个选取]；种子须对位到毛概的课程序号
    picks = iter(light_sel[1:])
    anchor = light_sel[0]
    light_sel = [anchor if k == 'maogai' else next(picks) for k in keys]
    light_sel = refine(light_sel, light_pool, [k == 'maogai' for k in keys], sem_l)
    labs_l = [x[1] for x in light_sel]

    # 暗色：先按各课亮色色相切窗口，惰性 FPS 全局选，再爬山
    l_hues = []
    for hx, lab, hue, L, C in light_sel:
        if hue is None:  # 锚定项无 OKLCH 色相，用 Lab 反推
            _, a_, b_ = lab
            hue = math.degrees(math.atan2(b_, a_)) % 360
        l_hues.append(hue)
    wins = [[i for i, p in enumerate(dark_pool)
             if abs((p[2] - lh + 180) % 360 - 180) <= HUE_WINDOW]
            for lh in l_hues]

    dark_sel = [None] * len(keys)
    seeds = [(rgb_to_hex(anchor_d), srgb_to_lab(anchor_d), None, 0, 0)]
    # 语义色一次性烘进初始最小距离（mind 只减不增，后续更新无需重算语义项）
    mind = [min(min((ciede2000(p[1], s[1]) for s in seeds), default=1e9),
                min(ciede2000(p[1], s) for s in sem_d)) for p in dark_pool]
    taken = {seeds[0][0]}
    dark_sel[keys.index('maogai')] = seeds[0]
    for idx in range(len(keys)):
        if dark_sel[idx] is not None:
            continue
        best_i, best_d = -1, -1
        for i in wins[idx]:
            if dark_pool[i][0] in taken:
                continue
            if mind[i] > best_d:
                best_i, best_d = i, mind[i]
        p = dark_pool[best_i]
        taken.add(p[0])
        dark_sel[idx] = p
        for i, q in enumerate(dark_pool):
            if q[0] not in taken:
                dd = ciede2000(q[1], p[1])
                if dd < mind[i]:
                    mind[i] = dd
    dark_list = refine(dark_sel, dark_pool, [k == 'maogai' for k in keys], sem_d)
    labs_d = [x[1] for x in dark_list]

    def pairwise_min(labs):
        m = 1e9
        for i in range(len(labs)):
            for j in range(i + 1, len(labs)):
                m = min(m, ciede2000(labs[i], labs[j]))
        return m

    print(f'亮色两两 min ΔE {pairwise_min(labs_l):.1f}；暗色 {pairwise_min(labs_d):.1f}', file=sys.stderr)

    out = {}
    bad = 0
    for idx, (key, name) in enumerate(COURSES):
        lh, dh = light_sel[idx][0], dark_list[idx][0]
        cl = contrast(hex_to_rgb(lh), WHITE)
        cd = contrast(hex_to_rgb(dh), DARK_PANEL)
        sl = min(ciede2000(labs_l[idx], s) for s in sem_l)
        sd = min(ciede2000(labs_d[idx], s) for s in sem_d)
        ok = cl >= 4.5 and cd >= 4.5 and sl >= MIN_SEM and sd >= MIN_SEM
        bad += 0 if ok else 1
        out[key] = {'name': name, 'light': lh, 'dark': dh,
                    'contrast_light': round(cl, 2), 'contrast_dark': round(cd, 2),
                    'sem_light': round(sl, 1), 'sem_dark': round(sd, 1)}
        print(f'{key:<8} {lh}  {dh}   白底 {cl:.2f}  暗板 {cd:.2f}  语义距 {sl:.1f}/{sd:.1f}'
              + ('' if ok else '  <-- 检查'))

    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, 'course_colors.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f'完成，异常 {bad} 项；已写 _tools/course_colors.json', file=sys.stderr)


if __name__ == '__main__':
    main()
