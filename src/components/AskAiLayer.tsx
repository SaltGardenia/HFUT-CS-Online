import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { courses } from '../courses/registry';
import { createAskAiController } from '../lib/askAi';

/** 章节页事后挂载「问问 AI」按钮：所有课程共用一套，不绑定具体课程组件。 */
export default function AskAiLayer() {
  const { pathname, search } = useLocation();
  // 计网的复习模式在 hash 查询串里（view=main/supplement/extra），切换时需重建按钮
  const view = new URLSearchParams(search).get('view') ?? '';

  useEffect(() => {
    const course = courses.find((c) => pathname === c.base || pathname.startsWith(c.base + '/'))?.name ?? '';
    const controller = createAskAiController(course);
    controller.scan();
    // 懒加载课程包 / 路由转场结束后再补扫几次；页面标题是静态的，不需要长期观察 DOM
    const timers = [60, 160, 400, 900, 1600].map((ms) => window.setTimeout(controller.scan, ms));
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      controller.destroy();
    };
  }, [pathname, view]);

  return null;
}
