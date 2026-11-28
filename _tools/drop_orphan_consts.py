#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""删除仅被已移除的 data-ch/pg effect 使用的孤儿 const（tsc TS6133 清单）。

每处删除：const 声明行 + 紧邻其上的说明注释行。
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src', 'courses')

# 文件 → 孤儿变量名
ORPHANS = {
    'CaCourse.tsx': ['chIdx'],
    'CourseShell.tsx': ['chNo'],
    'CpdCourse.tsx': ['onAtt'], 'CvCourse.tsx': ['onAtt'], 'DpCourse.tsx': ['onAtt'],
    'DscdCourse.tsx': ['onAtt'], 'DsdCourse.tsx': ['onAtt'], 'IpCourse.tsx': ['onAtt'],
    'McCourse.tsx': ['onAtt'], 'NapCourse.tsx': ['onAtt'], 'NcdCourse.tsx': ['onAtt'],
    'NtrCourse.tsx': ['onAtt'], 'OscdCourse.tsx': ['onAtt'], 'SpmCourse.tsx': ['onAtt'],
    'SwtCourse.tsx': ['onAtt'],
    'HdCourse.tsx': ['unitNo'], 'MathCourse.tsx': ['chIdx'], 'PatCourse.tsx': ['deckNo'],
    'PdCourse.tsx': ['unitNo'], 'PhysCourse.tsx': ['deckNo'], 'SaCourse.tsx': ['unitNo'],
}

for fname, varnames in ORPHANS.items():
    path = os.path.join(SRC, fname)
    with open(path, encoding='utf-8', newline='') as f:
        lines = f.read().split('\n')
    for var in varnames:
        idxs = [i for i, ln in enumerate(lines)
                if ln.lstrip().startswith(f'const {var} =')]
        assert len(idxs) == 1, f'{fname}:{var} 期望唯一声明，实得 {len(idxs)}'
        i = idxs[0]
        del lines[i]
        # 连带紧邻的注释行
        while i > 0 and lines[i - 1].lstrip().startswith('//'):
            del lines[i - 1]
            i -= 1
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write('\n'.join(lines))
    print(f'{fname}: 已删 {varnames}')
