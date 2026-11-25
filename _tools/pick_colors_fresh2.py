# -*- coding: utf-8 -*-
import io, re, math, colorsys
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])

rows=[]
for h in range(0,360,2):
    for s_ in [0.24,0.30,0.36,0.42,0.48]:
        for l in [0.28,0.32,0.36,0.40,0.44]:
            c=hsl2hex(h,s_,l)
            hard=min(de(c,x) for x in Lh)
            soft=min(de(c,x) for x in Ls)
            rows.append((hard,soft,h,c,de(c,'#f5f5f7')))
rows.sort(reverse=True)
print('top light by hard:')
for hard,soft,h,c,dbg in rows[:40]:
    print(f'{c} hue={h:3d} hard={hard:.1f} soft={soft:.1f} L={hex2lab(c)[0]:.0f}')
