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

/** 历年题按实际知识内容定位，而非仅平移章节编号；独立课外内容仍链接原讲义。 */
const practiceTagOverrides: Record<string, PracticeQuestion['tags']> = {
  "p1-s3": [
    {
      "deck": 3,
      "sec": "sec-ch3-supp-atm",
      "text": "ATM（拓展）"
    }
  ],
  "p1-e2": [
    {
      "deck": 8,
      "sec": "sec-ch8-src-ftp",
      "text": "FTP 文件传送"
    }
  ],
  "p1-e3": [
    {
      "deck": 3,
      "sec": "sec-ch3-supp-adsl",
      "text": "ADSL（拓展）"
    }
  ],
  "p1-e5": [
    {
      "deck": 8,
      "sec": "sec-ch8-supp-smtp",
      "text": "SMTP（拓展）"
    }
  ],
  "p1-e6": [
    {
      "deck": 6,
      "sec": "sec-ch6-supp-ipv6",
      "text": "IPv6 过渡技术（拓展）"
    }
  ],
  "p1-e8": [
    {
      "deck": 1,
      "sec": "sec-ch1-supp-security",
      "text": "网络安全（拓展）"
    }
  ],
  "p2-e5": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-mac",
      "text": "MAC 地址"
    },
    {
      "deck": 6,
      "sec": "sec-ch6-src-mac",
      "text": "IP 与 MAC 地址"
    }
  ],
  "p2-e8": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-vlan",
      "text": "VLAN"
    }
  ],
  "p2-f8": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-traditional",
      "text": "10BASE-T"
    },
    {
      "deck": 5,
      "sec": "sec-ch5-src-fast",
      "text": "100BASE-TX"
    }
  ],
  "p2-f10": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-traditional",
      "text": "10BASE-T"
    }
  ],
  "p2-f13": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-vlan",
      "text": "VLAN 划分"
    },
    {
      "deck": 5,
      "sec": "sec-ch5-supp-vlan-modes",
      "text": "静态与动态 VLAN（补充）"
    }
  ],
  "p2-f14": [
    {
      "deck": 6,
      "sec": "sec-ch6-src-services",
      "text": "IP 数据报服务"
    }
  ],
  "p2-s4": [
    {
      "deck": 2,
      "sec": "sec-ch2-src-pdu",
      "text": "对等层与协议数据单元"
    }
  ],
  "p2-s7": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-lan",
      "text": "局域网特点"
    }
  ],
  "p2-s10": [
    {
      "deck": 5,
      "sec": "sec-ch5-supp-csma",
      "text": "CSMA 三种坚持策略（补充）"
    }
  ],
  "p2-s16": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-vlan",
      "text": "VLAN"
    }
  ],
  "p3-s3": [
    {
      "deck": 3,
      "sec": "sec-ch3-src-modulation",
      "text": "调制与解调"
    }
  ],
  "p3-s7": [
    {
      "deck": 2,
      "sec": "sec-ch2-src-pdu",
      "text": "各层 PDU"
    },
    {
      "deck": 4,
      "sec": "sec-ch4-src-basic",
      "text": "帧"
    }
  ],
  "p3-s9": [
    {
      "deck": 3,
      "sec": "sec-ch3-src-modulation",
      "text": "数字调制"
    }
  ],
  "p3-s10": [
    {
      "deck": 3,
      "sec": "sec-ch3-src-modulation",
      "text": "数字数据的模拟调制"
    }
  ],
  "p3-s11": [
    {
      "deck": 6,
      "sec": "sec-ch6-src-services",
      "text": "IP 数据报服务"
    }
  ],
  "p3-s19": [
    {
      "deck": 6,
      "sec": "sec-ch6-supp-bgp",
      "text": "BGP（拓展）"
    }
  ],
  "p3-e3": [
    {
      "deck": 3,
      "sec": "sec-ch3-src-capacity",
      "text": "奈氏准则与香农公式"
    }
  ],
  "p3-e6": [
    {
      "deck": 1,
      "sec": "sec-ch1-src-performance",
      "text": "发送与传播时延"
    },
    {
      "deck": 1,
      "sec": "sec-ch1-src-switch",
      "text": "存储转发"
    }
  ],
  "p3-e7": [
    {
      "deck": 4,
      "sec": "sec-ch4-src-window",
      "text": "滑动窗口"
    },
    {
      "deck": 4,
      "sec": "sec-ch4-src-sw",
      "text": "停止等待"
    },
    {
      "deck": 4,
      "sec": "sec-ch4-src-arq",
      "text": "GBN"
    },
    {
      "deck": 4,
      "sec": "sec-ch4-src-srp",
      "text": "SRP"
    }
  ],
  "p1-s9": [
    {
      "deck": 5,
      "sec": "sec-ch5-supp-forwarding",
      "text": "全双工端口与转发（补充）"
    }
  ],
  "p1-s13": [
    {
      "deck": 6,
      "sec": "sec-ch6-src-subnet",
      "text": "子网划分"
    },
    {
      "deck": 6,
      "sec": "sec-ch6-supp-subnet-legacy",
      "text": "旧式子网约定"
    }
  ],
  "p1-e9": [
    {
      "deck": 6,
      "sec": "sec-ch6-src-subnet",
      "text": "子网划分"
    },
    {
      "deck": 6,
      "sec": "sec-ch6-supp-subnet-legacy",
      "text": "旧式子网约定"
    }
  ],
  "p1-e13": [
    {
      "deck": 6,
      "sec": "sec-ch6-src-subnet",
      "text": "子网划分"
    },
    {
      "deck": 6,
      "sec": "sec-ch6-supp-subnet-legacy",
      "text": "旧式子网约定"
    }
  ],
  "p2-f4": [
    {
      "deck": 2,
      "sec": "sec-ch2-src-tcpip",
      "text": "网际层协议"
    },
    {
      "deck": 2,
      "sec": "sec-ch2-supp-rarp",
      "text": "RARP 与相关协议（补充）"
    }
  ],
  "p2-f9": [
    {
      "deck": 3,
      "sec": "sec-ch3-supp-cabling",
      "text": "双绞线连接（补充）"
    }
  ],
  "p2-f12": [
    {
      "deck": 5,
      "sec": "sec-ch5-supp-forwarding",
      "text": "交换机三种转发方式（补充）"
    }
  ],
  "p2-e9": [
    {
      "deck": 5,
      "sec": "sec-ch5-src-extend",
      "text": "共享与交换式以太网"
    },
    {
      "deck": 5,
      "sec": "sec-ch5-supp-fddi",
      "text": "FDDI（补充）"
    }
  ],
  "p3-e4": [
    {
      "deck": 6,
      "sec": "sec-ch6-supp-planes",
      "text": "数据平面与控制平面（补充）"
    },
    {
      "deck": 6,
      "sec": "sec-ch6-src-forward",
      "text": "IP 分组转发"
    }
  ],
  "p3-s14": [
    {
      "deck": 7,
      "sec": "sec-ch7-src-congestion",
      "text": "快重传与快恢复"
    },
    {
      "deck": 7,
      "sec": "sec-ch7-supp-reno",
      "text": "Reno 与 Tahoe（补充）"
    }
  ]
};

/** 将旧版试卷知识点标签转换为 2025 版八章，保证原有题号/答案不变。 */
function remapQuestion(question: PracticeQuestion): PracticeQuestion {
  return {
    ...question,
    tags: practiceTagOverrides[question.id] ?? question.tags.map((tag) => {
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
