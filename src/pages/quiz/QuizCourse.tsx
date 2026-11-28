import { lazy, Suspense, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft } from '../../components/icons';
import ThemeToggle from '../../components/ThemeToggle';
import AccountButton from '../../components/AccountButton';
import { recordCourseView } from '../../lib/recentCourses';
import { findQuizCourse } from '../../content/quizbank';

const QuizHome = lazy(() => import('./QuizHome'));
const QuizSession = lazy(() => import('./QuizSession'));
const QuizBook = lazy(() => import('./QuizBook'));

/**
 * 学习通题库课程页（七门课共用）。
 * 不走课程外壳（无导航栏）：顶栏同占位页——返回胶囊 + 课程名胶囊；主题色沿用题库家族色（data-deck='maogai'）。
 */
export default function QuizCourse() {
  const { slug } = useParams();
  const course = findQuizCourse(slug);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHome = pathname === `/quiz/${slug}`;

  useEffect(() => {
    document.documentElement.dataset.deck = 'maogai';
    if (course) recordCourseView(course.name);
    return () => {
      delete document.documentElement.dataset.deck;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!course) return <Navigate to="/" replace />;

  return (
    <div className="hub-shell mq-shell">
      <header className="hub-topbar">
        {/* 与课程页顶栏一致：返回胶囊 + 课程名胶囊 */}
        <div className="hub-nav-left">
          <button
            className="topbar-ctl nav-pill"
            onClick={() => navigate(onHome ? '/' : `/quiz/${slug}`)}
            aria-label={onHome ? '返回站点首页' : '退出答题，返回课程总览'}
            title={onHome ? '返回站点首页' : '退出答题'}
          >
            <span className="icon-btn">
              <IconArrowLeft size={18} />
            </span>
          </button>
          <Link to={`/quiz/${slug}`} className="topbar-ctl nav-pill topbar-title" title={`${course.name} · 学习通题库`}>
            {course.name}
          </Link>
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
          <Route index element={<QuizHome course={course} />} />
          <Route path="quiz/:mode" element={<QuizSession course={course} />} />
          <Route path="book/:kind" element={<QuizBook course={course} />} />
          <Route path="*" element={<Navigate to={`/quiz/${slug}`} replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
