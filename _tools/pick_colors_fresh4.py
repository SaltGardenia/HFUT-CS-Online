# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
cands = {
 'la_violet':'#6f3a9c', 'la_violet2':'#773aa6',
 'ds_blue':'#385d9f', 'ds_teal':'#2f6f8f', 'ds_teal2':'#26707e',
 'dscd_navy':'#2d3b80', 'dscd_brown':'#7b4832',
 'ee_crimson':'#9f3849', 'ee_brown':'#714528', 'ee_rust':'#8a4a2f',
}
for k,c in cands.items():
    near=sorted(((de(c,grab(v,light_s)),v,grab(v,light_s)) for v in COURSE_BASES))[:3]
    print(f'{k:12s} {c} hard={min(de(c,x) for x in Lh):.1f} hue={hue_of(c):.0f}  near: ' + ', '.join(f'{v} {d:.1f}' for d,v,_ in near))
print()
# 暗色候选：同色相提亮
for k,c in cands.items():
    h=hue_of(c)
    best=None
    for s_ in [0.36,0.42,0.48,0.54,0.60]:
        for l in [0.62,0.66,0.70,0.74,0.78]:
            cc=hsl2hex(h,s_,l)
            hard=min(de(cc,x) for x in Dh)
            if best is None or hard>best[0]: best=(hard,cc,s_,l)
    hard,cc,s_,l=best
    print(f'{k:12s} dark {cc} hard={hard:.1f} (s={s_} l={l})')
