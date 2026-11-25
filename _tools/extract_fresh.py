# 提取「线性代数 / 数据结构 / 电路与电子技术基础」课件与试题文本，产物写入 _audit/fresh_extract/（不入库）。
# 用法：python _tools/extract_fresh.py
import io
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_audit" / "fresh_extract"
OUT.mkdir(parents=True, exist_ok=True)

import pymupdf
from pptx import Presentation

COURSES = {
    "linalg": ROOT / "data" / "大一上" / "线性代数",
    "ds": ROOT / "data" / "大一下" / "数据结构",
    "ee": ROOT / "data" / "大一下" / "电路与电子技术基础",
}


def clean(s: str) -> str:
    return "\n".join(line.rstrip() for line in s.replace("\r", "").splitlines()).strip()


def dump_pdf(path: Path, out_dir: Path, prefix: str):
    doc = pymupdf.open(path)
    parts = [f"===== {path.name} | {doc.page_count} 页 ====="]
    for i, page in enumerate(doc, 1):
        parts.append(f"--- p{i} ---\n" + clean(page.get_text("text")))
    doc.close()
    name = prefix + path.stem.replace(" ", "_").replace("/", "_") + ".txt"
    (out_dir / name).write_text("\n\n".join(parts), encoding="utf-8")
    return doc.page_count if False else name


def dump_pptx(path: Path, out_dir: Path, prefix: str):
    prs = Presentation(path)
    parts = [f"===== {path.name} | {len(prs.slides)} 页 ====="]
    for i, slide in enumerate(prs.slides, 1):
        lines = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    t = clean("".join(r.text for r in para.runs))
                    if t:
                        lines.append(t)
            if getattr(shape, "has_table", False) and shape.has_table:
                for row in shape.table.rows:
                    lines.append(" | ".join(clean(c.text) for c in row.cells))
        parts.append(f"--- slide{i} ---\n" + "\n".join(lines))
    name = prefix + path.stem.replace(" ", "_").replace("/", "_") + ".txt"
    (out_dir / name).write_text("\n\n".join(parts), encoding="utf-8")
    return name


for key, src in COURSES.items():
    out_dir = OUT / key
    out_dir.mkdir(exist_ok=True)
    print(f"### {key} {src.name}")

    # 课件：PDF + PPTX（跳过临时文件 ~$ 与 .gch 等）
    for path in sorted((src / "课件").rglob("*")):
        if not path.is_file() or path.name.startswith("~$"):
            continue
        try:
            if path.suffix.lower() == ".pdf":
                name = dump_pdf(path, out_dir, "cw_pdf_")
            elif path.suffix.lower() == ".pptx":
                name = dump_pptx(path, out_dir, "cw_pptx_")
            else:
                continue
        except Exception as e:  # noqa: BLE001
            print(f"  !! {path.name}: {e}")
            continue
        print(f"  cw {path.name} -> {name}")

    # 附件里的新课件 PDF（线性代数的 PPT-新 在这里）
    for path in sorted((src / "附件").rglob("*.pdf")):
        try:
            name = dump_pdf(path, out_dir, "att_pdf_")
        except Exception as e:  # noqa: BLE001
            print(f"  !! {path.name}: {e}")
            continue
        print(f"  att {path.name} -> {name}")

    # 试题：全部 PDF
    for path in sorted((src / "试题").rglob("*.pdf")):
        try:
            name = dump_pdf(path, out_dir, "exam_pdf_")
        except Exception as e:  # noqa: BLE001
            print(f"  !! {path.name}: {e}")
            continue
        print(f"  exam {path.name} -> {name}")
