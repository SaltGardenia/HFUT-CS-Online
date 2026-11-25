import CourseShell from '../components/course/CourseShell';
import { dmConfig } from '../content/dm/config';

/** 「离散数学」课程根组件 —— 挂在 /dm/* 下，版式由共享 CourseShell 统一提供 */
export default function DmCourse() {
  return <CourseShell config={dmConfig} />;
}
