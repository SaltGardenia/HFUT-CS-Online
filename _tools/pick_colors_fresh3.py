# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
print('existing base hues:')
for v in COURSE_BASES:
    c = grab(v, light_s)
    print(f'  {v:6s} {c} hue={hue_of(c):5.1f} L*={hex2lab(c)[0]:.0f}')
for v in ('ok','hot','warn','accent','accent-2','purple'):
    c = grab(v, light_s); print(f'  {v:6s} {c} hue={hue_of(c):5.1f}')
print()
# 按色相桶找每桶最佳亮色（hard 最大）
for lo in range(0,360,20):
    best=None
    for h in range(lo, lo+20, 2):
        for s_ in [0.30,0.36,0.42,0.48]:
            for l in [0.30,0.34,0.38,0.42]:
                c=hsl2hex(h,s_,l)
                hard=min(de(c,x) for x in Lh)
                if best is None or hard>best[0]: best=(hard,h,s_,l,c)
    hard,h,s_,l,c=best
    print(f'hue {lo:3d}-{lo+19:3d}: {c} hard={hard:.1f} (s={s_} l={l})')
