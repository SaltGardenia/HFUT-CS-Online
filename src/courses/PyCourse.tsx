import CourseShell from '../components/course/CourseShell';
import { pyConfig } from '../content/py/config';

/** 「Python 程序设计」课程根组件 —— 挂在 /py/* 下，版式由共享 CourseShell 统一提供 */
export default function PyCourse() {
  return <CourseShell config={pyConfig} />;
}
