# 人工智能经济学 8 份 pptx → PowerPoint COM 导出 PNG → PIL 3x3 蒙太奇（带页码标注）供读图核对与图注
import os
import glob
import math
import sys

from PIL import Image, ImageDraw

SLIDE_W = 1024
GRID = 3
OUT_ROOT = os.path.abspath('_audit/aie_slides')
PNG_ROOT = os.path.abspath('_audit/aie_png')

CHAPTERS = [
    ('第一章', '第一章.pptx'),
    ('第二章', '第二章.pptx'),
    ('第三章', '第三章.pptx'),
    ('第四章', '第四章.pptx'),
    ('第五章', '第五章.pptx'),
    ('第六章', '第六章.pptx'),
    ('第七章', '第七章.pptx'),
    ('第八章', '第八章.pptx'),
]


def export_pngs():
    import win32com.client

    app = win32com.client.Dispatch('PowerPoint.Application')
    for _, fname in CHAPTERS:
        src = os.path.abspath(f'data/大三下/人工智能经济学/课件/PPT/{fname}')
        outdir = os.path.join(PNG_ROOT, fname.replace('.pptx', ''))
        if os.path.isdir(outdir) and len(glob.glob(os.path.join(outdir, '*.png'))) > 0:
            print('skip (exists)', fname)
            continue
        os.makedirs(outdir, exist_ok=True)
        pres = app.Presentations.Open(src, WithWindow=False)
        pres.Export(outdir, 'PNG', SLIDE_W, int(SLIDE_W * 0.75))
        pres.Close()
        print('exported', fname, len(glob.glob(os.path.join(outdir, '*.png'))))
    app.Quit()


def make_montages():
    for label, fname in CHAPTERS:
        base = fname.replace('.pptx', '')
        pngs = sorted(
            glob.glob(os.path.join(PNG_ROOT, base, '*.png')),
            key=lambda p: int(''.join(c for c in os.path.basename(p) if c.isdigit()) or 0),
        )
        if not pngs:
            print('NO PNGS', base)
            continue
        n = len(pngs)
        montages = math.ceil(n / (GRID * GRID))
        first = Image.open(pngs[0])
        cw, chh = first.size
        sc = 500 / cw
        tw, th = int(cw * sc), int(chh * sc)
        outdir = os.path.join(OUT_ROOT, base)
        os.makedirs(outdir, exist_ok=True)
        for mi in range(montages):
            board = Image.new('RGB', (tw * GRID, th * GRID), 'black')
            for k in range(GRID * GRID):
                idx = mi * GRID * GRID + k
                if idx >= n:
                    break
                im = Image.open(pngs[idx]).resize((tw, th), Image.LANCZOS)
                d = ImageDraw.Draw(im)
                d.rectangle([0, 0, 76, 26], fill='yellow')
                d.text((4, 4), f'#{idx + 1}', fill='black')
                board.paste(im, ((k % GRID) * tw, (k // GRID) * th))
            out = os.path.join(outdir, f'm{mi + 1:02d}.png')
            board.save(out)
            print(out)


if __name__ == '__main__':
    if '--png' in sys.argv:
        export_pngs()
    make_montages()
