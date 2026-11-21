# 批量提取 大三下 全部课件文本：pptx→python-pptx，pdf→pymupdf
import os, glob
from pptx import Presentation
import pymupdf

OUT = '_audit/sanxia_extract'
os.makedirs(OUT, exist_ok=True)

def flat(rel):
    return rel.replace('/', '__').replace(chr(92), '__')

def x_pptx(f, out):
    p = Presentation(f)
    lines = [f'===== {os.path.basename(f)} | {len(p.slides)} 页 =====', '']
    for i, slide in enumerate(p.slides, 1):
        lines.append(f'--- slide{i} ---')
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    t = ''.join(r.text for r in para.runs)
                    if t.strip():
                        lines.append(t)
            if shape.shape_type == 13:
                lines.append(f'[图片 name={shape.name}]')
            if getattr(shape, 'has_table', False) and shape.has_table:
                lines.append('[表格]')
                for row in shape.table.rows:
                    lines.append(' | '.join(c.text.strip() for c in row.cells))
        lines.append('')
    open(out, 'w', encoding='utf-8').write('\n'.join(lines))

def x_pdf(f, out):
    doc = pymupdf.open(f)
    lines = [f'===== {os.path.basename(f)} | {doc.page_count} 页 =====', '']
    for i, page in enumerate(doc, 1):
        lines.append(f'--- p{i} ---')
        lines.append(page.get_text('text').strip())
        lines.append('')
    open(out, 'w', encoding='utf-8').write('\n'.join(lines))
    doc.close()

for f in sorted(glob.glob('data/大三下/**/*.pptx', recursive=True)):
    rel = os.path.relpath(f, 'data/大三下')
    out = os.path.join(OUT, flat(rel) + '.txt')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    try:
        x_pptx(f, out)
        print('OK ', rel)
    except Exception as e:
        print('ERR', rel, e)

for f in sorted(glob.glob('data/大三下/*/课件/**/*.pdf', recursive=True)):
    rel = os.path.relpath(f, 'data/大三下')
    out = os.path.join(OUT, flat(rel) + '.txt')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    try:
        x_pdf(f, out)
        print('OK ', rel)
    except Exception as e:
        print('ERR', rel, e)
