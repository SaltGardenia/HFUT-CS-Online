import AttachmentCourse from '../components/course/AttachmentCourse';

/** 纯附件课程 —— 挂在 /robot/* 下，首页兜底到附件页 */
export default function RobotCourse() {
  return <AttachmentCourse base="/robot" tip="机器人技术 · RoboCup 2D 实验与项目资料" />;
}
