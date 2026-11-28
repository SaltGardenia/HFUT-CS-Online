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
    ('algo', '算法设计与分析 · 海蓝'), ('os', '操作系统 · 梅紫'),
    ('net', '计算机网络 · 暗橄榄'), ('pat', '程序设计艺术与方法 · 深青'),
    ('ai', '人工智能原理 · 亮紫'), ('sa', '软件体系结构 · 灰玫瑰'),
    ('phys', '大学物理 · 暗褐'), ('ca', '计算机体系结构 · 青蓝'),
    ('math', '高等数学 · 暗金'), ('pd', '程序设计基础 · 深绿'),
    ('ncd', '计算机网络课程设计 · 蓝紫灰'), ('nap', '网络攻防实践 · 青绿'),
    ('hd', '系统硬件综合设计 · 橄榄灰'), ('mc', '移动计算与应用开发 · 绯红'),
    ('nlu', '自然语言理解 · 藕紫'), ('oscd', '操作系统课程设计 · 褐橙'),
    ('cpd', '编译原理课程设计 · 钢蓝'), ('ntr', '网络工程师综合实训 · 卡其'),
    ('cv', '计算机视觉与深度学习 · 陶红'), ('spm', '软件项目管理 · 深青蓝'),
    ('bd', '大数据处理技术 · 紫'), ('cap', '计算机应用项目实训 · 灰绿'),
    ('aie', '人工智能经济学 · 苔绿'), ('sec', '信息安全技术 · 赭橙'),
    ('db', '数据库系统 · 暗酒红'), ('se', '软件工程 · 蓝紫'),
    ('st', '软件测试 · 灰紫'), ('dp', '分布式程序设计 · 暗金'),
    ('swt', '软件工程师综合训练 · 砖红'), ('dsd', '领域方向综合设计 · 橄榄黄'),
    ('ip', '创新实践 · 橄榄'), ('py', 'Python程序设计 · 海蓝'),
    ('dm', '离散数学 · 陶红'), ('cm', '计算方法 · 青'),
    ('prob', '概率论与数理统计 · 莓红'), ('asm', '汇编语言程序设计 · 赭金'),
    ('eda', 'EDA实训 · 褐'), ('res', '科研训练 · 梅紫'),
    ('physlab', '大学物理实验 · 蓝紫灰'), ('java', 'Java技术 · 靛蓝'),
    ('dl', '数字逻辑 · 暗紫'), ('robot', '机器人技术 · 紫蓝'),
    ('ds', '数据结构 · 深绿'), ('dscd', '数据结构课程设计 · 陶褐'),
    ('la', '线性代数 · 草绿'), ('ee', '电路与电子技术基础 · 深褐'),
    ('comp', '编译原理 · 橄榄绿'), ('co', '计算机组成原理 · 松绿'),
    ('emb', '嵌入式系统原理 · 卡其'), ('ml', '机器学习 · 青蓝'),
    ('ste', '软件工具与环境 · 紫红'), ('comb', '组合数学 · 酒红紫'),
    ('cg', '计算机图形学 · 青绿'), ('sma', '软件建模与分析 · 灰绿'),
    ('dmt', '数字媒体技术 · 陶橙'), ('np', '网络程序设计 · 灰蓝'),
    ('micro', '微机原理与接口技术 · 灰紫'), ('het', '硬件工程师综合训练 · 暗橄榄'),
    ('maogai', '学习通题库·毛概 · 朱红（品牌色，固定不参与重排）'),
]

with open(os.path.join(HERE, 'course_colors.json'), encoding='utf-8') as f:
    colors = json.load(f)

light_lines = []
dark_lines = []
for key, desc in COURSES:
    light_lines.append(f'  --{key}: {colors[key]["light"]};'
                       f'                 /* {desc} */')
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
