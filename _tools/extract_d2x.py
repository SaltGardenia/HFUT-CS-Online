# 提取「大二下」各课程课件与试题文本：PDF → 逐页文本；PPTX → 逐页文本；PPT → LibreOffice 转 PDF 再抽取；DOCX → 全文。
# 产物写入 _audit/d2x_extract/（不入库），供人工核对与网页内容整理。
# 用法：python _tools/extract_d2x.py [课程名片段...]
import sys, io, os, subprocess, shutil
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / '大二下'
OUT = ROOT / '_audit' / 'd2x_extract'
CONV = OUT / 'converted'
OUT.mkdir(parents=True, exist_ok=True)
CONV.mkdir(parents=True, exist_ok=True)

import pymupdf
from pptx import Presentation
from docx import Document

SOFFICE = r'C:\Program Files\LibreOffice\program\soffice.exe'

# 课程 → {类别: 相对课程目录的文件列表或子目录}；子目录给 None 表示整目录
JOBS = {
    '编译原理': {
        '课件': [
            '课件/PPT-新/编译原理：第1章 引论（唐益明）-20240409New.ppt',
            '课件/PPT-新/编译原理：第2章 高级语言及其语法描述（唐益明）20200907.ppt',
            '课件/PPT-新/编译原理：第3章 词法分析（唐益明）20200914.ppt',
            '课件/PPT-新/编译原理：第4章 语法分析-自上而下分析(唐益明) 20200928.pptx',
            '课件/PPT-新/编译原理：第5章 语法分析——自下而上分析(唐益明) 20190928.ppt',
            '课件/PPT-新/编译原理：第6章  属性文法和语法制导翻译.ppt',
            '课件/PPT-新/编译原理：第7章  语义分析和中间代码产生.ppt',
        ],
        '试题': [
            '试题/期末/合肥工业大学2013-2014学年第一学期编译原理期末考卷及解答.pdf',
            '试题/期末/合肥工业大学2014-2015学年第一学期编译原理期末考卷及解答.pdf',
            '试题/期末/合肥工业大学2017-2018学年第一学期编译原理期末考卷.pdf',
            '试题/17-18编译原理期末考卷.pdf',
        ],
    },
    '机器学习': {
        '课件': [
            '课件/PPT-旧/0机器学习-绪论-2023学生.pptx',
            '课件/PPT-旧/决策树.pptx',
            '课件/PPT-旧/集成学习.pptx',
            '课件/PPT-旧/10-支持向量机.pptx',
            '课件/PPT-旧/16-实例OCR.pptx',
        ],
        '试题': [],
    },
    '计算机组成原理': {
        '课件': [
            '课件/PPT-2025/第1章 概述.pdf',
            '课件/PPT-2025/第3章_系统总线.pdf',
            '课件/PPT-2025/第4章_存储器.pdf',
            '课件/PPT-2025/第5章_输入输出系统-带练习版.pdf',
            '课件/PPT-2025/第6章 运算.pdf',
            '课件/PPT-2025/第7章 指令系统-带课题练习new.pdf',
            '课件/PPT-2025/第8章 CPU的结构与功能.pdf',
            '课件/PPT-2025/第9章 控制单元的功能.pdf',
            '课件/PPT-2025/第10章 控制单元的设计.pdf',
        ],
        '试题': [
            '试题/期末/2012-2013学年第二学期合肥工业大学《计算机组成原理与结构》期末试卷.pdf',
            '试题/期末/2014-2015学年第二学期合肥工业大学《计算机组成原理》期末试卷A.pdf',
            '试题/期末/2019-2020学年第二学期合肥工业大学《计算机组成原理》期末试卷A(线上考试).pdf',
            '试题/期末/2022年合肥工业大学(宣城校区)计算机科学与技术专业《计算机组成原理》科目期末试卷A(有答案).docx',
        ],
    },
    '嵌入式系统原理': {
        '课件': [
            '课件/PPT-新/第一章 绪论.pdf',
            '课件/PPT-新/第二章 ARM微处理器与编程模型.pdf',
            '课件/PPT-新/第三章 ARM指令集与汇编程序设计.pdf',
            '课件/PPT-新/第四章 嵌入式存储器系统.pdf',
            '课件/PPT-新/第五章 常用外围设备及接口.pdf',
            '课件/PPT-新/第六章 嵌入式Linux系统及其编程.pdf',
        ],
        '试题': [
            '试题/期末/合肥工业大学_2019-2020学年第二学期_嵌入式系统期末试卷B卷(电信科).pdf',
            '试题/期末/合肥工业大学_2020-2021学年_嵌入式系统期末试卷(扫描版).pdf',
            '试题/期末/嵌入式电信科试卷.pdf',
            '试题/期末/嵌入式系统原理_期中考试试卷与编程设计题.pdf',
            '试题/期末/嵌入式系统原理_期末备考梳理与历年要点(SYH版).pdf',
        ],
    },
    '软件工具与环境': {
        '课件': [
            '课件/第一章+绪论.pdf',
            '课件/第二章+从HTML说起.pdf',
            '课件/第三章+需求分析和模块设计.pdf',
            '课件/第四章开始实战.pdf',
            '课件/第五章我的简单CMS.pdf',
            '课件/第六章积木式的前台页面.pdf',
        ],
        '试题': [],
    },
    '组合数学': {
        '课件': [
            '课件/1.1加法原则与乘法原则.ppt',
            '课件/1.2集合的排列与组合.ppt',
            '课件/1.3重集的排列与组合.ppt',
            '课件/1.4分配问题.ppt',
            '课件/1.5排列的生成算法.ppt',
            '课件/1.6组合的生成算法.ppt',
            '课件/1.7二项式系数.ppt',
            '课件/2.1生成函数的概念.ppt',
            '课件/2.2生成函数的运算.ppt',
            '课件/2.3生成函数的展开式.ppt',
            '课件/2.4指数生成函数.ppt',
            '课件/2.5生成函数应用补充.ppt',
            '课件/2.6正整数的拆分.ppt',
            '课件/3.1递推关系的建立.ppt',
            '课件/3.2常系数线性齐次递推关系.ppt',
            '课件/3.3常系数线性非齐次递推关系.ppt',
            '课件/3.5Catalan数.ppt',
            '课件/3.6差分表和Stirling数.ppt',
            '课件/4.1-4.2容斥原理.ppt',
        ],
        '试题': [],
    },
}


def safe(name: str) -> str:
    return ''.join(c if c not in '\\/:*?"<>|' else '_' for c in name)


def ppt_to_pdf(src: Path) -> Path:
    dst = CONV / (safe(src.stem) + '.pdf')
    if dst.exists():
        return dst
    # 独立用户配置目录：已有 LibreOffice 实例在跑时 headless 转换会直接失败
    subprocess.run(
        [SOFFICE, '--headless', '-env:UserInstallation=file:///C:/Users/icepa/tmp/lo_prof',
         '--convert-to', 'pdf', '--outdir', str(CONV), str(src)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    return dst


def ppt_to_pptx(src: Path) -> Path:
    """老版 .ppt 先转 .pptx 再读文本：PDF 抽取会按 GBK 误解 UTF-8 页面字体，中文变乱码且丢字。"""
    dst = CONV / (safe(src.stem) + '.pptx')
    if dst.exists():
        return dst
    subprocess.run(
        [SOFFICE, '--headless', '-env:UserInstallation=file:///C:/Users/icepa/tmp/lo_prof',
         '--convert-to', 'pptx', '--outdir', str(CONV), str(src)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    return dst


def pdf_pages(pdf: Path) -> list[str]:
    doc = pymupdf.open(pdf)
    out = [p.get_text('text').strip() for p in doc]
    doc.close()
    return out


def pptx_pages(path: Path) -> list[str]:
    prs = Presentation(path)
    pages = []
    for slide in prs.slides:
        lines = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    t = ''.join(run.text for run in para.runs).strip()
                    if t:
                        lines.append(t)
            if getattr(shape, 'has_table', False) and shape.has_table:
                for row in shape.table.rows:
                    lines.append(' | '.join(cell.text.strip() for cell in row.cells))
        pages.append('\n'.join(lines))
    return pages


def docx_text(path: Path) -> str:
    doc = Document(path)
    lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    for table in doc.tables:
        for row in table.rows:
            lines.append(' | '.join(c.text.strip() for c in row.cells))
    return '\n'.join(lines)


def extract(course: str, cat: str, rel: str):
    src = SRC / course / rel
    if not src.exists():
        print(f'  !! 缺失 {course}/{rel}')
        return
    ext = src.suffix.lower()
    if ext == '.pdf':
        pages = pdf_pages(src)
    elif ext == '.pptx':
        pages = pptx_pages(src)
    elif ext == '.ppt':
        pages = pptx_pages(ppt_to_pptx(src))
    elif ext == '.docx':
        doc = docx_text(src)
        out = OUT / f'{course}__{cat}__{safe(src.stem)}.txt'
        out.write_text(f'===== {src.name} =====\n{doc}', encoding='utf-8')
        print(f'  {course}/{cat}: {src.name} -> docx {len(doc)} 字')
        return
    else:
        print(f'  ?? 跳过 {src}')
        return
    body = '\n\n'.join(f'--- p{i} ---\n{t}' for i, t in enumerate(pages, 1))
    out = OUT / f'{course}__{cat}__{safe(src.stem)}.txt'
    out.write_text(f'===== {src.name} | {len(pages)} 页 =====\n{body}', encoding='utf-8')
    chars = sum(len(t) for t in pages)
    print(f'  {course}/{cat}: {src.name} -> {len(pages)} 页 / {chars} 字')


filters = sys.argv[1:]
for course, jobs in JOBS.items():
    if filters and not any(f in course for f in filters):
        continue
    print(f'== {course}')
    for cat, rels in jobs.items():
        for rel in rels:
            extract(course, cat, rel)
print('done ->', OUT)
