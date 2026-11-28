#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 gen_course_color_blocks.txt 的三个块写入 src/styles/tokens.css（可重复执行）。

区域锚点与已转换过的文件结构对齐：
  LIGHT：起「一课一色：全站 59 门课程主题色（亮色）」注释行，
         止 --deck-accent 行前的空行（不含）。
  DARK ：起「课程主题色（暗色提亮变体」注释行，止 --key-bg 暗色行前的空行（不含）。
  MAP  ：起「一课一色：html[data-deck=课key]」注释行，止毛概映射规则行（含）。
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
TOKENS = os.path.join(HERE, '..', 'src', 'styles', 'tokens.css')
BLOCKS = os.path.join(HERE, 'course_color_blocks.txt')

with open(BLOCKS, encoding='utf-8') as f:
    content = f.read()
m = re.search(r'=== LIGHT.*?===\n(.*?)\n\n=== DARK.*?===\n(.*?)\n\n=== MAP.*?===\n(.*)$',
              content, re.S)
light_block, dark_block, map_block = m.group(1), m.group(2), m.group(3).rstrip('\n')

with open(TOKENS, encoding='utf-8', newline='') as f:
    lines = f.read().split('\n')


def find_line(pred, desc):
    hits = [i for i, ln in enumerate(lines) if pred(ln)]
    assert len(hits) == 1, f'{desc}: 期望唯一锚点，实得 {len(hits)}'
    return hits[0]


l_start = find_line(lambda ln: '一课一色：全站 59 门课程主题色（亮色）' in ln, 'light 起')
da = find_line(lambda ln: ln.strip().startswith('--deck-accent: var(--accent)'), 'deck-accent')
d_start = find_line(lambda ln: '课程主题色（暗色提亮变体' in ln, 'dark 起')
kb = find_line(lambda ln: '--key-bg: rgba(10, 132, 255, 0.14)' in ln, 'dark key-bg')
m_start = find_line(lambda ln: '一课一色：html[data-deck' in ln, 'map 起')
m_end = find_line(lambda ln: ln.strip() == ":root[data-deck='maogai'] { --deck-accent: var(--maogai); }", 'map 止')

assert l_start < da < d_start < kb < m_start < m_end, '区域顺序异常'

light_region = [
    '  /* ---------------- 一课一色：全站 59 门课程主题色（亮色）。',
    '   * 每课所有页面（总目录/章节/练习/附件）共用一个主题色，选色由',
    '   * _tools/pick_course_colors.py 全局重排（色相族×明暗坡道）：白底对比 ≥4.0、',
    '   * OKLCH 明度 0.50~0.67、彩度 ≤0.155（鲜而不刺眼、不压暗）、避开对/错语义色，',
    '   * 同色相近邻在明度或彩度上强拉开。 */',
    light_block,
]
dark_region = [
    '  /* 课程主题色（暗色提亮变体，色相与亮色一一对应，对 #1e1e20 面板对比 ≥4.0，排霓虹角） */',
    dark_block,
]
map_region = [
    '/* ---------------- 一课一色：html[data-deck=课key] → 课程主题色。',
    ' * 章节页/练习页/附件页不再覆盖（旧 data-ch/data-pg 机制已移除）。',
    ' * 每次路由变化课程根组件都会重新声明 data-deck。 */',
    '',
    map_block,
]

new_lines = (
    lines[:l_start] + light_region + lines[da - 1:d_start]
    + dark_region + lines[kb - 1:m_start] + map_region + lines[m_end + 1:]
)

with open(TOKENS, 'w', encoding='utf-8', newline='') as f:
    f.write('\n'.join(new_lines))
print(f'tokens.css 已更新：{len(lines)} 行 → {len(new_lines)} 行')
