import AttachmentCourse from '../components/course/AttachmentCourse';

/** 纯附件课程 —— 挂在 /dl/* 下，首页兜底到附件页 */
export default function DlCourse() {
  return <AttachmentCourse base="/dl" tip="数字逻辑 · 实验指导、习题答案与教材" />;
}
