export type AttemptStatus = 'passed' | 'failed' | 'not_taken';

export type TestListItemModel = {
  id: number;
  number: number;
  title: string | null;
  questionsCount: number;
  status: AttemptStatus;
  score: string | null;
  correctCount: number | null;
  totalCount: number | null;
};

export type PaginatedTestsModel = {
  items: TestListItemModel[];
  total: number;
  page: number;
  take: number;
};
