import { apiGet } from '../../../shared/api/api-client';
import type { AttemptStatus, PaginatedTestsModel } from '../types/test-model.type';

export type TestsQuery = {
  status?: AttemptStatus | 'all';
  page?: number;
  take?: number;
  number?: number;
  id?: number;
};

export function fetchTests(query: TestsQuery = {}) {
  const params = new URLSearchParams();
  if (query.status && query.status !== 'all') params.set('status', query.status);
  if (query.page) params.set('page', String(query.page));
  if (query.take) params.set('take', String(query.take));
  if (query.number) params.set('number', String(query.number));
  if (query.id) params.set('id', String(query.id));
  const qs = params.toString();
  return apiGet<PaginatedTestsModel>(`/tests${qs ? `?${qs}` : ''}`);
}
