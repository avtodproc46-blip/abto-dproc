import { apiPost } from '../../../shared/api/api-client';
import type { ExamMode } from '../../quiz/types/quiz-model.type';

export type CreateAttemptPayload = {
  testId?: number;
  mode: ExamMode;
  questionIds: number[];
  answers: Array<{ questionId: number; answerId: number }>;
  durationSeconds?: number;
};

export type AttemptResultModel = {
  id: number;
  userId: number;
  testId: number | null;
  mode: ExamMode;
  correctCount: number;
  totalCount: number;
  isPassed: boolean;
  durationSeconds: number | null;
  createdAt: string;
};

export function createAttempt(payload: CreateAttemptPayload) {
  return apiPost<AttemptResultModel>('/attempts', payload);
}
