/** 信息安全技术课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 信息安全技术的一个章（课件 6 份 PDF：第 1～4、6、7 章，原课程无第 5 章 PDF） */
export type SecChapter = DeckData;
