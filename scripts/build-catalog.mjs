/* 扫描 data/ 生成两份生成物：
 * ① src/content/catalog.ts —— 课程目录数据（课程页与首页共用）；
 * ② public/attachments/<学期>__<课程>.json —— 各课程附件清单（附件页左目录树 / 右预览用）。
 * 目录结构契约见 data/整理说明.md：<学期>/<课程>/{课件,试题,附件}/**。
 * 只读目录名、文件名与文件大小，不读取文件内容。生成物随提交入库，运行时零 IO。 */
import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const MATERIALS = join(ROOT, '..', 'data');
const OUT = join(ROOT, '..', 'src', 'content', 'catalog.ts');
const ATTACH_DIR = join(ROOT, '..', 'public', 'attachments');

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
 * 顶层第一段目录名是类别（课件/试题/附件）则独立成组，其余全部归入「附件」。 */
function buildCourseTree(dir, provKey) {
  const roots = { 课件: [], 试题: [], 附件: [] };
  const fileNode = (name, rel, size) => {
    const node = { n: name, p: rel, s: size };
    const prov = PROVENANCE.get(`${provKey}/${rel}`);
    if (prov) {
      node.r = prov.repo;
      node.sp = prov.src;
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

if (!existsSync(MATERIALS)) {
  console.warn(`[build-catalog] 未找到资料目录 ${MATERIALS}，跳过（保留现有 catalog.ts）`);
  process.exit(0);
}

const found = readdirSync(MATERIALS).filter((d) => statSync(join(MATERIALS, d)).isDirectory());
// 只扫 9 个学期组；data/ 下的四个上游仓库子模块不属于学期目录，跳过
const semesters = SEMESTER_ORDER.filter((s) => found.includes(s));
const skipped = found.filter((s) => !SEMESTER_ORDER.includes(s)).sort();
if (skipped.length) console.log(`[build-catalog] 跳过非学期目录（子模块等）: ${skipped.join(', ')}`);

// CI 上 data/ 目录存在但只有入库的说明文件（课件本体被 gitignore）——此时不能生成空目录，保留已提交的 catalog.ts
if (semesters.length === 0) {
  if (existsSync(OUT)) {
    console.warn('[build-catalog] data/ 下无学期目录（CI 环境），跳过（保留现有 catalog.ts）');
    process.exit(0);
  }
  console.error('[build-catalog] data/ 下无学期目录且无现有 catalog.ts，中止');
  process.exit(1);
}

// 只检出部分资料时（例如仓库仅跟踪新增 2025 课件），不能用不完整 data/ 覆盖全站索引。
// 完整资料目录仍可正常扫描、生成新的课程总表与附件清单。
const existingCatalog = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
const knownCourses = (existingCatalog.match(/^\s*\{\s*semester:\s*"/gm) ?? []).length;
const presentCourses = semesters.reduce((count, sem) => count +
  readdirSync(join(MATERIALS, sem))
    .filter((course) => statSync(join(MATERIALS, sem, course)).isDirectory()).length, 0);
if (knownCourses > presentCourses) {
  console.warn(`[build-catalog] 仅发现 ${presentCourses}/${knownCourses} 门课程资料，保留已跟踪的静态索引`);
  process.exit(0);
}

const lines = [];
let totalFiles = 0;
const manifests = [];
for (const sem of semesters) {
  const courses = readdirSync(join(MATERIALS, sem))
    .filter((c) => statSync(join(MATERIALS, sem, c)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  for (const course of courses) {
    const base = join(MATERIALS, sem, course);
    const counts = countCourse(base);
    const total = counts.课件 + counts.试题 + counts.附件;
    totalFiles += total;
    const tree = buildCourseTree(base, `${sem}/${course}`);
    manifests.push({
      semester: sem,
      course,
      cats: ['课件', '试题', '附件'].map((name) => ({ name, tree: tree[name] })),
      total,
    });
    lines.push(
      `  { semester: ${pad(sem)}, name: ${pad(course)}, courseware: ${counts.课件}, exams: ${counts.试题}, misc: ${counts.附件}, total: ${total} },`,
    );
  }
}

const ts = `/* 【自动生成】由 scripts/build-catalog.mjs 扫描 data/ 生成，请勿手改。
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

/* 防误伤：data/ 里只要有零星课件（如 PR 误提交了某门课的几个 PDF），扫描结果就会只剩这一门课，
 * 直接覆盖会把已入库的完整目录缩成 1 门，附件清单也跟着只剩 1 份（CI 上就是这么把线上刷坏的）。
 * 因此「扫描到的课程数比现有 catalog.ts 少」一律跳过写入，确需缩小用 npm run catalog -- --force。 */
if (!process.argv.includes('--force') && existsSync(OUT)) {
  const existing = (readFileSync(OUT, 'utf8').match(/semester:/g) ?? []).length;
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
