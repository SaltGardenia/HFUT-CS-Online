import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { courses } from '../courses/registry';
import { useToc } from '../lib/toc';

/* ------------------------------------------------------------------ 类型 */
interface AttNode {
  /** 文件/目录名 */
  n: string;
  /** 相对课程目录的 POSIX 路径 */
  p: string;
  /** 文件字节数（仅文件） */
  s?: number;
  /** 子节点（仅目录） */
  c?: AttNode[];
  /** 来源仓库 key（文件清单.csv 溯源；单一来源目录也带，供目录跳转） */
  r?: string;
  /** 上游仓库内路径（目录为仓库内目录路径） */
  sp?: string;
}
interface AttManifest {
  semester: string;
  course: string;
  cats: { name: string; tree: AttNode[] }[];
}

/**
 * 四个上游资料仓库及本站新增课件 → 下载直链参数。
 * 分支为各仓库默认分支实测值（styitches/mox 是 master，其余是 main）；
 * 上游若改默认分支，跳转/下载会 404，需重新 `git ls-remote --symref` 核对。
 */
const REPOS: Record<string, { owner: string; repo: string; branch: string }> = {
  self: { owner: 'SaltGardenia', repo: 'HFUT-CS-Online', branch: 'main' },
  sunmiao: { owner: 'sunmiao0301', repo: 'HFUT-CS', branch: 'main' },
  styitches: { owner: 'styitches', repo: 'HFUT-CS', branch: 'master' },
  mox: { owner: 'mox-hub', repo: 'hfut-cs', branch: 'master' },
  luna: { owner: 'Tuning-Luna', repo: 'HFUT_XC_Study_Things', branch: 'main' },
};

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const countFiles = (nodes: AttNode[]): number => nodes.reduce((a, x) => a + (x.c ? countFiles(x.c) : 1), 0);

/** 与类别同名的顶层目录（课件/课件）拍平到类别下，避免组头与目录重名 */
const flattenCats = (m: AttManifest) => m.cats.map((c) => ({ name: c.name, tree: c.tree.flatMap((t) => (t.c && t.n === c.name ? t.c : [t])) }));

/** 树按当前展开集摊平成可见行（深度随层级递增），保持清单原有的「目录在前、名称排序」 */
const visibleRows = (nodes: AttNode[], open: Set<string>, depth: number, out: { node: AttNode; depth: number }[]) => {
  for (const n of nodes) {
    out.push({ node: n, depth });
    if (n.c && open.has(n.p)) visibleRows(n.c, open, depth + 1, out);
  }
};

/**
 * 课程附件页 —— 所有课程共用的「附件」导航页。
 * 旧资料文件本体不入库（data/** 默认被 gitignore）；2025 课件已单独纳入仓库。页面按课件/试题/附件三类
 * 陈列层级目录树（保留资料的目录结构），一键下载从上游资料仓库或本站
 * 拉取 raw 文件存盘（fetch→blob→download）；单一来源的项目目录额外提供 GitHub 跳转链接。
 * 清单由 npm run catalog 生成至 public/attachments/（含来源仓库与源路径溯源）。
 */
export default function CourseAttachmentsPage() {
  const location = useLocation();
  const toc = useToc();

  const course = useMemo(
    () => courses.find((c) => location.pathname.startsWith(`${c.base}/`) || location.pathname === c.base),
    [location.pathname],
  );
  const key = course ? `${course.semester}__${course.name}` : null;

  const [manifest, setManifest] = useState<AttManifest | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  /** 正在下载的文件路径（按钮转「下载中…」） */
  const [pending, setPending] = useState<string | null>(null);
  /** 已展开的目录路径集合（默认全收起，保持层级紧凑） */
  const [openDirs, setOpenDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 拉取课程清单
  useEffect(() => {
    if (!key) return;
    let alive = true;
    setLoading(true);
    setMissing(false);
    setManifest(null);
    setOpenDirs(new Set());
    fetch(`${import.meta.env.BASE_URL}attachments/${key}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<AttManifest>;
      })
      .then((m) => alive && setManifest(m))
      .catch(() => alive && setMissing(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [key]);

  const toggleDir = (p: string) =>
    setOpenDirs((s) => {
      const next = new Set(s);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });

  /** 仓库 raw 直链（路径逐段编码，保留 /） */
  const rawUrl = (node: AttNode) => {
    const meta = REPOS[node.r!];
    return `https://raw.githubusercontent.com/${meta.owner}/${meta.repo}/${meta.branch}/${node.sp!.split('/').map(encodeURIComponent).join('/')}`;
  };

  /** 仓库目录页跳转链接（单一来源文件夹） */
  const treeUrl = (node: AttNode) => {
    const meta = REPOS[node.r!];
    const seg = node.sp ? node.sp.split('/').map(encodeURIComponent).join('/') : '';
    return `https://github.com/${meta.owner}/${meta.repo}/tree/${meta.branch}${seg ? `/${seg}` : ''}`;
  };

  /** 一键下载：fetch raw → blob → 存盘；失败兜底新开 raw 直链 */
  const download = async (node: AttNode) => {
    if (!node.r || pending) return;
    const url = rawUrl(node);
    setPending(node.p);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const a = document.createElement('a');
      const u = URL.createObjectURL(blob);
      a.href = u;
      a.download = node.n;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 4000);
    } catch {
      window.open(url, '_blank', 'noopener');
    } finally {
      setPending(null);
    }
  };

  const cats = manifest ? flattenCats(manifest) : [];
  const total = manifest ? countFiles(manifest.cats.reduce<AttNode[]>((a, c) => a.concat(c.tree), [])) : 0;

  /** 行内缩进：类别卡内基础 16px，每层 +22px */
  const indent = (depth: number) => ({ paddingLeft: 16 + depth * 22 });

  return (
    <div className="page att-page">
      <h1>附件</h1>
      <div className="lede">
        <p>
          {course?.name} 课程资料：课件 · 试题 · 附件共 {manifest ? total : '—'} 份文件，按资料目录层级陈列，包括 2025 新版课件和 4 个上游资料仓库。
        </p>
      </div>

      {loading && <div className="att-state">清单加载中…</div>}

      {!loading && missing && (
        <div className="callout key att-state">
          <p className="callout-h">本课程暂无附件清单</p>
          <p>本课程的课件讲义与自测题随仓库内容自建，未使用 data/ 资料库目录；课件可从顶部导航进入阅读。</p>
        </div>
      )}

      {!loading && manifest && (
        <div className="att-list">
          {cats.map((cat) => {
            if (cat.tree.length === 0) return null;
            const rows: { node: AttNode; depth: number }[] = [];
            visibleRows(cat.tree, openDirs, 0, rows);
            return (
              <section key={cat.name} className="att-cat material">
                <p className="att-cat-h">
                  {cat.name}
                  <span className="att-cat-count">{countFiles(cat.tree)}</span>
                </p>
                <div className="att-rows">
                  {rows.map(({ node, depth }) =>
                    node.c ? (
                      <div key={node.p} className="att-row att-row-dir" style={indent(depth)}>
                        <button
                          type="button"
                          className="att-dir-btn"
                          aria-expanded={openDirs.has(node.p)}
                          onClick={() => toggleDir(node.p)}
                        >
                          <span className="att-caret" aria-hidden>
                            ▸
                          </span>
                          <span className="att-row-name" title={node.n}>
                            {node.n}
                          </span>
                          <span className="att-row-path">
                            {countFiles(node.c)} 份文件
                            {node.r ? ` · 来自 ${REPOS[node.r].owner}` : ' · 多仓库混合'}
                          </span>
                        </button>
                        {node.r && (
                          <a className="btn att-dl att-jump" href={treeUrl(node)} target="_blank" rel="noreferrer" title="在上游仓库打开该目录">
                            仓库 ↗
                          </a>
                        )}
                      </div>
                    ) : (
                      <div key={node.p} className="att-row att-row-file" style={indent(depth)}>
                        <div className="att-row-main">
                          <span className="att-row-name" title={node.n}>
                            {node.n}
                          </span>
                          <span className="att-row-path">
                            {node.s == null ? '' : fmtSize(node.s)}
                            {node.r && `${node.s == null ? '' : ' · '}来自 ${REPOS[node.r].owner}`}
                          </span>
                        </div>
                        {node.r ? (
                          <button type="button" className="btn att-dl" disabled={pending === node.p} onClick={() => download(node)}>
                            {pending === node.p ? '下载中…' : '下载'}
                          </button>
                        ) : (
                          <button type="button" className="btn att-dl" disabled title="该文件未溯源到上游仓库">
                            下载
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
