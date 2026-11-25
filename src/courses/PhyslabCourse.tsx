import CourseShell from '../components/course/CourseShell';
import { physlabConfig } from '../content/physlab/config';

/** 「大学物理实验」课程根组件 —— 挂在 /physlab/* 下，版式由共享 CourseShell 统一提供 */
export default function PhyslabCourse() {
  return <CourseShell config={physlabConfig} />;
}
