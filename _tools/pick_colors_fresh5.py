# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
for name,h in [('la',274),('ds',218),('dscd',230),('ee',350)]:
    best=[]
    for hh in range(h-8,h+9,2):
        for s_ in [0.42,0.48,0.54,0.60,0.66,0.72]:
            for l in [0.58,0.62,0.66,0.70,0.74,0.78,0.82]:
                cc=hsl2hex(hh,s_,l)
                hard=min(de(cc,x) for x in Dh)
                best.append((hard,cc,hh,s_,l))
    best.sort(reverse=True)
    print(name, 'top dark:')
    for hard,cc,hh,s_,l in best[:6]:
        print(f'  {cc} hard={hard:.1f} hue={hh} s={s_} l={l}')
