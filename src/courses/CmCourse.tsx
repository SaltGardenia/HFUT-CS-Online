import CourseShell from '../components/course/CourseShell';
import { cmConfig } from '../content/cm/config';

/** 「计算方法」课程根组件 —— 挂在 /cm/* 下，版式由共享 CourseShell 统一提供 */
export default function CmCourse() {
  return <CourseShell config={cmConfig} />;
}
