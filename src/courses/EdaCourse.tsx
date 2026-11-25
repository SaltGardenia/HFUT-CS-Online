import CourseShell from '../components/course/CourseShell';
import { edaConfig } from '../content/eda/config';

/** 「EDA实训」课程根组件 —— 挂在 /eda/* 下，版式由共享 CourseShell 统一提供 */
export default function EdaCourse() {
  return <CourseShell config={edaConfig} />;
}
