import { API_URL } from '../config/env';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `POST ${path} failed: ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(data.message)) message = data.message.join(', ');
      else if (typeof data.message === 'string') message = data.message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export function assetUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Images live in frontend `public/uploads` (GitHub Pages / Vite),
  // not on the Vercel serverless backend filesystem.
  if (path.startsWith('/uploads/')) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${base}${path}`;
  }
  return `${API_URL}${path}`;
}
