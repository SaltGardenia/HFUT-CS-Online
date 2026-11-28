#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 pick_course_colors.py 的 JSON 生成 tokens.css 三个替换块。

输出 _tools/course_color_blocks.txt，人工核对后由 apply_course_colors.py 写入 tokens.css。
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

# (key, 变量名, 亮色描述)
COURSES = [
    ('algo', '算法设计与分析'), ('os', '操作系统'),
    ('net', '计算机网络'), ('pat', '程序设计艺术与方法'),
    ('ai', '人工智能原理'), ('sa', '软件体系结构'),
    ('phys', '大学物理'), ('ca', '计算机体系结构'),
    ('math', '高等数学'), ('pd', '程序设计基础'),
    ('ncd', '计算机网络课程设计'), ('nap', '网络攻防实践'),
    ('hd', '系统硬件综合设计'), ('mc', '移动计算与应用开发'),
    ('nlu', '自然语言理解'), ('oscd', '操作系统课程设计'),
    ('cpd', '编译原理课程设计'), ('ntr', '网络工程师综合实训'),
    ('cv', '计算机视觉与深度学习'), ('spm', '软件项目管理'),
    ('bd', '大数据处理技术'), ('cap', '计算机应用项目实训'),
    ('aie', '人工智能经济学'), ('sec', '信息安全技术'),
    ('db', '数据库系统'), ('se', '软件工程'),
    ('st', '软件测试'), ('dp', '分布式程序设计'),
    ('swt', '软件工程师综合训练'), ('dsd', '领域方向综合设计'),
    ('ip', '创新实践'), ('py', 'Python程序设计'),
    ('dm', '离散数学'), ('cm', '计算方法'),
    ('prob', '概率论与数理统计'), ('asm', '汇编语言程序设计'),
    ('eda', 'EDA实训'), ('res', '科研训练'),
    ('physlab', '大学物理实验'), ('java', 'Java技术'),
    ('dl', '数字逻辑'), ('robot', '机器人技术'),
    ('ds', '数据结构'), ('dscd', '数据结构课程设计'),
    ('la', '线性代数'), ('ee', '电路与电子技术基础'),
    ('comp', '编译原理'), ('co', '计算机组成原理'),
    ('emb', '嵌入式系统原理'), ('ml', '机器学习'),
    ('ste', '软件工具与环境'), ('comb', '组合数学'),
    ('cg', '计算机图形学'), ('sma', '软件建模与分析'),
    ('dmt', '数字媒体技术'), ('np', '网络程序设计'),
    ('micro', '微机原理与接口技术'), ('het', '硬件工程师综合训练'),
    ('maogai', '学习通题库·毛概'),
]

with open(os.path.join(HERE, 'course_colors.json'), encoding='utf-8') as f:
    colors = json.load(f)

light_lines = []
dark_lines = []
for key, desc in COURSES:
    light_lines.append(f'  --{key}: {colors[key]["light"]};'
                       f'   /* {desc} */')
    dark_lines.append(f'  --{key}: {colors[key]["dark"]};')

light_block = '\n'.join(light_lines)
dark_block = '\n'.join(dark_lines)

map_lines = [f":root[data-deck='{k}'] {{ --deck-accent: var(--{k}); }}" for k, _ in COURSES]
map_block = '\n'.join(map_lines)

out = f'''=== LIGHT (替换「每讲一色」注释行起至 --het-att 行止，保留 --deck-accent 行) ===
{light_block}

=== DARK (替换 --deck1 行起至暗色 --het-att 行止) ===
{dark_block}

=== MAP (替换 tokens.css 中「当前讲次 → 主题色」注释起至最后一条 data-pg 规则止) ===
{map_block}
'''

with open(os.path.join(HERE, 'course_color_blocks.txt'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(out)
print('已写 _tools/course_color_blocks.txt')
