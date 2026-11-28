import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import CourseHubPage from './pages/CourseHubPage';
import CourseStubPage from './pages/CourseStubPage';
import { recordSiteVisit } from './lib/visits';
import { ALGO_BASE, OS_BASE, NET_BASE, PAT_BASE, AI_BASE, SA_BASE, PHYS_BASE, CA_BASE, MATH_BASE, PD_BASE, NCD_BASE, NAP_BASE, HD_BASE, MC_BASE, NLU_BASE, OSCD_BASE, CPD_BASE, NTR_BASE, CV_BASE, SPM_BASE, BD_BASE, CAP_BASE, AIE_BASE, SEC_BASE, DB_BASE, SE_BASE, ST_BASE, DP_BASE, SWT_BASE, DSD_BASE, IP_BASE, PY_BASE, DM_BASE, CM_BASE, PROB_BASE, ASM_BASE, EDA_BASE, RES_BASE, PHYS_LAB_BASE, JAVA_BASE, DL_BASE, ROBOT_BASE, DS_BASE, DSCD_BASE, LA_BASE, EE_BASE } from './courses/registry';
import { ErrataProvider } from './lib/errata/context';

/** 课程按需加载：首屏只载首页，进入课程时再拉取课程包 */
const AlgorithmCourse = lazy(() => import('./courses/AlgorithmCourse'));
const OsCourse = lazy(() => import('./courses/OsCourse'));
const NetworkCourse = lazy(() => import('./courses/NetworkCourse'));
const PatCourse = lazy(() => import('./courses/PatCourse'));
const AiCourse = lazy(() => import('./courses/AiCourse'));
const SaCourse = lazy(() => import('./courses/SaCourse'));
const PhysCourse = lazy(() => import('./courses/PhysCourse'));
const CaCourse = lazy(() => import('./courses/CaCourse'));
const MathCourse = lazy(() => import('./courses/MathCourse'));
const PdCourse = lazy(() => import('./courses/PdCourse'));
const NcdCourse = lazy(() => import('./courses/NcdCourse'));
const NapCourse = lazy(() => import('./courses/NapCourse'));
const HdCourse = lazy(() => import('./courses/HdCourse'));
const McCourse = lazy(() => import('./courses/McCourse'));
const NluCourse = lazy(() => import('./courses/NluCourse'));
const OscdCourse = lazy(() => import('./courses/OscdCourse'));
const CpdCourse = lazy(() => import('./courses/CpdCourse'));
const NtrCourse = lazy(() => import('./courses/NtrCourse'));
const CvCourse = lazy(() => import('./courses/CvCourse'));
const SpmCourse = lazy(() => import('./courses/SpmCourse'));
const BdCourse = lazy(() => import('./courses/BdCourse'));
const CapCourse = lazy(() => import('./courses/CapCourse'));
const AieCourse = lazy(() => import('./courses/AieCourse'));
const SecCourse = lazy(() => import('./courses/SecCourse'));
const DbCourse = lazy(() => import('./courses/DbCourse'));
const SeCourse = lazy(() => import('./courses/SeCourse'));
const StCourse = lazy(() => import('./courses/StCourse'));
const DpCourse = lazy(() => import('./courses/DpCourse'));
const SwtCourse = lazy(() => import('./courses/SwtCourse'));
const DsdCourse = lazy(() => import('./courses/DsdCourse'));
const IpCourse = lazy(() => import('./courses/IpCourse'));
const PyCourse = lazy(() => import('./courses/PyCourse'));
const DmCourse = lazy(() => import('./courses/DmCourse'));
const CmCourse = lazy(() => import('./courses/CmCourse'));
const ProbCourse = lazy(() => import('./courses/ProbCourse'));
const AsmCourse = lazy(() => import('./courses/AsmCourse'));
const EdaCourse = lazy(() => import('./courses/EdaCourse'));
const ResCourse = lazy(() => import('./courses/ResCourse'));
const PhyslabCourse = lazy(() => import('./courses/PhyslabCourse'));
const JavaCourse = lazy(() => import('./courses/JavaCourse'));
const DlCourse = lazy(() => import('./courses/DlCourse'));
const RobotCourse = lazy(() => import('./courses/RobotCourse'));
const DsCourse = lazy(() => import('./courses/DsCourse'));
const DscdCourse = lazy(() => import('./courses/DscdCourse'));
const LaCourse = lazy(() => import('./courses/LaCourse'));
const EeCourse = lazy(() => import('./courses/EeCourse'));
/** 大二下 12 门课共用入口：再按课程前缀加载各自的数据包 */
const D2XCourse = lazy(() => import('./courses/D2XCourse'));
/** 学习通题库（毛概背题）：不走课程外壳，首页「学习通题库」栏接入 */
const QuizCourse = lazy(() => import('./pages/quiz/QuizCourse'));

/** 旧版单课程链接 → /algo/*（历史收藏与外链不失效） */
function LegacyDeckRedirect() {
  const { deckId } = useParams();
  return <Navigate to={`${ALGO_BASE}/deck/${deckId}`} replace />;
}

/**
 * 站点层路由：只做「首页 + 各课程前缀 → 课程根组件 + 旧链接重定向」。
 * 每门课程是自包含布局（自带导航栏），在这里以一条 Route 接入。
 */
export default function App() {
  const { pathname } = useLocation();
  // 双色光晕只属于首页；课程页用纯色空白底，不沿用首页的装饰背景
  const isHub = pathname === '/';

  // 每次打开站点上报一次访问（首页数字行展示累计/今日访问量；未配置数据库时静默跳过）
  useEffect(() => {
    void recordSiteVisit();
  }, []);

  return (
    <>
      {/* 双色光晕背景：仅首页最底层（CSS 在 base.css） */}
      {isHub && <div className="bg-aura" aria-hidden="true" />}
      <Suspense fallback={null}>
      <ErrataProvider>
      <Routes>
        <Route path="/" element={<CourseHubPage />} />
        <Route path={`${ALGO_BASE}/*`} element={<AlgorithmCourse />} />
        <Route path={`${OS_BASE}/*`} element={<OsCourse />} />
        <Route path={`${NET_BASE}/*`} element={<NetworkCourse />} />
        <Route path={`${PAT_BASE}/*`} element={<PatCourse />} />
        <Route path={`${AI_BASE}/*`} element={<AiCourse />} />
        <Route path={`${SA_BASE}/*`} element={<SaCourse />} />
        <Route path={`${PHYS_BASE}/*`} element={<PhysCourse />} />
        <Route path={`${CA_BASE}/*`} element={<CaCourse />} />
        <Route path={`${MATH_BASE}/*`} element={<MathCourse />} />
        <Route path={`${PD_BASE}/*`} element={<PdCourse />} />
        <Route path={`${NCD_BASE}/*`} element={<NcdCourse />} />
        <Route path={`${NAP_BASE}/*`} element={<NapCourse />} />
        <Route path={`${HD_BASE}/*`} element={<HdCourse />} />
        <Route path={`${MC_BASE}/*`} element={<McCourse />} />
        <Route path={`${NLU_BASE}/*`} element={<NluCourse />} />
        <Route path={`${OSCD_BASE}/*`} element={<OscdCourse />} />
        <Route path={`${CPD_BASE}/*`} element={<CpdCourse />} />
        <Route path={`${NTR_BASE}/*`} element={<NtrCourse />} />
        <Route path={`${CV_BASE}/*`} element={<CvCourse />} />
        <Route path={`${SPM_BASE}/*`} element={<SpmCourse />} />
        <Route path={`${BD_BASE}/*`} element={<BdCourse />} />
        <Route path={`${CAP_BASE}/*`} element={<CapCourse />} />
        <Route path={`${AIE_BASE}/*`} element={<AieCourse />} />
        <Route path={`${SEC_BASE}/*`} element={<SecCourse />} />
        <Route path={`${DB_BASE}/*`} element={<DbCourse />} />
        <Route path={`${SE_BASE}/*`} element={<SeCourse />} />
        <Route path={`${ST_BASE}/*`} element={<StCourse />} />
        <Route path={`${DP_BASE}/*`} element={<DpCourse />} />
        <Route path={`${SWT_BASE}/*`} element={<SwtCourse />} />
        <Route path={`${DSD_BASE}/*`} element={<DsdCourse />} />
        <Route path={`${IP_BASE}/*`} element={<IpCourse />} />
        <Route path={`${PY_BASE}/*`} element={<PyCourse />} />
        <Route path={`${DM_BASE}/*`} element={<DmCourse />} />
        <Route path={`${CM_BASE}/*`} element={<CmCourse />} />
        <Route path={`${PROB_BASE}/*`} element={<ProbCourse />} />
        <Route path={`${ASM_BASE}/*`} element={<AsmCourse />} />
        <Route path={`${EDA_BASE}/*`} element={<EdaCourse />} />
        <Route path={`${RES_BASE}/*`} element={<ResCourse />} />
        <Route path={`${PHYS_LAB_BASE}/*`} element={<PhyslabCourse />} />
        <Route path={`${JAVA_BASE}/*`} element={<JavaCourse />} />
        <Route path={`${DL_BASE}/*`} element={<DlCourse />} />
        <Route path={`${ROBOT_BASE}/*`} element={<RobotCourse />} />
        <Route path={`${DS_BASE}/*`} element={<DsCourse />} />
        <Route path={`${DSCD_BASE}/*`} element={<DscdCourse />} />
        <Route path={`${LA_BASE}/*`} element={<LaCourse />} />
        <Route path={`${EE_BASE}/*`} element={<EeCourse />} />
        {/* 学习通题库（七门课背题，共用一套课程页） */}
        <Route path="/quiz/:slug/*" element={<QuizCourse />} />
        {/* 旧链接兼容：/maogai → /quiz/maogai */}
        <Route path="/maogai" element={<Navigate to="/quiz/maogai" replace />} />
        <Route path="/maogai/*" element={<Navigate to="/quiz/maogai" replace />} />
        {/* 大二下 12 门课：按 URL 首段分发到同一套课程外壳（数据各自按需加载） */}
        <Route path="/:courseKey/*" element={<D2XCourse />} />
        <Route path="/course/:name/*" element={<CourseStubPage />} />
        <Route path="/deck/:deckId" element={<LegacyDeckRedirect />} />
        <Route path="/practice" element={<Navigate to={`${ALGO_BASE}/practice`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrataProvider>
      </Suspense>
    </>
  );
}
