"""渲染信息安全技术 PDF 课件为 PNG 页图 + 3x3 蒙太奇版板（用于图示页核读）。
用法: python _tools/render_sec_slides.py [--png]  （--png 仅重导出页图；默认只拼版板）
页图: _audit/sec_png/<章>/pNN.png；版板: _audit/sec_slides/<章>/mNN.png
"""
from __future__ import annotations

import os
import sys

import fitz  # pymupdf
from PIL import Image, ImageDraw

BASE = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design"
SRC = os.path.join(BASE, "data", "大三下", "信息安全技术", "课件", "PPT")
OUT_PNG = os.path.join(BASE, "_audit", "sec_png")
OUT_BOARD = os.path.join(BASE, "_audit", "sec_slides")
PAGE_W = 1024

# 课件目录 → 章号（与 extract_aie_sec.py 的映射一致）
CHAPTERS = {
    "第1章 概述.pdf": "ch1",
    "第2章 对称密码学.pdf": "ch2",
    "第3章 公钥密码学.pdf": "ch3",
    "第4章 消息认证.pdf": "ch4",
    "第6章 Web安全.pdf": "ch6",
    "第7章 区块链与其他技术.pdf": "ch7",
}


def export_pages() -> None:
    for fn, ch in CHAPTERS.items():
        path = os.path.join(SRC, fn)
        outdir = os.path.join(OUT_PNG, ch)
        os.makedirs(outdir, exist_ok=True)
        doc = fitz.open(path)
        for i, page in enumerate(doc, start=1):
            out = os.path.join(outdir, f"p{i:02d}.png")
            if os.path.exists(out):
                continue
            zoom = PAGE_W / page.rect.width
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
            pix.save(out)
        print(ch, doc.page_count, "pages")
        doc.close()


def boards() -> None:
    for ch in CHAPTERS.values():
        d = os.path.join(OUT_PNG, ch)
        pages = sorted(f for f in os.listdir(d) if f.startswith("p") and f.endswith(".png"))
        bdir = os.path.join(OUT_BOARD, ch)
        os.makedirs(bdir, exist_ok=True)
        per = 9
        for bi in range(0, len(pages), per):
            chunk = pages[bi : bi + per]
            idx = bi // per + 1
            out = os.path.join(bdir, f"m{idx:02d}.png")
            if os.path.exists(out):
                continue
            thumbs = []
            for f in chunk:
                im = Image.open(os.path.join(d, f)).convert("RGB")
                im.thumbnail((500, 500), Image.LANCZOS)
                thumbs.append(im)
            cols, rows = 3, 3
            tw, th = 500, max(t.height for t in thumbs)
            board = Image.new("RGB", (cols * tw, rows * th), "#222")
            dr = ImageDraw.Draw(board)
            for k, im in enumerate(thumbs):
                x, y = (k % cols) * tw, (k // cols) * th
                dr.rectangle([x, y, x + 52, y + 20], fill="#ffd633")
                dr.text((x + 6, y + 4), f"#{bi + k + 1}", fill="#000")
                board.paste(im, (x, y))
            board.save(out)
            print(out)


if __name__ == "__main__":
    if "--png" in sys.argv:
        export_pages()
    boards()
