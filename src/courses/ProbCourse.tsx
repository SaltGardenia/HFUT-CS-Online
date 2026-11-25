import CourseShell from '../components/course/CourseShell';
import { probConfig } from '../content/prob/config';

/** 「概率论与数理统计」课程根组件 —— 挂在 /prob/* 下，版式由共享 CourseShell 统一提供 */
export default function ProbCourse() {
  return <CourseShell config={probConfig} />;
}
