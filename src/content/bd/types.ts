/** 大数据处理技术课程的数据契约 —— 讲次页复用上游的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 大数据处理技术课程的课件（作业.pptx 单页） */
export type BdDeck = DeckData;
