# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
import itertools
PAL = ['#31708e','#a05a2c','#2e7d5b','#b5485e','#8f741c','#4a5aa8','#22767c','#8a4a2f','#7d5ba6','#6b7a2f','#9c4a72','#56698f','#36a136','#6e4a24','#6b5ba7','#b3c26e','#d18f6e','#9db0d6','#68de68','#b39be0','#d69ab8','#9c6b3f']
for name,base,n in [('la','#773aa6',6),('ds','#385d9f',8),('ee','#9f3849',15)]:
    best=None
    for combo in itertools.combinations(PAL,n):
        allc=[base]+list(combo)
        mn=min(de(a,b) for i,a in enumerate(allc) for b in allc[i+1:])
        if best is None or mn>best[0]: best=(mn,combo)
    print(name, f'minΔE={best[0]:.1f}', ' '.join(best[1]))
