# 软件测试 9 份老 .ppt → PowerPoint COM 导出 PNG → PIL 3x3 蒙太奇（带页码标注）供读图转录
import os
import glob
import math
import subprocess
import sys

from PIL import Image, ImageDraw

SLIDE_W = 1024
GRID = 3
OUT_ROOT = os.path.abspath('_audit/st_slides')
PNG_ROOT = os.path.abspath('_audit/st_png')

CHAPTERS = [
    ('第1章 绪论', '第1章 绪论.ppt'),
    ('第2章 软件测试策略', '第2章 软件测试策略.ppt'),
    ('第3章 黑盒测试', '第3章 黑盒测试.ppt'),
    ('第4章 白盒测试', '第4章 白盒测试.ppt'),
    ('第5章 集成测试', '第5章 集成测试.ppt'),
    ('第6章 系统测试', '第6章 系统测试.ppt'),
    ('第7章 测试组织和管理', '第7章 测试组织和管理.ppt'),
    ('第9章 软件评审', '第9章 软件评审.ppt'),
    ('第10章 软件质量与软件质量管理', '第10章 软件质量与软件质量管理.ppt'),
]


def export_pngs():
    import win32com.client

    app = win32com.client.Dispatch('PowerPoint.Application')
    for _, fname in CHAPTERS:
        src = os.path.abspath(f'data/大三下/软件测试/课件/PPT/{fname}')
        outdir = os.path.join(PNG_ROOT, fname.replace('.ppt', ''))
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
        base = fname.replace('.ppt', '')
        pngs = sorted(
            glob.glob(os.path.join(PNG_ROOT, base, '*.png')),
            key=lambda p: int(''.join(c for c in os.path.basename(p) if c.isdigit()) or 0),
        )
        if not pngs:
            print('NO PNGS', base)
            continue
        n = len(pngs)
        montages = math.ceil(n / (GRID * GRID))
        # 取一张缩略图定格子尺寸
        first = Image.open(pngs[0])
        cw, chh = first.size
        label_h = 28
        for m in range(montages):
            cells = pngs[m * GRID * GRID : (m + 1) * GRID * GRID]
            board = Image.new('RGB', (GRID * cw + (GRID + 1) * 8, GRID * (chh + label_h) + (GRID + 1) * 8), '#222')
            draw = ImageDraw.Draw(board)
            for idx, p in enumerate(cells):
                r, c = divmod(idx, GRID)
                x = 8 + c * (cw + 8)
                y = 8 + r * (chh + label_h + 8)
                img = Image.open(p)
                if img.size != (cw, chh):
                    img = img.resize((cw, chh))
                slide_no = int(''.join(ch for ch in os.path.basename(p) if ch.isdigit()) or 0)
                draw.text((x + 4, y + 4), f'#{slide_no}', fill='#ffd54a')
                board.paste(img, (x, y + label_h))
            outdir = os.path.join(OUT_ROOT, base)
            os.makedirs(outdir, exist_ok=True)
            out = os.path.join(outdir, f'm{m + 1:02d}.png')
            board.save(out)
        print('montage', base, n, 'slides ->', montages, 'boards')


if __name__ == '__main__':
    if '--export' in sys.argv:
        export_pngs()
    make_montages()
