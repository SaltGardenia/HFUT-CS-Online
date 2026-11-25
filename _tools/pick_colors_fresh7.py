# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
for name,h in [('la',274),('ds',218),('dscd',236),('ee',350)]:
    best=[]
    for hh in range(h-8,h+9,2):
        for s_ in [0.36,0.42,0.48,0.54]:
            for l in [0.62,0.66,0.70,0.74]:
                cc=hsl2hex(hh,s_,l)
                best.append((min(de(cc,x) for x in Dh),cc,hh,s_,l))
    best.sort(reverse=True)
    print(name, best[0], best[1])
