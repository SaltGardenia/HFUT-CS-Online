# 提取大三下「人工智能经济学」pptx 与「信息安全技术」pdf 的逐页文本（含页码与图形占位标记），
# 输出到 _audit/aie_text/ 与 _audit/sec_text/，供章节转写使用。
import os
import re
import zipfile
import sys

try:
    import pymupdf as fitz
except ImportError:
    import fitz  # type: ignore

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_AIE = os.path.join(REPO, '_audit', 'aie_text')
OUT_SEC = os.path.join(REPO, '_audit', 'sec_text')


def dump_pptx(src: str, dst: str, label: str) -> None:
    z = zipfile.ZipFile(src)
    names = sorted(
        (n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)),
        key=lambda n: int(re.search(r'(\d+)', n).group(1)),
    )
    lines = [f'# {label} 共 {len(names)} 页', '']
    for i, n in enumerate(names, 1):
        xml = z.read(n).decode('utf-8', 'ignore')
        paras = []
        for pa in re.findall(r'<a:p>(.*?)</a:p>', xml, re.S):
            ts = re.findall(r'<a:t>([^<]*)</a:t>', pa)
            t = ''.join(ts).strip()
            if t:
                paras.append(t)
        lines.append(f'== 幻灯片 {i} ==')
        lines.extend(paras)
        lines.append('')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(dst, len(names), 'slides')


def dump_pdf(src: str, dst: str, label: str) -> None:
    d = fitz.open(src)
    lines = [f'# {label} 共 {d.page_count} 页', '']
    for i, page in enumerate(d, 1):
        text = page.get_text().strip()
        lines.append(f'== 第 {i} 页 ==')
        lines.append(text if text else '(无文本层)')
        lines.append('')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(dst, d.page_count, 'pages')


def main() -> None:
    os.makedirs(OUT_AIE, exist_ok=True)
    os.makedirs(OUT_SEC, exist_ok=True)

    aie_ppt = os.path.join(REPO, 'data', '大三下', '人工智能经济学', '课件', 'PPT')
    order = ['一', '二', '三', '四', '五', '六', '七', '八']
    for f in os.listdir(aie_ppt):
        if not f.endswith('.pptx'):
            continue
        m = re.search(r'第(.)章', f)
        no = order.index(m.group(1)) + 1 if m else 0
        dump_pptx(
            os.path.join(aie_ppt, f),
            os.path.join(OUT_AIE, f'ch{no}.txt'),
            f'人工智能经济学 第{no}章（{f}）',
        )

    sec_ppt = os.path.join(REPO, 'data', '大三下', '信息安全技术', '课件', 'PPT')
    mapping = {'第1章 概述.pdf': 'ch1', '第2章 对称密码学.pdf': 'ch2', '第3章 公钥密码学.pdf': 'ch3',
               '第4章 消息认证.pdf': 'ch4', '第6章 Web安全.pdf': 'ch6', '第7章 区块链与其他技术.pdf': 'ch7'}
    for f, key in mapping.items():
        dump_pdf(
            os.path.join(sec_ppt, f),
            os.path.join(OUT_SEC, f'{key}.txt'),
            f'信息安全技术 {key[2:]}章（{f}）',
        )


if __name__ == '__main__':
    sys.exit(main())
