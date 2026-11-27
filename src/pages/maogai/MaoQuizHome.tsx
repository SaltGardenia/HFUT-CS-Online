import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { maoBank, MAO_CHAPTERS, MAO_KINDS, type MaoKind } from '../../content/maogai';
import { GRADUATED, useMaoState, countsOf, resetMaoState } from '../../lib/maoquiz';
import { useCourseQMarks } from '../../lib/sync';
import ClearProgress from '../../components/practice/ClearProgress';

const DAY = 86_400_000;
/** 到期曲线展示的天数（含今天） */
const FORECAST_DAYS = 14;
const MAO_COURSE = 'maogai';

/** 大数字统计块 */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="mq-stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

export default function MaoQuizHome() {
  const navigate = useNavigate();
  const state = useMaoState();
  const marks = useCourseQMarks(MAO_COURSE);

  const now = Date.now();
  const stats = useMemo(() => countsOf(maoBank, state, now), [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const bookCount = (kind: 'fav' | 'wrong') =>
    Object.values(marks[kind]).filter((m) => m.on).length;
  const wrongCount = bookCount('wrong');
  const favCount = bookCount('fav');

  // 未来 14 天到期曲线：第 0 天是今天
  const forecast = useMemo(() => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const days = Array.from({ length: FORECAST_DAYS }, (_, i) => ({
      t: start.getTime() + i * DAY,
      n: 0,
    }));
    for (const id of Object.keys(state.cards)) {
      const rec = state.cards[id];
      if (rec.s >= GRADUATED || rec.s === 0) continue;
      for (const d of days) {
        if (rec.due >= d.t && rec.due < d.t + DAY) {
          d.n += 1;
          break;
        }
      }
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // 章节进度：导论 ~ 第八章 + 未归类
  const chapters = useMemo(() => {
    const rows = [...MAO_CHAPTERS.map((c) => ({ name: c, total: 0, learned: 0, graduated: 0 })), { name: '未归类', total: 0, learned: 0, graduated: 0 }];
    const byName = new Map(rows.map((r) => [r.name, r]));
    for (const q of maoBank) {
      const row = byName.get(q.chapter ?? '未归类');
      if (!row) continue;
      row.total += 1;
      const rec = state.cards[q.id];
      if (rec && rec.s >= 1) {
        row.learned += 1;
        if (rec.s >= GRADUATED) row.graduated += 1;
      }
    }
    return rows.filter((r) => r.total > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // 题型进度（已学会 = 至少进入复习阶段）
  const kinds = useMemo(() => {
    return MAO_KINDS.map(({ kind, label }) => {
      const bank = maoBank.filter((q) => q.kind === (kind as MaoKind));
      const done = bank.filter((q) => (state.cards[q.id]?.s ?? 0) >= 1).length;
      return { kind, label, total: bank.length, done };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const peak = Math.max(1, ...forecast.map((d) => d.n));
  const learnable = stats.fresh + stats.learning;
  const dayLabel = (t: number, i: number) => {
    if (i === 0) return '今天';
    if (i === 1) return '明天';
    const d = new Date(t);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <main className="mq-main">
      <div className="mq-head">
        <h1>毛概</h1>
        <p>毛泽东思想和中国特色社会主义理论体系概论 · 学习通题库 {maoBank.length} 题</p>
      </div>

      {/* 总进度 + 一键清空（与其他课程练习页同款） */}
      <div className="pq-progress">
        <div className="pq-progress-text">
          <span>
            总进度：已学 <b>{stats.learned}</b> / {stats.total} ·{' '}
            <span className="pq-frag">已掌握 <b>{stats.graduated}</b> 题</span>
          </span>
          <ClearProgress
            done={stats.learned}
            onClear={resetMaoState}
            tip="清空毛概全部背题进度、复习排期与两本账？"
          />
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={stats.learned} aria-valuemax={stats.total}>
          <span style={{ width: `${(stats.learned / stats.total) * 100}%` }} />
        </div>
      </div>

      {/* 总览数字 */}
      <div className="mq-stats">
        <Stat label="总题量" value={stats.total} />
        <Stat label="已学" value={stats.learned} />
        <Stat label="待复习" value={stats.due} />
        <Stat label="已掌握" value={stats.graduated} />
      </div>

      {/* 四个入口：学习 / 复习 / 错题本 / 收藏本 */}
      <div className="mq-modes">
        <button
          type="button"
          className="mq-mode"
          disabled={learnable === 0}
          onClick={() => navigate('/maogai/quiz/learn')}
        >
          <b>学习模式</b>
          <span>{learnable > 0 ? `背新题 ${stats.fresh} · 学习中 ${stats.learning}` : '全部学会'}</span>
        </button>
        <button
          type="button"
          className="mq-mode"
          disabled={stats.due === 0}
          onClick={() => navigate('/maogai/quiz/review')}
        >
          <b>复习模式</b>
          <span>{stats.due > 0 ? `到期 ${stats.due} 题` : '暂无到期卡'}</span>
        </button>
        <button type="button" className="mq-mode" onClick={() => navigate('/maogai/book/wrong')}>
          <b>错题本</b>
          <span>{wrongCount > 0 ? `${wrongCount} 题待重做` : '还没有错题'}</span>
        </button>
        <button type="button" className="mq-mode" onClick={() => navigate('/maogai/book/fav')}>
          <b>收藏本</b>
          <span>{favCount > 0 ? `${favCount} 题` : '答题时点星标收藏'}</span>
        </button>
      </div>

      {/* 未来 14 天到期曲线 */}
      <section className="mq-card">
        <h2>复习到期（未来 {FORECAST_DAYS} 天）</h2>
        <div className="mq-chart" role="img" aria-label="未来十四天每天到期题数">
          {forecast.map((d, i) => (
            <div key={d.t} className="mq-col">
              <span className="mq-col-n">{d.n > 0 ? d.n : ''}</span>
              <div className="mq-bar-track">
                <div className="mq-bar" style={{ height: `${(d.n / peak) * 100}%` }} data-now={i === 0 || undefined} />
              </div>
              <span className="mq-col-x">{dayLabel(d.t, i)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 章节进度 */}
      <section className="mq-card">
        <h2>章节进度</h2>
        <div className="mq-rows">
          {chapters.map((c) => (
            <div key={c.name} className="mq-row">
              <span className="mq-row-name">{c.name}</span>
              <div className="mq-row-track">
                <i style={{ width: `${(c.graduated / c.total) * 100}%` }} className="mq-seg-done" />
                <i style={{ width: `${((c.learned - c.graduated) / c.total) * 100}%` }} className="mq-seg-learn" />
              </div>
              <span className="mq-row-n">{c.learned}/{c.total}</span>
            </div>
          ))}
        </div>
        <p className="mq-legend">
          <i className="mq-seg-done" />已掌握 <i className="mq-seg-learn" />学习中 <i className="mq-seg-todo" />未学
        </p>
      </section>

      {/* 题型进度 */}
      <section className="mq-card">
        <h2>题型进度</h2>
        <div className="mq-rows">
          {kinds.map((k) => (
            <div key={k.kind} className="mq-row">
              <span className="mq-row-name">{k.label}</span>
              <div className="mq-row-track">
                <i style={{ width: `${(k.done / k.total) * 100}%` }} className="mq-seg-learn" />
              </div>
              <span className="mq-row-n">{k.done}/{k.total}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
