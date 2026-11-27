import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '../../components/icons';
import ThemeToggle from '../../components/ThemeToggle';
import AccountButton from '../../components/AccountButton';
import { recordCourseView } from '../../lib/recentCourses';

const MaoQuizHome = lazy(() => import('./MaoQuizHome'));
const MaoQuizSession = lazy(() => import('./MaoQuizSession'));
const MaoQuizBook = lazy(() => import('./MaoQuizBook'));

/**
 * 学习通题库 · 毛概 —— 背题应用，不走课程外壳（无导航栏）。
 * 顶栏同占位页：返回胶囊 + 课程名，右侧全局控件；课程主题色走 html[data-deck='maogai']。
 */
export default function MaoQuiz() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHome = pathname === '/maogai';

  useEffect(() => {
    document.documentElement.dataset.deck = 'maogai';
    // 记入「最近查看」：首页收藏区/最近区按课程名解析（QUESTION_BANK_ROUTES 兜底）
    recordCourseView('毛概');
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  return (
    <div className="hub-shell mq-shell">
      <header className="hub-topbar">
        <div className="hub-nav-left">
          <button
            className="topbar-ctl nav-pill"
            onClick={() => navigate(onHome ? '/' : '/maogai')}
            aria-label={onHome ? '返回站点首页' : '退出答题，返回毛概总览'}
            title={onHome ? '返回站点首页' : '退出答题'}
          >
            <span className="icon-btn">
              <IconArrowLeft size={18} />
            </span>
          </button>
          <span className="hub-brand">毛概</span>
        </div>
        <div className="hub-topbar-right">
          <div className="topbar-ctl nav-pill">
            <ThemeToggle />
          </div>
          <AccountButton />
        </div>
      </header>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<MaoQuizHome />} />
          <Route path="quiz/:mode" element={<MaoQuizSession />} />
          <Route path="book/:kind" element={<MaoQuizBook />} />
          <Route path="*" element={<Navigate to="/maogai" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
