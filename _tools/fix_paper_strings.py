# -*- coding: utf-8 -*-
"""把 paper-db*.ts 里跨行的单引号字符串字面量改为模板字符串（内容含真实换行）。
策略：逐字符扫描，遇 '...' 字面量若内部含换行则转成 `...`。
跳过注释与 import/const 行，简单状态机即可（文件结构规整）。"""
import io, re, sys

FILES = [
    "src/content/db/paper-db2015.ts",
    "src/content/db/paper-db2019a.ts",
    "src/content/db/paper-db2019b.ts",
    "src/content/db/paper-db2022a.ts",
    "src/content/db/paper-db2023b.ts",
]

def fix(text: str) -> str:
    out = []
    i = 0
    n = len(text)
    in_line_comment = False
    in_block_comment = False
    changed = 0
    while i < n:
        c = text[i]
        if in_line_comment:
            out.append(c)
            if c == "\n":
                in_line_comment = False
            i += 1
            continue
        if in_block_comment:
            out.append(c)
            if text.startswith("*/", i):
                out.append(text[i+1]); i += 2; in_block_comment = False
                continue
            i += 1
            continue
        if text.startswith("//", i):
            in_line_comment = True
            out.append("//"); i += 2
            continue
        if text.startswith("/*", i):
            in_block_comment = True
            out.append("/*"); i += 2
            continue
        if c == "'":
            # 收集字符串到收尾引号（支持 \' 转义）
            j = i + 1
            buf = []
            has_newline = False
            while j < n:
                ch = text[j]
                if ch == "\\":
                    buf.append(text[j:j+2]); j += 2
                    continue
                if ch == "\n":
                    has_newline = True
                if ch == "'":
                    break
                buf.append(ch)
                j += 1
            if j >= n:
                raise RuntimeError("unterminated string")
            inner = "".join(buf)
            if has_newline:
                # 转模板字符串：\' → '；\n 真实换行保留；内部不能有反引号
                assert "`" not in inner and "$" not in inner, "template literal conflict"
                inner = inner.replace("\\'", "'")
                out.append("`" + inner + "'" and "`" + inner + "`")
                changed += 1
            else:
                out.append("'" + inner + "'")
            i = j + 1
            continue
        out.append(c)
        i += 1
    sys.stderr.write(f"converted {changed} literals\n")
    return "".join(out)

for f in FILES:
    s = io.open(f, encoding="utf-8").read()
    fixed = fix(s)
    io.open(f, "w", encoding="utf-8", newline="\n").write(fixed)
    print("fixed", f)
