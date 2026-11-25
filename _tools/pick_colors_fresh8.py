# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
for c in ['#d97287','#d47282','#cf6f80','#d16f83','#c9687a','#cf7a8c','#d4758a']:
    print(c, f'hard={min(de(c,x) for x in Dh):.1f}', f'hue={hue_of(c):.0f}')
