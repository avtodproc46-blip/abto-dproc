import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import { createAttempt } from '../../api/attempts.api';
import { QuestionCard } from '../QuestionCard/QuestionCard';
import { QuizTimer } from '../QuizTimer/QuizTimer';
import type { ExamSessionModel, QuizResultModel } from '../../types/quiz-model.type';
import type { UserModel } from '../../../users/types/user-model.type';
import './quiz-runner.css';

type Props = {
  session: ExamSessionModel;
  user: UserModel;
  testId?: number;
};

export function QuizRunner({ session, user, testId }: Props) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(session.timerSeconds);
  const [startedAt] = useState(() => Date.now());
  const [finishing, setFinishing] = useState(false);

  const question = session.question[index];
  const total = session.question.length;

  const answeredCount = useMemo(
    () => Object.keys(selected).length,
    [selected],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && !finishing) {
      void finishQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  async function finishQuiz() {
    if (finishing) return;
    setFinishing(true);

    let correctCount = 0;
    for (const q of session.question) {
      const answerId = selected[q.id];
      const answer = q.answers.find((a) => a.id === answerId);
      if (answer?.isTrue) correctCount += 1;
    }

    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const isPassed = correctCount >= session.passScore;

    await createAttempt({
      userId: user.id,
      testId,
      mode: session.mode,
      correctCount,
      totalCount: total,
      isPassed,
      durationSeconds,
    });

    const result: QuizResultModel = {
      correctCount,
      totalCount: total,
      isPassed,
      mode: session.mode,
      testId,
      durationSeconds,
    };

    navigate('/quiz/result', { state: result, replace: true });
  }

  function onSelect(answerId: number) {
    if (revealed || !question) return;
    setSelected((prev) => ({ ...prev, [question.id]: answerId }));
    setRevealed(true);
  }

  function goNext() {
    if (index >= total - 1) {
      void finishQuiz();
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  if (!question) return null;

  return (
    <div className="quiz-runner stack">
      <div className="quiz-runner__bar row">
        <QuizTimer secondsLeft={secondsLeft} />
        <span className="muted">
          Պատասխանված՝ {answeredCount}/{total} · անցում՝ {session.passScore}/
          {total}
        </span>
        <Button variant="ghost" onClick={() => void finishQuiz()}>
          Ավարտել
        </Button>
      </div>

      <QuestionCard
        index={index}
        total={total}
        question={question}
        selectedAnswerId={selected[question.id] ?? null}
        revealed={revealed}
        onSelect={onSelect}
      />

      <div className="quiz-runner__actions row">
        <Button
          variant="ghost"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setRevealed(Boolean(selected[session.question[index - 1]?.id]));
          }}
        >
          Նախորդ
        </Button>
        <Button onClick={goNext} disabled={!selected[question.id]}>
          {index >= total - 1 ? 'Ավարտել թեստը' : 'Հաջորդ'}
        </Button>
      </div>
    </div>
  );
}
