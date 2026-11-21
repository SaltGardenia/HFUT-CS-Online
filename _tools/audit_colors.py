# -*- coding: utf-8 -*-
"""导航主题色审计：按导航顺序解析每课颜色序列（亮/暗），报告精确重复与相邻过近（ΔE76）。"""
import io, re, json

s = io.open('src/styles/tokens.css', encoding='utf-8').read()

def grab(var, text):
    m = re.search(r'--%s:\s*(#[0-9a-fA-F]{6})' % re.escape(var), text)
    return m.group(1) if m else None

# 分出 light / dark 两段：dark 主块在 [data-theme='dark']（行 135），仅取该块到下一个顶层选择器
i2 = s.index("[data-theme='dark']")
light = s[:i2]
dark = s[i2:]

def hex2lab(h):
    def f(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    X = 0.4124*f(r) + 0.3576*f(g) + 0.1805*f(b)
    Y = 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)
    Z = 0.0193*f(r) + 0.1192*f(g) + 0.9505*f(b)
    def g(t, n=0.95047): return t ** (1/3) if t > 0.008856 else 7.787 * t + 16/116
    return (116*g(Y/1.0)-16, 500*(g(X/0.95047)-g(Y/1.0)), 200*(g(Y/1.0)-g(Z/1.08883)))

import math
def de(a, b): return math.dist(hex2lab(a), hex2lab(b))

# 课程 → (基础色 var, 章节色 var 前缀, 章节数, 是否有练习/附件)
COURSES = {
    'algo': (None, 'deck', 8, ('practice',)),
    'os':   ('os', 'os', 8, ('practice', 'att')),
    'net':  ('net', 'net', 7, ('practice', 'att')),
    'pat':  ('pat', 'pat', 6, ('practice', 'att')),
    'ai':   ('ai', None, 0, ('practice', 'att')),
    'sa':   ('sa', 'sa', 4, ('att',)),
    'phys': ('phys', 'phys', 12, ('practice', 'att')),
    'ca':   ('ca', 'ca', 14, ('practice', 'att')),
    'math': ('math', 'math', 6, ('practice', 'att')),
    'pd':   ('pd', 'pd', 11, ('att',)),
    'ncd':  ('ncd', None, 0, ('att',)),
    'nap':  ('nap', None, 0, ('att',)),
    'hd':   ('hd', 'hd', 4, ('att',)),
    'mc':   ('mc', None, 0, ('att',)),
    'nlu':  ('nlu', None, 0, ('att',)),
    'oscd': ('oscd', None, 0, ('att',)),
    'cpd':  ('cpd', None, 0, ('att',)),
    'ntr':  ('ntr', None, 0, ('att',)),
    'cv':   ('cv', None, 0, ('att',)),
    'spm':  ('spm', None, 0, ('att',)),
    'bd':   ('bd', None, 0, ('att',)),
    'cap':  ('cap', None, 0, ('att',)),
    'aie':  ('aie', 'aie', 8, ('att',)),
    'sec':  ('sec', 'sec', 6, ('att',)),
    'db':   ('db', 'db', 12, ('practice', 'att')),
    'se':   ('se', 'se', 14, ('practice', 'att')),
    'st':   ('st', 'st', 11, ('practice', 'att')),
    'dp':   ('dp', None, 0, ('att',)),
    'swt':  ('swt', None, 0, ('att',)),
    'dsd':  ('dsd', None, 0, ('att',)),
    'ip':   ('ip', None, 0, ('att',)),
}

report = {}
for name, (base, pre, n, extra) in COURSES.items():
    for mode, text in (('light', light), ('dark', dark)):
        seq = []
        home = grab(base, text) if base else grab('accent', text)
        seq.append(('总目录', home))
        if pre:
            seq += [(f'{pre}{i}'.upper(), grab(f'{pre}{i}', text)) for i in range(1, n + 1)]
        else:
            seq += [(f'DECK{i}', grab(f'deck{i}', text)) for i in range(1, n + 1)]
        # 练习/附件页优先取真实专属色（--<课>-practice / --<课>-att），无定义时回落课程基础色
        for kind in ('practice', 'att'):
            if kind in extra:
                real = grab(f'{base}-{kind}', text) if base else grab(f'deck-{kind}', text)
                seq.append(('练习' if kind == 'practice' else '附件', real or home))
        # 审计
        dups = []
        seen = {}
        for label, c in seq:
            seen.setdefault(c, []).append(label)
        for c, labels in seen.items():
            if len(labels) > 1:
                dups.append((c, labels))
        adj = []
        for i in range(len(seq) - 1):
            d = de(seq[i][1], seq[i+1][1])
            if d < 22:
                adj.append((seq[i][0], seq[i+1][0], round(d, 1)))
        report[f'{name}/{mode}'] = {'dups': dups, 'adj': adj}

for k, v in report.items():
    flags = []
    if v['dups']: flags.append('重复:' + ';'.join(f"{c}×{','.join(ls)}" for c, ls in v['dups']))
    if v['adj']: flags.append('相邻<' + str(22) + ': ' + ';'.join(f"{a}~{b}({d})" for a, b, d in v['adj']))
    print(k, '=>', ' | '.join(flags) if flags else 'OK')
io.open('_tools/color_audit.json', 'w', encoding='utf-8').write(json.dumps(report, ensure_ascii=False, indent=1))
