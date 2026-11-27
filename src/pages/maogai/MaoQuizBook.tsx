import { Link, useParams } from 'react-router-dom';
import { maoBank } from '../../content/maogai';
import { gradeCard } from '../../lib/maoquiz';
import { setQMark } from '../../lib/sync/local';
import { useCourseQMarks } from '../../lib/sync';
import QuestionCard from './QuestionCard';

const MAO_COURSE = 'maogai';

/**
 * 毛概错题本 / 收藏本（账在 hb-qmarks:maogai，与其他课程的两本账同约定）。
 * 卡片可重做：作答照常进艾宾浩斯调度；答错的题自动回到错题本。
 */
export default function MaoQuizBook() {
  const { kind } = useParams();
  const book = kind === 'fav' ? 'fav' : 'wrong';
  const marks = useCourseQMarks(MAO_COURSE);

  // 按标记时间倒序：最近出错 / 最近收藏的在前
  const entries = maoBank
    .filter((q) => marks[book][q.id]?.on)
    .sort((a, b) => (marks[book][b.id]?.t ?? 0) - (marks[book][a.id]?.t ?? 0));

  const title = book === 'wrong' ? '错题本' : '收藏本';

  return (
    <main className="mq-main">
      <div className="mq-head">
        <h1>{title}</h1>
        <p>毛概 · {entries.length} 题</p>
      </div>

      {entries.length === 0 ? (
        <div className="mq-center mq-empty-page">
          <p className="mq-empty">{book === 'wrong' ? '还没有答错的题。' : '还没有收藏的题——答题时点右上角星标即可收藏。'}</p>
          <Link className="btn" to="/maogai">返回总览</Link>
        </div>
      ) : (
        <div className="mq-book-list">
          {entries.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              onGrade={(good, elapsedMs) => {
                gradeCard(q.id, good, elapsedMs, q.kind);
                if (!good) setQMark(MAO_COURSE, 'wrong', q.id, true);
                else if (book === 'wrong') setQMark(MAO_COURSE, 'wrong', q.id, false);
              }}
              fav={{
                on: !!marks.fav[q.id]?.on,
                onToggle: () => setQMark(MAO_COURSE, 'fav', q.id, !marks.fav[q.id]?.on),
              }}
              cornerAction={book === 'wrong'
                ? { label: '移出错题本', onClick: () => setQMark(MAO_COURSE, 'wrong', q.id, false) }
                : { label: '取消收藏', onClick: () => setQMark(MAO_COURSE, 'fav', q.id, false) }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
