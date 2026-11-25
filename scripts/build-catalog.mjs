/* 扫描 data/ 与 补充资料/ 生成两份生成物：
 * ① src/content/catalog.ts —— 课程目录数据（课程页与首页共用）；
 * ② public/attachments/<学期>__<课程>.json —— 各课程附件清单（附件页左目录树 / 右预览用）。
 * 目录结构契约见 data/整理说明.md：<学期>/<课程>/{课件,试题,附件}/**。
 * data/ 是 4 个上游仓库的整理产物（仅本地、不入库）；补充资料/ 是本站自有补充资料（入库、可下载）。
 * 两者按同一门课合并：目录按相对路径对齐，同名文件保留两份（补充资料一侧加后缀）。
 * 只读目录名、文件名与文件大小，不读取文件内容。生成物随提交入库，运行时零 IO。 */
import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(ROOT, '..');
const MATERIALS = join(REPO_ROOT, 'data');
/* 本站自有补充资料：目录契约与 data/ 相同，但随本仓库入库，可直接从本仓库 raw 下载。
 * 用途是给 4 个上游仓库没有覆盖到的课件 / 试卷 / 实验材料提供落点。 */
const SUPPLEMENT = join(REPO_ROOT, '补充资料');
/* 两个资料根：root 为物理目录，key 为仓库内路径前缀（附件清单溯源 sp 用）。 */
const SOURCES = [
  { root: MATERIALS, key: 'data' },
  { root: SUPPLEMENT, key: '补充资料' },
];
const OUT = join(REPO_ROOT, 'src', 'content', 'catalog.ts');
const ATTACH_DIR = join(REPO_ROOT, 'public', 'attachments');

const SEMESTER_ORDER = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];

const CATS = ['课件', '试题', '附件'];

/* 递归统计课程目录下所有文件，按"相对路径中第一个类别段"归属（课件/试题/附件）。
 * 课程内部还可能有更深层的同名类别目录（如 复习资料/试题/…），同样计入。 */
function countCourse(dir) {
  const counts = { 课件: 0, 试题: 0, 附件: 0 };
  (function walk(d, segs) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        walk(p, [...segs, name]);
      } else {
        // 上游仓库自带的说明文件（README*，且位于课程/类别目录直属层）不算课程资料
        if (/^readme/i.test(name) && segs.length <= 1) continue;
        const hit = segs.find((s) => CATS.includes(s));
        counts[hit ?? '附件'] += 1;
      }
    }
  })(dir, []);
  return counts;
}

function pad(name) {
  return JSON.stringify(name);
}

const sortName = (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN');

/* 溯源表：data/文件清单.csv 的 目标路径 → { 仓库, 源路径 }（附件页据此生成仓库直链下载）。
 * CSV 五列：来源仓库,源路径,目标路径,类别,处理；路径不含半角逗号（已核），按逗号切分即可。
 * CI 上无此文件时全部节点不带 r/sp，附件页下载按钮降级为不可用态。 */
function loadProvenance() {
  const csvPath = join(MATERIALS, '文件清单.csv');
  if (!existsSync(csvPath)) return new Map();
  const map = new Map();
  for (const line of readFileSync(csvPath, 'utf8').split('\n').slice(1)) {
    const t = line.trim();
    if (!t) continue;
    const [repo, src, dest] = t.split(',');
    if (repo && src && dest) map.set(dest, { repo, src });
  }
  return map;
}
const PROVENANCE = loadProvenance();

/** 从 git log 提取的 author name / email 解析展示名（优先 GitHub noreply 用户名，否则回退 author name）。 */
function resolveGitAuthor(name, email) {
  const m = email?.trim().match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i);
  if (m?.[1]) return m[1];
  const n = name?.trim();
  if (n) return n;
  return email?.split('@')[0]?.trim() || '';
}

/* 通过本地 git log 一次性扫描 data/ 与 补充资料/ 下所有已入库文件的首次上传者：
 * 返回 Map<仓库内 POSIX 路径 (如 data/大三上/...), 上传者名称>。
 * 启用重命名检测：资料在 data/ 与 补充资料/ 之间搬动时，新路径沿用原上传者（不把搬动者算成上传者）。
 * 浅克隆或非 git 环境失败时返回空 Map，不影响构建。 */
function loadGitUploaders() {
  const map = new Map();
  try {
    const out = execFileSync(
      'git',
      [
        '-c',
        'core.quotepath=false',
        'log',
        '--reverse',
        '-M',
        '--format=__COMMIT__\t%an\t%ae',
        '--name-status',
        '--',
        'data',
        '补充资料',
      ],
      { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
    );
    let currentAuthor = '';
    for (const rawLine of out.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith('__COMMIT__\t')) {
        const [, name = '', email = ''] = line.split('\t');
        currentAuthor = resolveGitAuthor(name, email);
        continue;
      }
      if (!currentAuthor) continue;
      const [status, p1, p2] = line.split('\t');
      if (status.startsWith('A')) {
        if (p1 && !map.has(p1)) map.set(p1, currentAuthor);
      } else if (status.startsWith('R')) {
        // 重命名：新路径继承旧路径的上传者；旧路径从未入库时退回本次提交作者
        if (p2 && !map.has(p2)) map.set(p2, map.get(p1) ?? currentAuthor);
      }
    }
  } catch {
    // 非 git 仓库或无 git 命令时静默跳过
  }
  return map;
}
const GIT_UPLOADERS = loadGitUploaders();

/** 若目录下所有后代文件共享同一上传者，则在目录节点上标记 u；否则清除。 */
function stampFolderUploader(node) {
  const uploaders = new Set();
  const collect = (x) => {
    if (x.c) x.c.forEach(collect);
    else uploaders.add(x.u ?? null);
  };
  node.c.forEach(collect);
  if (uploaders.size === 1 && !uploaders.has(null)) {
    node.u = [...uploaders][0];
  } else {
    delete node.u;
  }
}

/* 当 data/ 不完整（如 CI 或仅检出部分课件）跳过全量扫描时，
 * 仍用本地 git log 为已有 public/attachments/*.json 中的本仓库（r === 'self'）节点补全上传者 u。 */
function syncExistingManifestUploaders() {
  if (GIT_UPLOADERS.size === 0 || !existsSync(ATTACH_DIR)) return;
  let updated = 0;
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.c) {
        walk(node.c);
        stampFolderUploader(node);
      } else if (node.r === 'self' && node.sp) {
        const u = GIT_UPLOADERS.get(node.sp);
        if (u) node.u = u;
      }
    }
  };
  for (const name of readdirSync(ATTACH_DIR)) {
    if (!name.endsWith('.json')) continue;
    const file = join(ATTACH_DIR, name);
    const raw = readFileSync(file, 'utf8');
    let manifest;
    try {
      manifest = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!Array.isArray(manifest?.cats)) continue;
    for (const cat of manifest.cats) {
      if (Array.isArray(cat?.tree)) walk(cat.tree);
    }
    const next = JSON.stringify(manifest);
    if (next !== raw.trim()) {
      writeFileSync(file, next, 'utf8');
      updated += 1;
    }
  }
  if (updated > 0) {
    console.log(`[build-catalog] 已从 git log 同步 ${updated} 份附件清单的上传者信息`);
  }
}

/* 列出目录内容：目录在前、文件在后，各组内按中文序。 */
function listSorted(d) {
  return readdirSync(d)
    .map((name) => {
      const p = join(d, name);
      const st = statSync(p);
      return { name, p, st, dir: st.isDirectory() };
    })
    .sort((a, b) => (a.dir !== b.dir ? (a.dir ? -1 : 1) : sortName(a, b)));
}

/* 递归构建课程附件树。节点：目录 { n, p, c }，文件 { n, p, s }（p 为相对课程目录的 POSIX 路径）。
 * 顶层第一段目录名是类别（课件/试题/附件）则独立成组，其余全部归入「附件」。
 * rootKey 是资料根在仓库内的路径前缀（data / 补充资料），用于溯源键。 */
function buildCourseTree(dir, provKey, rootKey) {
  const roots = { 课件: [], 试题: [], 附件: [] };
  const fileNode = (name, rel, size) => {
    const node = { n: name, p: rel, s: size };
    // 文件清单.csv 只记录上游整理产物，补充资料一律按本仓库（self）溯源
    const prov = rootKey === 'data' ? PROVENANCE.get(`${provKey}/${rel}`) : undefined;
    const selfPath = `${rootKey}/${provKey}/${rel}`;
    if (prov) {
      node.r = prov.repo;
      node.sp = prov.src;
    } else if (rootKey === '补充资料') {
      // 补充资料带 sp（仓库内路径）与 git 历史无关：新加的文件即使还没提交也要能被
      // --supplement-only 认出来并替换，否则重新生成时会留下重复节点。
      node.r = 'self';
      node.sp = selfPath;
    } else if (GIT_UPLOADERS.has(selfPath)) {
      node.r = 'self';
      node.sp = selfPath;
    }
    if (node.r === 'self' && node.sp) {
      const uploader = GIT_UPLOADERS.get(node.sp);
      if (uploader) node.u = uploader;
    }
    return node;
  };
  // 单一来源文件夹：全体后代文件同仓库 → 记录 r/sp（sp 取仓库内目录路径），
  // 附件页据此生成 GitHub 目录跳转链接；混合来源文件夹无法指向单一仓库，不给跳转
  const stampFolder = (node) => {
    const repos = new Set();
    const collect = (x) => {
      if (x.c) x.c.forEach(collect);
      else repos.add(x.r ?? null);
    };
    node.c.forEach(collect);
    if (repos.size === 1 && !repos.has(null)) {
      const first = node.c.find((x) => !x.c && x.sp);
      if (first) {
        node.r = first.r;
        const i = first.sp.lastIndexOf('/');
        node.sp = i > 0 ? first.sp.slice(0, i) : '';
      }
    }
    stampFolderUploader(node);
  };
  // 上游仓库自带的说明文件（README*）不算课程附件——仅限课程目录/类别目录（课件/试题/附件）
  // 直属的那一层；实验工程等更深目录里的 ReadMe.txt 是课程内容，保留
  const isRepoMeta = (name, e) => /^readme/i.test(name) && relative(dir, e.p).replaceAll('\\', '/').split('/').length <= 2;
  const pushChildren = (d, siblings) => {
    for (const e of listSorted(d)) {
      const rel = relative(dir, e.p).replaceAll('\\', '/');
      if (e.dir) {
        const node = { n: e.name, p: rel, c: [] };
        pushChildren(e.p, node.c);
        stampFolder(node);
        siblings.push(node);
      } else if (isRepoMeta(e.name, e)) {
        continue;
      } else {
        siblings.push(fileNode(e.name, rel, e.st.size));
      }
    }
  };
  for (const e of listSorted(dir)) {
    const bucket = roots[CATS.includes(e.name) ? e.name : '附件'];
    if (e.dir) {
      const node = { n: e.name, p: e.name, c: [] };
      pushChildren(e.p, node.c);
      stampFolder(node);
      bucket.push(node);
    } else if (!isRepoMeta(e.name, e)) {
      bucket.push(fileNode(e.name, e.name, e.st.size));
    }
  }
  return roots;
}

/** 给节点（含全部后代）改名并在名字中加标记，用于同名文件/目录冲突时区分两份资料。 */
function renameNode(node, mark) {
  const oldP = node.p;
  const slash = oldP.lastIndexOf('/');
  const parentP = slash >= 0 ? oldP.slice(0, slash + 1) : '';
  const dot = node.n.lastIndexOf('.');
  const newName = dot > 0 ? `${node.n.slice(0, dot)}${mark}${node.n.slice(dot)}` : `${node.n}${mark}`;
  const newP = parentP + newName;
  const rewrite = (x) => {
    x.p = newP + x.p.slice(oldP.length);
    if (x.c) x.c.forEach(rewrite);
  };
  node.n = newName;
  rewrite(node);
}

/** 把补充资料树并入上游整理树：目录按相对路径对齐，同一文件名的两份都保留（补充资料加后缀）。 */
function mergeTree(baseNodes, extraNodes) {
  for (const extra of extraNodes) {
    const hit = baseNodes.find((x) => x.p === extra.p);
    if (!hit) {
      baseNodes.push(extra);
      continue;
    }
    if (hit.c && extra.c) {
      mergeTree(hit.c, extra.c);
    } else {
      renameNode(extra, '（本站补充）');
      baseNodes.push(extra);
    }
  }
}

/** 合并后重算目录节点的来源（单一来源才带 r/sp）与上传者标记，并恢复「目录在前、中文序」排序。 */
const sortNodes = (a, b) => (!!a.c !== !!b.c ? (a.c ? -1 : 1) : a.n.localeCompare(b.n, 'zh-Hans-CN'));

function restampTree(nodes) {
  for (const node of nodes) {
    if (!node.c) continue;
    restampTree(node.c);
    node.c.sort(sortNodes);
    const repos = new Set();
    const uploaders = new Set();
    const collect = (x) => {
      if (x.c) return x.c.forEach(collect);
      repos.add(x.r ?? null);
      uploaders.add(x.u ?? null);
    };
    node.c.forEach(collect);
    if (repos.size === 1 && !repos.has(null)) {
      const first = node.c.find((x) => !x.c && x.sp);
      if (first) {
        node.r = first.r;
        const i = first.sp.lastIndexOf('/');
        node.sp = i > 0 ? first.sp.slice(0, i) : '';
      }
    } else {
      delete node.r;
      delete node.sp;
    }
    if (uploaders.size === 1 && !uploaders.has(null)) {
      node.u = [...uploaders][0];
    } else {
      delete node.u;
    }
  }
}

/** 某学期下两个资料根里的课程并集（目录名去重、中文序）。 */
function listCourses(sem) {
  const names = new Set();
  for (const src of SOURCES) {
    const d = join(src.root, sem);
    if (!existsSync(d)) continue;
    for (const name of readdirSync(d)) {
      if (statSync(join(d, name)).isDirectory()) names.add(name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

/** catalog.ts 的完整源码（全量扫描与 --supplement-only 共用）。 */
function catalogSource(lines, totalFiles) {
  return `/* 【自动生成】由 scripts/build-catalog.mjs 扫描 data/ 与 补充资料/ 生成，请勿手改。
 * 共 ${lines.length} 门课程 / ${totalFiles} 份文件；增删资料后 npm run catalog 刷新。 */

export interface CatalogCourse {
  /** 学期文件夹名：大一上…大四下 */
  semester: string;
  /** 课程目录名（与整理文件夹一致） */
  name: string;
  /** 课件 / 试题 / 附件 文件数 */
  courseware: number;
  exams: number;
  misc: number;
  total: number;
}

export const catalog: CatalogCourse[] = [
${lines.join('\n')}
];
`;
}

/* ── --supplement-only：不依赖 data/ 的增量模式 ────────────────────────────
 * data/ 只在维护者本机存在（~8.4GB，不入库），外部贡献者与 CI 都只有入库的 补充资料/。
 * 全量扫描在缺少 data/ 时会被“课程数变少”的守卫拦下，所以这里改为：
 *   ① 以已提交的 catalog.ts 与 public/attachments/*.json 为底（去掉其中的补充资料节点）；
 *   ② 重新扫描 补充资料/ 并合并；
 *   ③ 只重写受影响的课程条目与附件清单。
 * 维护者本机即使有 data/ 也走同一路径，产物与全量扫描一致。
 *   node scripts/build-catalog.mjs --supplement-only
 *   node scripts/build-catalog.mjs --supplement-only --check   # 只校验生成物是否最新 */
const SUPPLEMENT_PREFIX = '补充资料/';
const CATALOG_LINE =
  /^\s*\{\s*semester:\s*("(?:[^"\\]|\\.)*"),\s*name:\s*("(?:[^"\\]|\\.)*"),\s*courseware:\s*(\d+),\s*exams:\s*(\d+),\s*misc:\s*(\d+),\s*total:\s*(\d+)\s*\},?\s*$/;
const courseKey = (semester, name) => `${semester}\u0000${name}`;
const isSupplementNode = (n) =>
  n.r === 'self' && typeof n.sp === 'string' && n.sp.startsWith(SUPPLEMENT_PREFIX);

function readCommittedCatalog() {
  if (!existsSync(OUT)) return [];
  const courses = [];
  for (const line of readFileSync(OUT, 'utf8').split(/\r?\n/)) {
    const m = line.match(CATALOG_LINE);
    if (!m) continue;
    courses.push({
      semester: JSON.parse(m[1]),
      name: JSON.parse(m[2]),
      courseware: Number(m[3]),
      exams: Number(m[4]),
      misc: Number(m[5]),
    });
  }
  return courses;
}

function loadCommittedManifest(semester, course) {
  const file = join(ATTACH_DIR, `${semester}__${course}.json`);
  if (!existsSync(file)) return null;
  try {
    const manifest = JSON.parse(readFileSync(file, 'utf8'));
    return Array.isArray(manifest?.cats) ? manifest : null;
  } catch {
    return null;
  }
}

/** 去掉只属于补充资料的节点：目录整枝是补充资料就整枝丢掉，混合目录保留并递归清理。 */
function pruneSupplementNodes(nodes) {
  const kept = [];
  for (const node of nodes) {
    if (isSupplementNode(node)) continue;
    if (node.c) {
      node.c = pruneSupplementNodes(node.c);
      if (node.c.length === 0) continue;
    }
    kept.push(node);
  }
  return kept;
}

function countLeaves(nodes) {
  let n = 0;
  const walk = (x) => (x.c ? x.c.forEach(walk) : (n += 1));
  nodes.forEach(walk);
  return n;
}

/** 递归收集节点上的上传者（u），用于在没有 git 历史（浅克隆）时沿用已提交的信息。 */
function collectUploaders(nodes, map) {
  for (const node of nodes) {
    if (node.c) collectUploaders(node.c, map);
    else if (node.sp && node.u) map.set(node.sp, node.u);
  }
}

function applyUploaders(nodes, map) {
  for (const node of nodes) {
    if (node.c) applyUploaders(node.c, map);
    else if (!node.u && node.sp && map.has(node.sp)) node.u = map.get(node.sp);
  }
}

/** 扫描 补充资料/<学期>/<课程>，返回 Map<课程键, { semester, name, trees }>。 */
function scanSupplement() {
  const found = new Map();
  if (!existsSync(SUPPLEMENT)) return found;
  for (const sem of SEMESTER_ORDER) {
    const semDir = join(SUPPLEMENT, sem);
    if (!existsSync(semDir)) continue;
    for (const name of readdirSync(semDir)) {
      const dir = join(semDir, name);
      if (!statSync(dir).isDirectory()) continue;
      found.set(courseKey(sem, name), {
        semester: sem,
        name,
        trees: buildCourseTree(dir, `${sem}/${name}`, '补充资料'),
      });
    }
  }
  return found;
}

/** 比较两份附件清单时忽略上传者（u 依赖 git 历史，浅克隆/新文件下会不同）。 */
function canonicalManifest(json) {
  const strip = (nodes) =>
    nodes.map(({ u, ...rest }) => ({ ...rest, ...(rest.c ? { c: strip(rest.c) } : {}) }));
  return JSON.stringify({
    ...json,
    cats: json.cats.map((cat) => ({ ...cat, tree: strip(cat.tree ?? []) })),
  });
}

function runSupplementOnly(check) {
  const entries = new Map();
  for (const c of readCommittedCatalog()) {
    const manifest = loadCommittedManifest(c.semester, c.name);
    entries.set(courseKey(c.semester, c.name), {
      semester: c.semester,
      name: c.name,
      counts: { 课件: c.courseware, 试题: c.exams, 附件: c.misc },
      trees: manifest
        ? Object.fromEntries(CATS.map((k) => [k, pruneSupplementNodes(manifest.cats.find((x) => x.name === k)?.tree ?? [])]))
        : null,
      dirty: false,
    });
  }

  const uploaderFallback = new Map();
  for (const e of entries.values()) {
    if (e.trees) CATS.forEach((k) => collectUploaders(e.trees[k], uploaderFallback));
  }

  for (const [key, extra] of scanSupplement()) {
    let e = entries.get(key);
    if (!e) {
      e = {
        semester: extra.semester,
        name: extra.name,
        counts: { 课件: 0, 试题: 0, 附件: 0 },
        trees: { 课件: [], 试题: [], 附件: [] },
        dirty: true,
      };
      entries.set(key, e);
    } else if (!e.trees) {
      console.warn(`[build-catalog] ${extra.semester}/${extra.name} 缺少已提交的附件清单，跳过该课程的补充资料合并`);
      continue;
    } else {
      e.dirty = true;
    }
    for (const k of CATS) {
      mergeTree(e.trees[k], extra.trees[k]);
      restampTree(e.trees[k]);
      applyUploaders(e.trees[k], uploaderFallback);
      e.trees[k].sort(sortNodes);
    }
    e.counts = { 课件: countLeaves(e.trees.课件), 试题: countLeaves(e.trees.试题), 附件: countLeaves(e.trees.附件) };
  }

  const ordered = [...entries.values()].sort(
    (a, b) =>
      SEMESTER_ORDER.indexOf(a.semester) - SEMESTER_ORDER.indexOf(b.semester) ||
      a.name.localeCompare(b.name, 'zh-Hans-CN'),
  );

  const lines = [];
  let totalFiles = 0;
  for (const e of ordered) {
    const total = e.counts.课件 + e.counts.试题 + e.counts.附件;
    totalFiles += total;
    lines.push(
      `  { semester: ${pad(e.semester)}, name: ${pad(e.name)}, courseware: ${e.counts.课件}, exams: ${e.counts.试题}, misc: ${e.counts.附件}, total: ${total} },`,
    );
  }
  const nextCatalog = catalogSource(lines, totalFiles);

  const changed = [];
  const same = (a, b) => a.replaceAll('\r\n', '\n') === b.replaceAll('\r\n', '\n');
  if (!existsSync(OUT) || !same(nextCatalog, readFileSync(OUT, 'utf8'))) changed.push(relative(REPO_ROOT, OUT).replaceAll('\\', '/'));

  const pending = [];
  for (const e of ordered) {
    if (!e.dirty || !e.trees) continue;
    const manifest = {
      semester: e.semester,
      course: e.name,
      cats: CATS.map((name) => ({ name, tree: e.trees[name] })),
      total: e.counts.课件 + e.counts.试题 + e.counts.附件,
    };
    const file = join(ATTACH_DIR, `${e.semester}__${e.name}.json`);
    const nextJson = JSON.stringify(manifest);
    const oldRaw = existsSync(file) ? readFileSync(file, 'utf8').trim() : '';
    const sameJson = oldRaw && canonicalManifest(JSON.parse(oldRaw)) === canonicalManifest(manifest);
    if (sameJson) continue;
    pending.push({ file, nextJson });
    changed.push(relative(REPO_ROOT, file).replaceAll('\\', '/'));
  }

  if (check) {
    if (changed.length === 0) {
      console.log('[build-catalog] 补充资料相关生成物均为最新');
      return;
    }
    console.error(`[build-catalog] 生成物不是最新，请运行 npm run catalog:supplement：\n  ${changed.join('\n  ')}`);
    process.exit(1);
  }

  if (changed.length === 0) {
    console.log('[build-catalog] 补充资料相关生成物均为最新，无需写入');
    return;
  }
  writeFileSync(OUT, nextCatalog, 'utf8');
  for (const { file, nextJson } of pending) writeFileSync(file, nextJson, 'utf8');
  console.log(`[build-catalog] 合并补充资料：${lines.length} 门课程 / ${totalFiles} 份文件，更新 ${changed.length} 个文件`);
}

if (process.argv.includes('--supplement-only')) {
  runSupplementOnly(process.argv.includes('--check'));
  process.exit(0);
}

if (!existsSync(MATERIALS) && !existsSync(SUPPLEMENT)) {
  syncExistingManifestUploaders();
  console.warn('[build-catalog] 未找到资料目录（data/ 与 补充资料/），跳过（保留现有 catalog.ts）');
  process.exit(0);
}

const found = new Set();
for (const src of SOURCES) {
  if (!existsSync(src.root)) continue;
  for (const d of readdirSync(src.root)) {
    if (statSync(join(src.root, d)).isDirectory()) found.add(d);
  }
}
// 只扫 8 个学期组；资料根下的四个上游仓库子模块等不属于学期目录，跳过
const semesters = SEMESTER_ORDER.filter((s) => found.has(s));
const skipped = [...found].filter((s) => !SEMESTER_ORDER.includes(s)).sort();
if (skipped.length) console.log(`[build-catalog] 跳过非学期目录（子模块等）: ${skipped.join(', ')}`);

// CI 上资料目录只有入库的说明文件 / 少量本站补充资料——此时不能生成空目录，保留已提交的 catalog.ts
if (semesters.length === 0) {
  if (existsSync(OUT)) {
    syncExistingManifestUploaders();
    console.warn('[build-catalog] 资料目录下无学期目录（CI 环境），跳过（保留现有 catalog.ts）');
    process.exit(0);
  }
  console.error('[build-catalog] 资料目录下无学期目录且无现有 catalog.ts，中止');
  process.exit(1);
}

// 只检出部分资料时（例如仓库仅跟踪本站补充资料），不能用不完整目录覆盖全站索引。
// 完整资料目录仍可正常扫描、生成新的课程总表与附件清单。
const existingCatalog = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
const knownCourses = (existingCatalog.match(/^\s*\{\s*semester:\s*"/gm) ?? []).length;
const presentCourses = semesters.reduce((count, sem) => count + listCourses(sem).length, 0);
if (knownCourses > presentCourses) {
  syncExistingManifestUploaders();
  console.warn(`[build-catalog] 仅发现 ${presentCourses}/${knownCourses} 门课程资料，保留已跟踪的静态索引`);
  process.exit(0);
}

const lines = [];
let totalFiles = 0;
const manifests = [];
for (const sem of semesters) {
  for (const course of listCourses(sem)) {
    const counts = { 课件: 0, 试题: 0, 附件: 0 };
    const trees = { 课件: [], 试题: [], 附件: [] };
    for (const src of SOURCES) {
      const dir = join(src.root, sem, course);
      if (!existsSync(dir)) continue;
      const c = countCourse(dir);
      for (const k of CATS) counts[k] += c[k];
      const t = buildCourseTree(dir, `${sem}/${course}`, src.key);
      for (const k of CATS) mergeTree(trees[k], t[k]);
    }
    for (const k of CATS) {
      restampTree(trees[k]);
      trees[k].sort(sortNodes);
    }
    const total = counts.课件 + counts.试题 + counts.附件;
    totalFiles += total;
    manifests.push({
      semester: sem,
      course,
      cats: CATS.map((name) => ({ name, tree: trees[name] })),
      total,
    });
    lines.push(
      `  { semester: ${pad(sem)}, name: ${pad(course)}, courseware: ${counts.课件}, exams: ${counts.试题}, misc: ${counts.附件}, total: ${total} },`,
    );
  }
}

const ts = catalogSource(lines, totalFiles);

/* 防误伤：data/ 里只要有零星课件（如 PR 误提交了某门课的几个 PDF），扫描结果就会只剩这一门课，
 * 直接覆盖会把已入库的完整目录缩成 1 门，附件清单也跟着只剩 1 份（CI 上就是这么把线上刷坏的）。
 * 因此「扫描到的课程数比现有 catalog.ts 少」一律跳过写入，确需缩小用 npm run catalog -- --force。
 * 只数课程条目行，不数接口里的 `semester: string`（否则现有数永远多 1，正常缩小也会被拦下）。 */
if (!process.argv.includes('--force') && existsSync(OUT)) {
  const existing = (readFileSync(OUT, 'utf8').match(/^\s*\{\s*semester:\s*"/gm) ?? []).length;
  if (existing > lines.length) {
    console.warn(
      `[build-catalog] 扫描到 ${lines.length} 门课，少于已入库的 ${existing} 门，跳过写入（data/ 可能不完整；确需缩小请加 --force）`,
    );
    process.exit(0);
  }
}

writeFileSync(OUT, ts, 'utf8');
console.log(`[build-catalog] ${lines.length} 门课程 / ${totalFiles} 份文件 → ${OUT}`);

// 附件清单：public/attachments/<学期>__<课程>.json（附件页运行时按需 fetch）
mkdirSync(ATTACH_DIR, { recursive: true });
for (const m of manifests) {
  const file = join(ATTACH_DIR, `${m.semester}__${m.course}.json`);
  writeFileSync(file, JSON.stringify(m), 'utf8');
}
console.log(`[build-catalog] 附件清单 ${manifests.length} 份 → ${ATTACH_DIR}`);
