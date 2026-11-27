import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader';

const MaoQuizHome = lazy(() => import('./MaoQuizHome'));
const MaoQuizSession = lazy(() => import('./MaoQuizSession'));

/**
 * 学习通题库 · 毛概 —— 背题应用，不走课程外壳（无导航栏）。
 * 顶栏只保留站点品牌与全局控件；课程主题色走 html[data-deck='maogai']。
 */
export default function MaoQuiz() {
  useEffect(() => {
    document.documentElement.dataset.deck = 'maogai';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  return (
    <div className="hub-shell mq-shell">
      <SiteHeader />
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<MaoQuizHome />} />
          <Route path="quiz/:mode" element={<MaoQuizSession />} />
          <Route path="*" element={<Navigate to="/maogai" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
