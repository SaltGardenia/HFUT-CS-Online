#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 gen_course_color_blocks.txt 的三个块写入 src/styles/tokens.css。

区域（按内容锚点定位，与行号无关）：
  LIGHT：起「/* 每讲一色：讲次 tabs */」注释行，止「--het-att: #71874f;」行（含），
         其后保留空行与 --deck-accent 行。
  DARK ：起「--deck1: #0a84ff;」行，止「--het-att: #b2e4aa;」行（含）。
  MAP  ：起「当前讲次 → 主题色」整行注释，止最后一条 data-pg 映射规则行（含）。
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


def line_eq(s):
    return lambda ln: ln.strip() == s


# LIGHT 区域
l_start = find_line(lambda ln: ln.strip().startswith('/* 每讲一色：讲次 tabs'), 'light 起')
l_end = find_line(line_eq('--het-att: #71874f;'), 'light 止')
# DARK 区域
d_start = find_line(line_eq('--deck1: #0a84ff;'), 'dark 起')
d_end = find_line(line_eq('--het-att: #b2e4aa;'), 'dark 止')
# MAP 区域
m_start = find_line(lambda ln: '当前讲次 → 主题色' in ln, 'map 起')
m_end = find_line(line_eq(":root[data-deck='ee'][data-pg='att'] { --deck-accent: var(--ee-att); }"), 'map 止')

assert l_start < l_end < d_start < d_end < m_start < m_end, '区域顺序异常'

new_header_light = [
    '  /* ---------------- 一课一色：全站 59 门课程主题色（亮色）。',
    '   * 每课所有页面（总目录/章节/练习/附件）共用一个主题色，选色由',
    '   * _tools/pick_course_colors.py 全局重排：白底对比 ≥4.5、OKLCH 彩度',
    '   * ≤0.125（低饱和不刺眼）、课间两两 CIEDE2000 ≥8.8、避开对/错语义色。 */',
]
new_header_dark = [
    '  /* 课程主题色（暗色提亮变体，色相与亮色一一对应，对 #1e1e20 面板对比 ≥4.5） */',
]
new_header_map = [
    '/* ---------------- 一课一色：html[data-deck=课key] → 课程主题色。',
    ' * 章节页/练习页/附件页不再覆盖（旧 data-ch/data-pg 机制已移除）。',
    ' * 每次路由变化课程根组件都会重新声明 data-deck。 */',
]

light_region = new_header_light + [light_block]
dark_region = new_header_dark + [dark_block]
map_region = new_header_map + ['', map_block]

new_lines = (
    lines[:l_start] + light_region + lines[l_end + 1:d_start]
    + dark_region + lines[d_end + 1:m_start] + map_region + lines[m_end + 1:]
)

with open(TOKENS, 'w', encoding='utf-8', newline='') as f:
    f.write('\n'.join(new_lines))
print(f'tokens.css 已更新：{len(lines)} 行 → {len(new_lines)} 行')
