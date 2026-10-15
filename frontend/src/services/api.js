const API_BASE = import.meta.env.VITE_API_URL || '/api';
const CACHE_TTL = 60 * 1000; // 60 seconds (fast navigation while staying fresh)
const REQUEST_TIMEOUT = 12000; // 12 seconds timeout safeguard

export async function fetchApi(endpoint, options = {}) {
  const cacheKey = `hexa_cache_${endpoint}`;
  const isGet = !options.method || options.method === 'GET';

  // 1. Read from localStorage cache for GET requests (unless skipCache requested)
  if (isGet && !options.skipCache) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch {
      // ignore parse error
    }
  }

  // 2. Abort controller for timeout safeguard
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const token = localStorage.getItem('hexa_token') || localStorage.getItem('hexa_admin_token');
  const headers = { ...options.headers };
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    // 3. Security interceptor: handle 401 Unauthorized
    if (res.status === 401) {
      console.warn(`[Auth Interceptor] 401 Unauthorized on ${endpoint}. Clearing expired session.`);
      localStorage.removeItem('hexa_token');
      localStorage.removeItem('hexa_admin_token');
      localStorage.removeItem('hexa_author_token');
      localStorage.removeItem('hexa_user');
      localStorage.removeItem('hexa_author_user');
      window.dispatchEvent(new Event('hexa_auth_expired'));
    }

    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    if (isGet) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
      } catch {}
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`Fetch failed for ${endpoint}:`, err.message);

    // 4. Fallback to expired cache if available
    try {
      const fallback = localStorage.getItem(cacheKey);
      if (fallback) return JSON.parse(fallback).data;
    } catch {}
    return null;
  }
}

export const DEFAULT_NEWS_IMAGE = '/images/placeholder-news.svg';

export function handleImageError(e, fallback = DEFAULT_NEWS_IMAGE) {
  if (!e?.currentTarget) return;
  if (e.currentTarget.dataset.fallbackApplied) return;
  e.currentTarget.dataset.fallbackApplied = 'true';
  e.currentTarget.src = fallback;
}

export function formatImageUrl(url) {
  if (!url || typeof url !== 'string' || url.includes('photo-1504711434969-e33886168d5c')) {
    return DEFAULT_NEWS_IMAGE;
  }
  if (url.startsWith('http')) return url;
  const backendBase = import.meta.env.VITE_BACKEND_URL || '';
  if (url.startsWith('/')) return `${backendBase}${url}`;
  return `${backendBase}/${url}`;
}

export function clearApiCache(endpoint) {
  try {
    if (endpoint) {
      localStorage.removeItem(`hexa_cache_${endpoint}`);
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`hexa_cache_${endpoint}`)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('hexa_cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch {}
}

