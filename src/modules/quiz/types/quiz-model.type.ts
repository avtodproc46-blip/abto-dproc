export type AnswerModel = {
  id: number;
  title: string;
  image?: string | null;
  isTrue: boolean;
};

export type QuestionModel = {
  id: number;
  title: string;
  image?: string | null;
  answers: AnswerModel[];
};

export type ExamMode = 'ticket' | 'random';

export type ExamSessionModel = {
  mode: ExamMode;
  timerSeconds: number;
  passScore: number;
  question: QuestionModel[];
};

export type QuizResultModel = {
  correctCount: number;
  totalCount: number;
  isPassed: boolean;
  mode: ExamMode;
  testId?: number;
  durationSeconds: number;
};
