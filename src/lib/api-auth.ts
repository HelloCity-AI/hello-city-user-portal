const envBase = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

const inferred =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5050'
    : 'https://api.hellociti.com';

export const API_BASE = envBase || inferred;

const join = (base: string, path: string) =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

export const apiFetch = (path: string, init: RequestInit = {}) =>
  fetch(join(API_BASE, path), {
    credentials: 'include',
    ...init,
  });
