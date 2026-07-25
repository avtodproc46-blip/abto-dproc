import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTicketExam } from '../../../exams/api/exams.api';
import { loadStoredUser } from '../../../users/api/user-storage';
import { QuizRunner } from '../../components/QuizRunner/QuizRunner';
import type { ExamSessionModel } from '../../types/quiz-model.type';

export function TicketQuizPage() {
  const { testId } = useParams();
  const user = loadStoredUser();
  const [session, setSession] = useState<ExamSessionModel | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!testId) return;
    fetchTicketExam(Number(testId))
      .then(setSession)
      .catch(() => setError('Не удалось загрузить билет'));
  }, [testId]);

  if (!user) {
    return (
      <p className="muted">
        Сначала выбери пользователя на <Link to="/">главной</Link>
      </p>
    );
  }

  if (error) return <p className="muted">{error}</p>;
  if (!session) return <p className="muted">Загрузка билета...</p>;

  return (
    <QuizRunner session={session} user={user} testId={Number(testId)} />
  );
}
