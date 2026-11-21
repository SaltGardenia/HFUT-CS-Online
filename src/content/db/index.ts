/** 数据库系统课程内容汇总：第1～9章课件精讲 + 实验环境 + 5 份试卷在线练习 */
import type { DbChapter, DbQuizKind } from './types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';
import ch9 from './ch9';
import lab from './lab';
import paperDb2015 from './paper-db2015';
import paperDb2019a from './paper-db2019a';
import paperDb2019b from './paper-db2019b';
import paperDb2022a from './paper-db2022a';
import paperDb2023b from './paper-db2023b';

export type { DbChapter, DbQuestion, DbPaper, DbPaperSection, DbQuizKind, DbTag } from './types';
export type { DeckData, Section, TocEntry, Block, QuizData } from './types';

/** 九章课件精讲 + 实验环境（lab 排在末位，不占章号；练习标签的 deck 始终映射 ch1～ch9） */
export const dbChapters: DbChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, lab];

/** 5 份历年试卷（按年份升序） */
export const dbPapers = [paperDb2015, paperDb2019a, paperDb2019b, paperDb2022a, paperDb2023b];

/** 题型标签（与算法课/OS 课一致） */
export const DB_KIND_LABEL: Record<DbQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};
