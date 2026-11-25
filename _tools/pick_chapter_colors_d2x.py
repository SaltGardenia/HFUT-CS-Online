# -*- coding: utf-8 -*-
"""为大二下 12 门课排章节色：从共享 12 色板里按导航顺序取色，
使 总目录 → 第1章 → … → 第N章 → 练习/附件 的相邻 ΔE76 尽量大（目标 ≥22）。
输出 tokens.css 需要的 --<key><i> 变量与 data-ch 规则（亮/暗两套同序）。"""
import io, json, math, itertools

PAL_L = ['#31708e', '#a05a2c', '#2e7d5b', '#b5485e', '#8f741c', '#4a5aa8',
         '#22767c', '#8a4a2f', '#7d5ba6', '#6b7a2f', '#9c4a72', '#56698f']
PAL_D = ['#74b3d2', '#e0975f', '#7cc9a3', '#ec8ea0', '#d4b95a', '#8f9ce0',
         '#6cc4c9', '#d18f6e', '#b39be0', '#b3c26e', '#d69ab8', '#9db0d6']

PICK = json.load(io.open('_tools/color_pick_d2x_final.json', encoding='utf-8'))


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


# 课程 → (章节数, 序列末端色种类)：'practice' 有在线练习（练习后再到附件），'att' 直接附件
PLAN = {
    'comp': (7, 'practice+att'),
    'co': (9, 'practice+att'),
    'emb': (6, 'practice+att'),
    'ml': (5, 'att'),
    'ste': (6, 'att'),
    'comb': (4, 'att'),
    'cg': (0, 'att'),
    'sma': (0, 'att'),
    'dmt': (0, 'att'),
    'np': (0, 'att'),
    'micro': (0, 'att'),
    'het': (0, 'att'),
}
PRAC_L, PRAC_D = '#8d34c9', '#bf5af2'


def best_order(base, n, tail, pal):
    """从色板里挑 n 个并排序：base→c1、ci→ci+1、cn→tail 的最小 ΔE 最大。"""
    if n == 0:
        return [], de(base, tail)
    best = None
    # 贪心 + 全排列修复代价过高；用「最远起点 + 每步最远」再对相邻不足的做两两交换优化
    def greedy(start):
        seq = [start]
        rest = [c for c in pal if c != start]
        while len(seq) < n and rest:
            nxt = max(rest, key=lambda c: de(seq[-1], c))
            seq.append(nxt)
            rest.remove(nxt)
        return seq

    def score(seq):
        pts = [base] + seq + [tail]
        return min(de(pts[i], pts[i + 1]) for i in range(len(pts) - 1))

    cands = [greedy(c) for c in pal]
    # 局部搜索：交换两位置 / 替换未用色，接受改进
    improved = True
    while improved:
        improved = False
        for cand in cands:
            s0 = score(cand)
            for i in range(n):
                for j in range(i + 1, n):
                    cand[i], cand[j] = cand[j], cand[i]
                    if score(cand) > s0 + 1e-9:
                        improved = True
                        s0 = score(cand)
                    else:
                        cand[i], cand[j] = cand[j], cand[i]
    for cand in cands:
        sc = score(cand)
        if best is None or sc > best[0]:
            best = (sc, list(cand))
    return best[1], best[0]


out = {}
for key, (n, tailkind) in PLAN.items():
    p = PICK[key]
    seq_l, s_l = best_order(p['base_light'], n, p['att_light'], PAL_L)
    # 暗色用与亮色同序的暗色板（同色相变体）
    seq_d = [PAL_D[PAL_L.index(c)] for c in seq_l]
    pts_l = [p['base_light']] + seq_l + [p['att_light']]
    pts_d = [p['base_dark']] + seq_d + [p['att_dark']]
    if 'practice' in tailkind:
        # 练习色插在章节与附件之间：要求 章末→练习、练习→附件 都尽量大
        d_l = min(de(seq_l[-1], PRAC_L), de(PRAC_L, p['att_light']))
        d_d = min(de(seq_d[-1], PRAC_D), de(PRAC_D, p['att_dark']))
    else:
        d_l = de(seq_l[-1], p['att_light']) if seq_l else de(p['base_light'], p['att_light'])
        d_d = de(seq_d[-1], p['att_dark']) if seq_d else de(p['base_dark'], p['att_dark'])
    out[key] = {
        'base': (p['base_light'], p['base_dark']),
        'att': (p['att_light'], p['att_dark']),
        'chapters': list(zip(seq_l, seq_d)),
        'base_to_ch1': round(de(pts_l[0], pts_l[1]), 1) if n else None,
        'ch_adj_min': round(min([de(pts_l[i], pts_l[i + 1]) for i in range(len(pts_l) - 1)]), 1) if n else None,
        'tail_min': round(d_l, 1),
        'tail_min_dark': round(d_d, 1),
    }
    print(f"{key}: base->ch1 {out[key]['base_to_ch1']}  ch 相邻最小 {out[key]['ch_adj_min']}  末端 亮{out[key]['tail_min']}/暗{out[key]['tail_min_dark']}")

# 生成 CSS 片段
lines = []
for key in PLAN:
    o = out[key]
    if o['chapters']:
        l = '  '.join(f'--{key}{i + 1}: {c[0]};' for i, c in enumerate(o['chapters']))
        d = '  '.join(f'--{key}{i + 1}: {c[1]};' for i, c in enumerate(o['chapters']))
        lines.append(f'  /* {key} 章（共享 12 色板，按导航顺序取色） */\n  {l}\n  {d}')
io.open('_tools/d2x_chapter_css.txt', 'w', encoding='utf-8').write('\n'.join(lines))
print('css ->', '_tools/d2x_chapter_css.txt')
