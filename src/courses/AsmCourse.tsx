import CourseShell from '../components/course/CourseShell';
import { asmConfig } from '../content/asm/config';

/** 「汇编语言程序设计」课程根组件 —— 挂在 /asm/* 下，版式由共享 CourseShell 统一提供 */
export default function AsmCourse() {
  return <CourseShell config={asmConfig} />;
}
