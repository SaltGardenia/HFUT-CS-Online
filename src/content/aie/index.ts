/** 人工智能经济学课程内容汇总：第 1～8 章课件精讲（试题未收录，不设在线练习） */
import type { AieChapter } from './types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';

export type { AieChapter } from './types';
export type { DeckData, Section, TocEntry, Block, QuizData } from './types';

/** 八章课件精讲（deck 编号 1～8 与原课件一致） */
export const aieChapters: AieChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8];
