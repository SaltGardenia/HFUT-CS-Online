/** 信息安全技术课程内容汇总：第 1～4、6、7 章课件精讲（课件无第 5 章 PDF；试题未收录，不设在线练习） */
import type { SecChapter } from './types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch6 from './ch6';
import ch7 from './ch7';

export type { SecChapter } from './types';
export type { DeckData, Section, TocEntry, Block, QuizData } from './types';

/** 六章课件精讲（deck 编号与原课件章号一致：1、2、3、4、6、7） */
export const secChapters: SecChapter[] = [ch1, ch2, ch3, ch4, ch6, ch7];
