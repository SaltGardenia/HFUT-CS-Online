# -*- coding: utf-8 -*-
"""数据库系统 5 份试卷提取：文本层 PDF → txt；扫描 PDF → PNG；.doc → docx/txt"""
import sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import fitz

BASE = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design"
SRC = os.path.join(BASE, "data", "大三下", "数据库系统", "试题", "期末")
OUT = os.path.join(BASE, "_audit", "sanxia_extract")
IMG = os.path.join(OUT, "db_papers_png")
os.makedirs(IMG, exist_ok=True)

PDFS = [
    ("合肥工业大学2015-2016学年第一学期数据库系统试卷(宣城校区).pdf", "db2015"),
    ("合肥工业大学2019-2020学年第一学期数据库系统期末试卷B卷(宣城校区).pdf", "db2019b"),
    ("合肥工业大学2019-2020学年第二学期数据库技术期末试卷A卷.pdf", "db2019a"),
    ("合肥工业大学2022-2023学年第二学期数据库系统期末试卷A卷.pdf", "db2022a"),
]

for fname, tag in PDFS:
    path = os.path.join(SRC, fname)
    doc = fitz.open(path)
    print(f"===== {fname} | {len(doc)} 页 =====")
    total = 0
    lines = []
    for i, page in enumerate(doc):
        t = page.get_text("text")
        total += len(t.strip())
        lines.append(f"--- p{i+1} ---\n{t}")
        # 每页都渲染 PNG（供扫描件读图；文本卷也留底核对）
        pix = page.get_pixmap(dpi=110)
        pix.save(os.path.join(IMG, f"{tag}_p{i+1}.png"))
    outtxt = os.path.join(OUT, f"数据库系统__试题__{tag}.txt")
    with open(outtxt, "w", encoding="utf-8") as f:
        f.write(f"===== {fname} | {len(doc)} 页 | 文本 {total} 字符 =====\n\n" + "\n".join(lines))
    print(f"  chars={total} -> {outtxt}")
    doc.close()

# .doc → Word COM 转文本
import win32com.client
doc_path = os.path.join(SRC, "合肥工业大学2023-2024学年第二学期数据库系统期末试卷B卷(宣城校区).doc")
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
d = word.Documents.Open(doc_path, ReadOnly=True)
text = d.Content.Text
d.SaveAs(os.path.join(OUT, "db_papers_png", "db2023b_converted.docx"), FileFormat=16)
d.Close(False)
word.Quit()
outtxt = os.path.join(OUT, "数据库系统__试题__db2023b.txt")
with open(outtxt, "w", encoding="utf-8") as f:
    f.write("===== 合肥工业大学2023-2024学年第二学期数据库系统期末试卷B卷(宣城校区).doc =====\n\n" + text)
print(f"  doc chars={len(text)} -> {outtxt}")
