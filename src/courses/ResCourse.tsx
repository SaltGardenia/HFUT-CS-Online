import CourseShell from '../components/course/CourseShell';
import { resConfig } from '../content/res/config';

/** 「科研训练」课程根组件 —— 挂在 /res/* 下，版式由共享 CourseShell 统一提供 */
export default function ResCourse() {
  return <CourseShell config={resConfig} />;
}
