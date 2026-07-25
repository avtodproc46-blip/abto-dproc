import { apiPost } from '../../../shared/api/api-client';
import type { ExamMode } from '../../quiz/types/quiz-model.type';

export type CreateAttemptPayload = {
  userId: number;
  testId?: number;
  mode: ExamMode;
  correctCount: number;
  totalCount: number;
  isPassed: boolean;
  durationSeconds?: number;
};

export function createAttempt(payload: CreateAttemptPayload) {
  return apiPost('/attempts', payload);
}
