import bankJson from './bank.json';

/** 毛概题库题目（来源：学习通题库，data/chaoxing-bank/毛概/ 清洗归一后的契约） */
export interface MaoQuestion {
  /** 题目 ID：MG-N（maogai_full）/ HGD-n（智慧马院独有） */
  id: string;
  /** 数据来源题库 */
  source: 'maogai_full' | 'hgdmy';
  kind: 'single' | 'multiple' | 'judge' | 'fill';
  question: string;
  /** 选择/判断题选项文本；判断题固定 ['正确', '错误']；填空题为 [] */
  options: string[];
  /** 选择题 = 正确项下标数组（零基）；判断题 = [0|1]；填空题 = 答案文本 */
  answer: number[] | string;
  /** 教材章节（导论 ~ 第八章）；智慧马院补入题无章节信息为 null */
  chapter: string | null;
  /** 解析（本库暂无，保留字段） */
  explanation: string;
}

/** 题库（1151 题，构建期整包导入，随课程路由懒加载；清洗库字段为 type，对齐为 kind） */
const rawBank = bankJson as unknown as (Omit<MaoQuestion, 'kind'> & { type: MaoQuestion['kind'] })[];
export const maoBank: MaoQuestion[] = rawBank.map(({ type, ...rest }) => ({ ...rest, kind: type }));

/** 章节顺序（与题库 chapter 取值一一对应） */
export const MAO_CHAPTERS = ['导论', '第一章', '第二章', '第三章', '第四章', '第五章', '第六章', '第七章', '第八章'] as const;

/** 题型展示名（固定顺序） */
export const MAO_KINDS = [
  { kind: 'single', label: '单选' },
  { kind: 'multiple', label: '多选' },
  { kind: 'judge', label: '判断' },
  { kind: 'fill', label: '填空' },
] as const;

export type MaoKind = MaoQuestion['kind'];

export const maoKindLabel = (k: MaoKind): string =>
  MAO_KINDS.find((x) => x.kind === k)?.label ?? '题目';

/** 题型权重（间隔增幅修正）：填空（拼写式作答）置信度最高拉得最长；判断题两选项易蒙最低 */
export const MAO_KIND_WEIGHTS: Record<MaoKind, number> = { single: 1, multiple: 0.9, judge: 0.8, fill: 1.2 };

/** 判断题的选项统一在展示层给出（题库 judge 题已归一为下标答案） */
export const JUDGE_OPTIONS = ['正确', '错误'];

/** 题目展示用选项列表：填空题为空，其余取题库选项 */
export const optionsOf = (q: MaoQuestion): string[] => (q.kind === 'fill' ? [] : q.options);
