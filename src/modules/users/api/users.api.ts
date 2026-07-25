import { apiGet, apiPost } from '../../../shared/api/api-client';
import type { UserModel } from '../types/user-model.type';

export function fetchUsers() {
  return apiGet<UserModel[]>('/users');
}

export function createUser(name: string) {
  return apiPost<UserModel>('/users', { name });
}
