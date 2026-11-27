import { useEffect, useState } from 'react';
import type { SearchIndexItem } from '../components/SearchBox';
import { courses } from '../courses/registry';

/** 与附件页共用的清单结构（public/attachments/<学期>__<课程名>.json，npm run catalog 生成） */
interface AttNode {
  n: string;
  p: string;
  c?: AttNode[];
}

interface AttManifest {
  cats: { name: string; tree: AttNode[] }[];
}

/**
 * 纯附件课程的搜索索引：课件/试题都不在本站页面里，课程内容就是附件清单，
 * 把类别名与全部目录/文件名摊平成条目；清单在首次进入课程时异步拉取。
 * 有章节/试卷的课程传 enabled=false 跳过拉取，避免多余的附件请求。
 * 命中跳 `${base}/attachments?f=<路径>`，由附件页展开目录并定位。
 */
export function useAttachmentSearchIndex(base: string, enabled = true): SearchIndexItem[] {
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  useEffect(() => {
    if (!enabled) return;
    const course = courses.find((c) => c.base === base);
    if (!course) return;
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}attachments/${course.semester}__${course.name}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<AttManifest>;
      })
      .then((m) => {
        if (!alive) return;
        const next: SearchIndexItem[] = [];
        for (const cat of m.cats) {
          const unitTitle = `附件 · ${cat.name}`;
          const walk = (nodes: AttNode[]) => {
            for (const node of nodes) {
              next.push({ kind: '附件', unit: null, unitTitle, sectionId: node.p, text: node.n });
              if (node.c) walk(node.c);
            }
          };
          walk(cat.tree);
        }
        setItems(next);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [base, enabled]);
  return items;
}
