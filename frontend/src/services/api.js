const API_BASE = '/api';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchApi(endpoint, options = {}) {
  const cacheKey = `hexa_cache_${endpoint}`;
  const isGet = !options.method || options.method === 'GET';

  // Read from localStorage cache for GET requests
  if (isGet) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    if (isGet) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
      } catch (e) {}
    }
    return data;
  } catch (err) {
    console.warn(`Fetch failed for ${endpoint}:`, err.message);
    // Fallback to expired cache if available
    try {
      const fallback = localStorage.getItem(cacheKey);
      if (fallback) return JSON.parse(fallback).data;
    } catch (e) {}
    return null;
  }
}

export function formatImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
}
