import type { UserModel } from '../types/user-model.type';

const KEY = 'avto-dproc-user';

function isValidUser(value: unknown): value is UserModel {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === 'number' &&
    typeof user.login === 'string' &&
    typeof user.accessToken === 'string'
  );
}

export function loadStoredUser(): UserModel | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidUser(parsed)) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
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

export function getAccessToken(): string | null {
  return loadStoredUser()?.accessToken ?? null;
}
