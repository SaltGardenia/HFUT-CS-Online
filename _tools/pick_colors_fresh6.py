# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
for c in ['#a97ad9','#b08ade','#8fa8e8','#9fb4ea','#8c96e6','#9aa4ea','#d97f92','#d98a9c','#e08a99','#c87f8f']:
    hard=min(de(c,x) for x in Dh); soft=min(de(c,x) for x in Ds)
    print(f'{c} hue={hue_of(c):.0f} hard={hard:.1f} soft={soft:.1f}')
