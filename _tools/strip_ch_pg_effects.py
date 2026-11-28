#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从课程根组件中移除 data-ch / data-pg 专属色 effect（一课一色后不再需要）。

- 括号配平定位 useEffect 块，块体含 dataset.ch / dataset.pg 的整块删除，
  连同紧邻其上的「专属色 / 每章」说明注释行。
- AlgorithmCourse 的讲次 effect 改为常驻 'algo'。
- 修五门课 deckKey 错写 'nap' 的复制粘贴笔误。
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src')

KEY_FIX = {  # 文件名 → 正确 deck key（曾错写 'nap'）
    'CpdCourse.tsx': 'cpd', 'NtrCourse.tsx': 'ntr', 'SpmCourse.tsx': 'spm',
    'CvCourse.tsx': 'cv', 'OscdCourse.tsx': 'oscd',
}


def strip_effects(text):
    """删除含 dataset.ch/pg 的 useEffect 块及其前置注释，返回 (新文本, 删除块数)。"""
    lines = text.split('\n')
    out, i, removed = [], 0, 0
    while i < len(lines):
        ln = lines[i]
        stripped = ln.lstrip()
        if stripped.startswith('useEffect(() => {'):
            # 括号配平找块尾
            depth, j = 0, i
            block = []
            while j < len(lines):
                block.append(lines[j])
                depth += lines[j].count('{') - lines[j].count('}')
                if depth == 0 and j > i:
                    break
                j += 1
            body = '\n'.join(block)
            if 'dataset.pg' in body or 'dataset.ch' in body:
                removed += 1
                # 连带删除紧邻的说明注释（含 专属色/每章/data-ch/data-pg 关键词）
                while out and out[-1].lstrip().startswith('//') and \
                        re.search(r'专属色|每章|html\[data-(ch|pg)\]|data-(ch|pg)', out[-1]):
                    out.pop()
                i = j + 1
                continue
            out.extend(block)
            i = j + 1
            continue
        out.append(ln)
        i += 1
    return '\n'.join(out), removed


def process(path):
    with open(path, encoding='utf-8', newline='') as f:
        text = f.read()
    orig = text
    text, n = strip_effects(text)
    name = os.path.basename(path)
    if name == 'AlgorithmCourse.tsx':
        text = text.replace(
            "  // 当前讲次 → html[data-deck]：顶栏 tabs / 进度条 / 侧栏 / h2 编号统一切换讲次主题色\n"
            "  useEffect(() => {\n"
            "    if (currentDeck) document.documentElement.dataset.deck = currentDeck;\n"
            "    else delete document.documentElement.dataset.deck;\n"
            "    return () => {\n"
            "      delete document.documentElement.dataset.deck;\n"
            "    };\n"
            "  }, [currentDeck]);",
            "  // 课程主题色 → html[data-deck='algo']：整课一个主题色，每次路由重新声明"
            "（子页面卸载时可能清掉它）\n"
            "  useEffect(() => {\n"
            "    document.documentElement.dataset.deck = 'algo';\n"
            "    return () => {\n"
            "      delete document.documentElement.dataset.deck;\n"
            "    };\n"
            "  }, [location.pathname]);")
    if name in KEY_FIX:
        key = KEY_FIX[name]
        text = text.replace("dataset.deck = 'nap';", f"dataset.deck = '{key}';")
        text = text.replace("html[data-deck='nap']", f"html[data-deck='{key}']")
    if text != orig:
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(text)
    return n


total = 0
for sub in ('courses', os.path.join('components', 'course')):
    d = os.path.join(SRC, sub)
    for fn in sorted(os.listdir(d)):
        if fn.endswith('.tsx'):
            total += process(os.path.join(d, fn))
print(f'共删除 {total} 个 data-ch/pg effect')
