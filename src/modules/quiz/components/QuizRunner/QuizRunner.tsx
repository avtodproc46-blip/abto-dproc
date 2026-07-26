import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import { createAttempt } from '../../api/attempts.api';
import { checkAnswer } from '../../../exams/api/exams.api';
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

export function QuizRunner({ session, user: _user, testId }: Props) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, number>>(
    {},
  );
  const [revealed, setRevealed] = useState(false);
  const [checking, setChecking] = useState(false);
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

    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const questionIds = session.question.map((q) => q.id);
    const answers = Object.entries(selected).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      answerId,
    }));

    try {
      const attempt = await createAttempt({
        testId,
        mode: session.mode,
        questionIds,
        answers,
        durationSeconds,
      });

      const result: QuizResultModel = {
        correctCount: attempt.correctCount,
        totalCount: attempt.totalCount,
        isPassed: attempt.isPassed,
        mode: session.mode,
        testId,
        durationSeconds,
      };

      navigate('/quiz/result', { state: result, replace: true });
    } catch {
      setFinishing(false);
    }
  }

  async function onSelect(answerId: number) {
    if (revealed || checking || !question) return;
    setChecking(true);
    try {
      const result = await checkAnswer(question.id, answerId);
      setSelected((prev) => ({ ...prev, [question.id]: answerId }));
      setCorrectAnswers((prev) => ({
        ...prev,
        [question.id]: result.correctAnswerId,
      }));
      setRevealed(true);
    } finally {
      setChecking(false);
    }
  }

  function goNext() {
    if (index >= total - 1) {
      void finishQuiz();
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setRevealed(Boolean(selected[session.question[nextIndex]?.id]));
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
        <Button variant="ghost" onClick={() => void finishQuiz()} disabled={finishing}>
          Ավարտել
        </Button>
      </div>

      <QuestionCard
        index={index}
        total={total}
        question={question}
        selectedAnswerId={selected[question.id] ?? null}
        correctAnswerId={correctAnswers[question.id] ?? null}
        revealed={revealed}
        onSelect={(id) => void onSelect(id)}
      />

      <div className="quiz-runner__actions row">
        <Button
          variant="ghost"
          disabled={index === 0}
          onClick={() => {
            const prevIndex = Math.max(0, index - 1);
            setIndex(prevIndex);
            setRevealed(Boolean(selected[session.question[prevIndex]?.id]));
          }}
        >
          Նախորդ
        </Button>
        <Button
          onClick={goNext}
          disabled={!selected[question.id] || checking || finishing}
        >
          {index >= total - 1 ? 'Ավարտել թեստը' : 'Հաջորդ'}
        </Button>
      </div>
    </div>
  );
}
