import { apiGet } from '../../../shared/api/api-client';
import type { ExamSessionModel } from '../../quiz/types/quiz-model.type';

export function fetchTicketExam(testId: number) {
  return apiGet<ExamSessionModel>(`/exams/ticket/${testId}`);
}

export function fetchRandomExam() {
  return apiGet<ExamSessionModel>('/exams/random');
}
