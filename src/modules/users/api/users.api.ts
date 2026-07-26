import { apiPost } from '../../../shared/api/api-client';
import type { UserModel } from '../types/user-model.type';

export function registerUser(login: string, password: string) {
  return apiPost<UserModel>('/users/register', { login, password });
}

export function loginUser(login: string, password: string) {
  return apiPost<UserModel>('/users/login', { login, password });
}
