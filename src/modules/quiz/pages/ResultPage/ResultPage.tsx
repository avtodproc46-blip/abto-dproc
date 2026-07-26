import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import type { QuizResultModel } from '../../types/quiz-model.type';
import './result-page.css';

export function ResultPage() {
  const location = useLocation();
  const result = location.state as QuizResultModel | null;

  if (!result) {
    return (
      <section className="panel result-page">
        <p>Արդյունքի տվյալներ չկան։</p>
        <Link to="/tests">
          <Button>Դեպի թեստեր</Button>
        </Link>
      </section>
    );
  }

  return (
    <section
      className={`panel result-page ${result.isPassed ? 'is-pass' : 'is-fail'}`}
    >
      <p className="result-page__eyebrow">
        {result.mode === 'ticket' ? 'Թեստ' : 'Պատահական քննություն'}
      </p>
      <h1>{result.isPassed ? 'Անցել ես ✔' : 'Չես անցել ✖'}</h1>
      <p className="result-page__score">
        {result.correctCount}/{result.totalCount}
      </p>
      <p className="muted">
        Անցման շեմ՝ 18/20 · Ժամանակ՝ {Math.floor(result.durationSeconds / 60)}:
        {String(result.durationSeconds % 60).padStart(2, '0')}
      </p>
      <div className="row">
        <Link to="/tests">
          <Button>Բոլոր թեստերը</Button>
        </Link>
        <Link to="/">
          <Button variant="ghost">Գլխավոր</Button>
        </Link>
      </div>
    </section>
  );
}
