import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconX } from '../../components/icons';
import PracticeCard from '../../components/practice/PracticeCard';
import { NET_BASE } from '../../courses/registry';
import { netChapters } from '../../content/net';
import type { PracticeQuestion } from '../../content/practice';
import type { NetHomeworkQuestion } from '../../content/net/homework';
import {
  homeworkId, loadHomeworkResults, NET_HOMEWORK_STORE_KEY,
  type HomeworkResult, type HomeworkResults,
} from './netHomeworkState';

/** 原文件答案为纯文本；转入网站可信 HTML 题卡前必须转义。 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** 按共享 PracticeQuestion 契约转换，不复制一套题卡 DOM/CSS。 */
function toPracticeQuestion(chapterNo: number, q: NetHomeworkQuestion): PracticeQuestion {
  const chapter = netChapters.find((item) => item.id === `ch${chapterNo}`);
  const knowledge = chapter?.toc.find((item) => item.id === q.related)?.text ?? '相关知识点';
  return {
    id: homeworkId(chapterNo, q.no),
    kind: 'essay',
    question: escapeHtml(q.title),
    answer: q.teacher ? `<p>${escapeHtml(q.teacher).replace(/\n/g, '<br />')}</p>` : q.reference,
    explanation: q.teacher ? q.reference : '',
    tags: [{ deck: chapterNo, sec: q.related, text: knowledge }],
  };
}

/** 章节课后习题直接使用所有课程公用的 PracticeCard。 */
export default function NetHomework({
  chapterNo,
  questions,
}: {
  chapterNo: number;
  questions: NetHomeworkQuestion[];
}) {
  const reducedMotion = useReducedMotion();
  const [results, setResults] = useState<HomeworkResults>(() => loadHomeworkResults());
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NET_HOMEWORK_STORE_KEY, JSON.stringify(results));
    } catch {
      /* 浏览器拒绝本地存储时，保留当前页面的交互能力 */
    }
  }, [results]);

  useEffect(() => {
    if (!confirmOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [confirmOpen]);

  const onResult = (id: string, result: HomeworkResult | null) => setResults((previous) => {
    const next = { ...previous };
    if (result === null) delete next[id];
    else next[id] = result;
    return next;
  });

  const chapterResults = questions.map((question) => results[homeworkId(chapterNo, question.no)]);
  const seen = chapterResults.filter(Boolean).length;
  const mastered = chapterResults.filter((result) => result === 'right').length;
  const revisit = chapterResults.filter((result) => result === 'wrong').length;

  const clearChapter = () => {
    setResults((previous) => {
      const next = { ...previous };
      questions.forEach((question) => delete next[homeworkId(chapterNo, question.no)]);
      return next;
    });
    setConfirmOpen(false);
  };

  const jumpToQuestion = (no: number) =>
    document.getElementById(`sec-ch${chapterNo}-hw-${no}`)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

  const tagNav = (tag: { deck: number; sec: string; text: string }) => ({
    href: `${NET_BASE}/deck/ch${tag.deck}?s=${tag.sec}`,
    tip: `跳转到 第 ${tag.deck} 章 · ${tag.text}`,
  });

  return (
    <section className="net-hw-section" aria-label={`第${chapterNo}章作业`}>
      <h2 id={`sec-ch${chapterNo}-homework`}>本章作业 · {questions.length} 题</h2>
      <p className="net-hw-intro">本章按原题编号整理。原文件答案按 PDF 文字转录；补充参考解析单独列示。可自评掌握情况，进度保存在当前浏览器。</p>
      {questions.length > 0 && (
        <div className="pq-progress material net-hw-progress">
          <div className="pq-progress-text">
            <span>
              本章进度：<span className="pq-frag">已查看 <b>{seen}</b> / {questions.length}</span> ·{' '}
              <span className="pq-frag">已掌握 <b>{mastered}</b> 题</span> ·{' '}
              <span className="pq-frag">需复习 <b>{revisit}</b> 题</span>
            </span>
            <button type="button" className="btn pq-danger" disabled={seen === 0} onClick={() => setConfirmOpen(true)}>
              清空本章进度
            </button>
          </div>
          <div className="pq-progress-bar" role="progressbar"
            aria-label={`第${chapterNo}章作业已查看进度`}
            aria-valuemin={0} aria-valuenow={seen} aria-valuemax={questions.length}>
            <span style={{ width: `${(seen / questions.length) * 100}%` }} />
          </div>
          <div className="pq-heat net-hw-heat">
            <div className="pq-heat-label"><span className="pq-heat-kind">本章题目</span><span>{seen}/{questions.length}</span></div>
            <div className="pq-heat-grid" aria-label="本章作业进度热力图">
              {questions.map((question) => {
                const result = results[homeworkId(chapterNo, question.no)];
                const stateText = result === 'right' ? '已掌握' : result === 'wrong' ? '需复习'
                  : result === 'revealed' ? '已看答案' : '未查看';
                return (
                  <button key={question.no} type="button" className="pq-heat-cell"
                    data-state={result ?? 'none'}
                    title={`第 ${question.no} 题 · ${stateText}`}
                    aria-label={`第 ${question.no} 题 ${stateText}`}
                    onClick={() => jumpToQuestion(question.no)} />
                );
              })}
            </div>
          </div>
        </div>
      )}
      {questions.length === 0 ? (
        <div className="net-hw-empty material">
          <p>本次提供的三份作业文件中<strong>没有单列第 {chapterNo} 章的作业</strong>，因此不将自编题误标为教师布置。</p>
          <p>可继续阅读本章 DNS、邮件协议和 HTTP，并用历年试卷自测。</p>
          <Link to={`${NET_BASE}/practice`}>前往在线练习</Link>
        </div>
      ) : questions.map((question) => {
        const id = homeworkId(chapterNo, question.no);
        const result = results[id];
        return (
          <PracticeCard
            key={id}
            quiz={toPracticeQuestion(chapterNo, question)}
            label={`简答 ${question.no}`}
            result={result}
            onResult={onResult}
            tagNav={tagNav}
            tagDeckKey={() => 'net'}
            essayOptions={{
              anchorId: `sec-ch${chapterNo}-hw-${question.no}`,
              revealLabel: '查看参考答案与解析',
              answerLabel: question.teacher ? '原文件答案（文字转录）' : '参考答案与解析',
              explanationLabel: '补充参考答案与解析',
              sourceNote: question.teacher ? undefined : '原作业文件未附教师答案；以下为独立编写的参考解答。',
              attention: question.attention,
              statusLabels: { right: '已掌握', wrong: '需复习', revealed: '已看答案' },
              review: { onChange: (value) => onResult(id, value) },
              onReset: () => onResult(id, null),
            }}
          />
        );
      })}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div className="hub-modal-scrim"
            initial={reducedMotion ? undefined : { opacity: 0 }} animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.16 }}
            onClick={() => setConfirmOpen(false)}>
            <motion.div className="hub-modal material" role="dialog" aria-modal="true"
              aria-label="清空本章进度"
              initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }} onClick={(event) => event.stopPropagation()}>
              <div className="hub-modal-head">
                <h2>清空本章进度</h2>
                <button type="button" className="icon-btn" onClick={() => setConfirmOpen(false)} aria-label="关闭">
                  <IconX size={16} />
                </button>
              </div>
              <p className="hub-modal-tip">清空第 {chapterNo} 章全部 {questions.length} 道题的查看与自评记录？其他章节不受影响。</p>
              <div className="hub-modal-actions">
                <button type="button" className="btn" onClick={() => setConfirmOpen(false)}>取消</button>
                <button type="button" className="btn pq-danger" onClick={clearChapter}>清空</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
