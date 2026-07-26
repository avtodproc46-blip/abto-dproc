import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRandomExam } from '../../../exams/api/exams.api';
import { loadStoredUser } from '../../../users/api/user-storage';
import { QuizRunner } from '../../components/QuizRunner/QuizRunner';
import type { ExamSessionModel } from '../../types/quiz-model.type';

export function RandomExamPage() {
  const user = loadStoredUser();
  const [session, setSession] = useState<ExamSessionModel | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRandomExam()
      .then(setSession)
      .catch(() => setError('Չհաջողվեց կազմել պատահական քննությունը'));
  }, []);

  if (!user) {
    return (
      <p className="muted">
        Նախ մուտք գործիր <Link to="/">գլխավոր էջում</Link>
      </p>
    );
  }

  if (error) return <p className="muted">{error}</p>;
  if (!session) return <p className="muted">Կազմում ենք 20 հարց...</p>;

  return <QuizRunner session={session} user={user} />;
}
