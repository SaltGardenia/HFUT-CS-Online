import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import type { CourseSpec } from '../content/courses/types';
import CourseShell from './CourseShell';

/** 大二下 12 门课：按 URL 首段（/comp、/co …）按需加载各自的课程数据 */
const loaders: Record<string, () => Promise<CourseSpec>> = {
  comp: () => import('../content/courses/comp').then((m) => m.compSpec),
  co: () => import('../content/courses/co').then((m) => m.coSpec),
  emb: () => import('../content/courses/emb').then((m) => m.embSpec),
  ml: () => import('../content/courses/ml').then((m) => m.mlSpec),
  ste: () => import('../content/courses/ste').then((m) => m.steSpec),
  comb: () => import('../content/courses/comb').then((m) => m.combSpec),
  cg: () => import('../content/courses/attachments').then((m) => m.cgSpec),
  sma: () => import('../content/courses/attachments').then((m) => m.smaSpec),
  dmt: () => import('../content/courses/attachments').then((m) => m.dmtSpec),
  np: () => import('../content/courses/attachments').then((m) => m.npSpec),
  micro: () => import('../content/courses/attachments').then((m) => m.microSpec),
  het: () => import('../content/courses/attachments').then((m) => m.hetSpec),
};

/**
 * 大二下课程路由分发器 —— 一条动态路由接入 12 门课，
 * 每门课的数据单独打包，进入课程时才拉取；未知前缀回首页。
 */
export default function D2XCourse() {
  const { courseKey = '' } = useParams();
  // 记录「数据属于哪个 key」：切换课程的首帧必须为空，否则外壳会带着上一门课的数据渲染，
  // 嵌套 Routes 的 location base 与新 URL 错位（React Router 会报 base 不匹配）。
  const [loaded, setLoaded] = useState<{ key: string; spec: CourseSpec } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load = loaders[courseKey];
    if (!load) {
      setFailed(true);
      return;
    }
    setFailed(false);
    let alive = true;
    load()
      .then((s) => {
        if (alive) setLoaded({ key: courseKey, spec: s });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [courseKey]);

  if (failed) return <Navigate to="/" replace />;
  if (!loaded || loaded.key !== courseKey) return null;
  return <CourseShell key={loaded.spec.key} spec={loaded.spec} />;
}
