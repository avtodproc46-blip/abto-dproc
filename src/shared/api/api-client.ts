import { API_URL } from '../config/env';
import { clearStoredUser, getAccessToken } from '../../modules/users/api/user-storage';

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) return data.message.join(', ');
    if (typeof data.message === 'string') return data.message;
  } catch {
    // keep fallback
  }
  return fallback;
}

function handleUnauthorized(res: Response) {
  if (res.status === 401) {
    clearStoredUser();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
      window.location.reload();
    }
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await parseError(res, `GET ${path} failed: ${res.status}`));
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await parseError(res, `POST ${path} failed: ${res.status}`));
  }
  return res.json() as Promise<T>;
}

export function assetUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${base}${path}`;
  }
  return `${API_URL}${path}`;
}
