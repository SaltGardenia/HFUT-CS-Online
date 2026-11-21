/** 软件工程课程内容汇总：第1～13章课件精讲 + 课程设计示范 + 2 份试卷在线练习 */
import type { SeChapter, SeQuizKind } from './types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';
import ch9 from './ch9';
import ch10 from './ch10';
import ch11 from './ch11';
import ch12 from './ch12';
import ch13 from './ch13';
import cd from './cd';
import paperSe2019a from './paper-se2019a';
import paperSequiz2026 from './paper-sequiz2026';

export type { SeChapter, SeQuestion, SePaper, SePaperSection, SeQuizKind, SeTag } from './types';
export type { DeckData, Section, TocEntry, Block, QuizData } from './types';

/** 十三章课件精讲 + 课程设计（cd 排在末位，不占章号；练习标签的 deck 1～13 映射 ch1～ch13，14 映射 cd） */
export const seChapters: SeChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12, ch13, cd];

/** 2 份试卷（按时间升序） */
export const sePapers = [paperSe2019a, paperSequiz2026];

/** 题型标签（与算法课/OS 课一致） */
export const SE_KIND_LABEL: Record<SeQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};
