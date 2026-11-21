/** 人工智能经济学课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 人工智能经济学的一个章（课件 8 章，按「节」组织） */
export type AieChapter = DeckData;
