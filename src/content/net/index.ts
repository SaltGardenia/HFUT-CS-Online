/* 计算机网络 · 2025 课件八章索引。旧版第4章中独立划出局域网，其余章保留已有知识内容。 */
import type { DeckData, NetPaper, PracticeQuestion } from './types';
import home from './home';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import oldCh4 from './ch4';
import lan from './ch5-lan';
import oldCh5 from './ch5';
import oldCh6 from './ch6';
import oldCh7 from './ch7';
import { netHomework } from './homework';
import { enrichNetworkChapter } from './enhance';
import { alignNetworkChapterToSlides } from './ppt-order';
import paper2021 from './paper-2021';
import paper2022 from './paper-2022';
import paper2024 from './paper-2024';

export type { NetPaper } from './types';
export const netHome: DeckData = home;

/** 保留原稿文件与旧题号，仅把路由、锚点和目录统一映射到 2025 版章节。 */
function shiftChapter(chapter: DeckData, from: number, to: number): DeckData {
  const src = `sec-ch${from}-`;
  const dest = `sec-ch${to}-`;
  const shift = (value: string) => value.replaceAll(src, dest);
  return {
    ...chapter,
    id: `ch${to}`,
    no: `第${to}章`,
    subtitle: `第 ${to} 章 · ${chapter.title}`,
    lede: shift(chapter.lede),
    toc: chapter.toc.map((item) => ({ ...item, id: shift(item.id) })),
    sections: chapter.sections.map((section) => ({
      ...section,
      id: shift(section.id),
      blocks: section.blocks.map((block) =>
        block.type === 'html' ? { ...block, html: shift(block.html) } : block,
      ),
    })),
  };
}

/** 旧第4章后两节内容归入 2025 第5章，避免在两章重复出现。 */
const dataLink: DeckData = {
  ...oldCh4,
  toc: oldCh4.toc.filter((item) => !/^sec-ch4-(broadcast|evolve)/.test(item.id)),
  sections: oldCh4.sections.filter((section) => !/^sec-ch4-(broadcast|evolve)/.test(section.id)),
};

const chapterMaterial: DeckData[] = [
  ch1, ch2, ch3, dataLink, lan,
  shiftChapter(oldCh5, 5, 6),
  shiftChapter(oldCh6, 6, 7),
  shiftChapter(oldCh7, 7, 8),
];
export const netChapters: DeckData[] = chapterMaterial.map((chapter, index) => {
  const chapterNo = index + 1;
  const questions = netHomework[chapterNo] ?? [];
  const ordered = alignNetworkChapterToSlides(chapter, chapterNo, oldCh5);
  const enriched = enrichNetworkChapter(ordered, chapterNo);
  return {
    ...enriched,
    toc: [
      ...enriched.toc,
      { id: `sec-ch${chapterNo}-homework`, text: `本章作业（${questions.length}题）`, level: 2 },
      ...questions.map((q) => ({
        id: `sec-ch${chapterNo}-hw-${q.no}`,
        text: `作业题 ${q.no}`,
        level: 3 as const,
      })),
    ],
  };
});

/** 将 2024 版试卷知识点标签转换为 2025 版八章，保证原有题号/答案不变。 */
function remapQuestion(question: PracticeQuestion): PracticeQuestion {
  return {
    ...question,
    tags: question.tags.map((tag) => {
      const old = tag.deck;
      const movedLan = old === 4 && /^sec-ch4-(broadcast|evolve)/.test(tag.sec);
      const target = movedLan ? 5 : old >= 5 ? old + 1 : old;
      const sec = target === old ? tag.sec : tag.sec.replaceAll(`sec-ch${old}-`, `sec-ch${target}-`);
      return { ...tag, deck: target, sec };
    }),
  };
}

export const netPapers: NetPaper[] = [paper2021, paper2022, paper2024].map((paper) => ({
  ...paper,
  questions: paper.questions.map(remapQuestion),
}));
export const netAllQuestions: PracticeQuestion[] = netPapers.flatMap((p) => p.questions);
export function findNetPaper(id: string): NetPaper | undefined {
  return netPapers.find((paper) => paper.id === id);
}
