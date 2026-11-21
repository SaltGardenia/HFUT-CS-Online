/** 软件测试课程内容汇总：第 1～7、9、10 章课件精讲（原课程无第 8 章文件）+ 1 份试卷在线练习 */
import type { StChapter, StQuizKind } from './types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch9 from './ch9';
import ch10 from './ch10';
import paperSt2020a from './paper-st-2020a';

export type { StChapter, StQuestion, StPaper, StPaperSection, StQuizKind, StTag } from './types';
export type { DeckData, Section, TocEntry, Block, QuizData } from './types';

/** 九章课件精讲（deck 编号 1～7、9、10 与原课件一致，无第 8 章） */
export const stChapters: StChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch9, ch10];

/** 1 份试卷 */
export const stPapers = [paperSt2020a];

/** 题型标签（与算法课/OS 课一致） */
export const ST_KIND_LABEL: Record<StQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};
