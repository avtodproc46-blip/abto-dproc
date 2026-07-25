const KEY = 'avto-dproc-user';

import type { UserModel } from '../types/user-model.type';

export function loadStoredUser(): UserModel | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserModel;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserModel) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(KEY);
}
