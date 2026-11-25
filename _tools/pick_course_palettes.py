# -*- coding: utf-8 -*-
exec(open('_tools/pick_colors_fresh.py', encoding='utf-8').read().split("print('light top candidates:')")[0])
PAL = ['#31708e','#a05a2c','#2e7d5b','#b5485e','#8f741c','#4a5aa8','#22767c','#8a4a2f','#7d5ba6','#6b7a2f','#9c4a72','#56698f','#36a136','#6e4a24']
PRAC = ['#8d34c9','#36a136','#bf5af2']
ATT = ['#36a16b','#56698f','#a1369a','#8f741c','#b53aad','#37505f','#4a5f7a','#335b47','#812e8a']
cases = {'la':('#773aa6',6),'ds':('#385d9f',8),'dscd':('#7b4832',0),'ee':('#9f3849',15)}
for k,(base,n) in cases.items():
    best=None
    for off in range(len(PAL)):
        chs=[PAL[(off+i)%len(PAL)] for i in range(n)]
        allc=[base]+chs
        mn=min(de(a,b) for i,a in enumerate(allc) for b in allc[i+1:]) if len(allc)>1 else 99
        if best is None or mn>best[0]: best=(mn,off,chs)
    mn,off,chs=best
    print(f'{k}: base {base} off={off} minΔE={mn:.1f}')
    print('  ch:', ' '.join(chs))
    allc=[base]+chs
    pa=max(PRAC,key=lambda c:min(de(c,x) for x in allc))
    at=max(ATT,key=lambda c:min(de(c,x) for x in allc+[pa]))
    print(f'  practice {pa} (min {min(de(pa,x) for x in allc):.1f}), att {at} (min {min(de(at,x) for x in allc+[pa]):.1f})')
