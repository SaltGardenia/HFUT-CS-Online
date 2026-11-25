# 提取「大二上」各课课件/试题文本，供整理成前端页面用。
# pptx → python-pptx；ppt → LibreOffice 转 pptx 再读；pdf → pymupdf；docx → python-docx；doc → LibreOffice 转 docx。
# 用法: python -I _tools/extract_d2s.py [课程名...]   → 输出到 _tools/d2s_out/<课程>/<类别>/<相对路径>.txt
import os
import re
import shutil
import subprocess
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.join(BASE, 'data', '大二上')
OUT = os.path.join(BASE, '_tools', 'd2s_out')
SOFFICE = r'C:\Program Files\LibreOffice\program\soffice.exe'
TMP = os.path.join(OUT, '_tmp')

COURSES = sys.argv[1:] or [
    'Python程序设计', '离散数学', '计算方法', '概率论与数理统计', '汇编语言程序设计',
    'EDA实训', '科研训练', '大学物理实验', 'Java技术', '数字逻辑', '机器人技术',
]


def shape_text(shape, out, depth=0):
    pad = '  ' * depth
    if shape.shape_type == 6:  # GROUP
        for sub in shape.shapes:
            shape_text(sub, out, depth + 1)
        return
    if shape.has_text_frame:
        lines = []
        for para in shape.text_frame.paragraphs:
            t = ''.join(run.text for run in para.runs)
            if t.strip():
                lines.append(t.rstrip())
        if lines:
            out.append(pad + '\n'.join(lines).rstrip())
    if getattr(shape, 'has_table', False) and shape.has_table:
        out.append(pad + '[TABLE]')
        for row in shape.table.rows:
            cells = [cell.text.replace('\n', '⏎').strip() for cell in row.cells]
            out.append(pad + ' | '.join(cells))
        out.append(pad + '[/TABLE]')


def pptx_text(src):
    from pptx import Presentation
    prs = Presentation(src)
    out = [f'# {os.path.basename(src)}\n共 {len(prs.slides)} 页\n']
    for i, slide in enumerate(prs.slides, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        for shape in slide.shapes:
            shape_text(shape, out)
        if slide.has_notes_slide:
            note = slide.notes_slide.notes_text_frame.text.strip()
            if note:
                out.append('[备注] ' + note)
    return '\n'.join(out)


def pdf_text(src):
    import pymupdf
    doc = pymupdf.open(src)
    out = [f'# {os.path.basename(src)}\n共 {doc.page_count} 页\n']
    for i, page in enumerate(doc, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        out.append(page.get_text('text').strip())
    doc.close()
    return '\n'.join(out)


def docx_text(src):
    import docx
    d = docx.Document(src)
    out = [f'# {os.path.basename(src)}\n']
    for p in d.paragraphs:
        t = p.text.strip()
        if t:
            out.append(t)
    for ti, table in enumerate(d.tables, 1):
        out.append(f'[TABLE {ti}]')
        for row in table.rows:
            out.append(' | '.join(c.text.replace('\n', '⏎').strip() for c in row.cells))
        out.append('[/TABLE]')
    return '\n'.join(out)


def convert(src, kind):
    """LibreOffice 单文件转换，返回转换后的临时路径（失败返回 None）"""
    os.makedirs(TMP, exist_ok=True)
    before = set(os.listdir(TMP))
    try:
        subprocess.run(
            [SOFFICE, '--headless', '--norestore', f'--convert-to', kind, '--outdir', TMP, src],
            check=True, timeout=180, capture_output=True,
        )
    except Exception as e:
        print('  转换失败', os.path.basename(src), e)
        return None
    new = set(os.listdir(TMP)) - before
    if not new:
        return None
    return os.path.join(TMP, new.pop())


def safe_rel(path):
    rel = os.path.relpath(path, ROOT)
    return re.sub(r'[\\/:*?"<>|]+', '_', rel) + '.txt'


def extract_file(src, course):
    ext = os.path.splitext(src)[1].lower()
    try:
        if ext == '.pptx':
            text = pptx_text(src)
        elif ext == '.ppt':
            conv = convert(src, 'pptx')
            if not conv:
                return
            text = pptx_text(conv)
            os.remove(conv)
        elif ext == '.pdf':
            text = pdf_text(src)
        elif ext == '.docx':
            text = docx_text(src)
        elif ext == '.doc':
            conv = convert(src, 'docx')
            if not conv:
                return
            text = docx_text(conv)
            os.remove(conv)
        elif ext in ('.txt', '.md', '.py', '.java', '.v', '.c', '.h', '.cpp'):
            text = open(src, encoding='utf-8', errors='replace').read()
        else:
            return
    except Exception as e:
        print('  读取失败', os.path.basename(src), e)
        return
    dest = os.path.join(OUT, course, safe_rel(src))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(text)
    print('  OK', os.path.relpath(src, ROOT), len(text))


def main():
    for course in COURSES:
        cdir = os.path.join(ROOT, course)
        print('##', course)
        for cat in ('课件', '试题'):
            d = os.path.join(cdir, cat)
            if not os.path.isdir(d):
                continue
            for dirpath, _, files in os.walk(d):
                for name in sorted(files):
                    if name.lower().startswith('readme'):
                        continue
                    extract_file(os.path.join(dirpath, name), course)


if __name__ == '__main__':
    main()
