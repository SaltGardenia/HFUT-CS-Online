import AttachmentCourse from '../components/course/AttachmentCourse';

/** 纯附件课程 —— 挂在 /java/* 下，首页兜底到附件页 */
export default function JavaCourse() {
  return <AttachmentCourse base="/java" tip="Java技术 · 实验指导与上机源码" />;
}
