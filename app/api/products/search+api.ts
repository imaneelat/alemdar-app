import { parseIntParam } from '@/lib/http';
import type { UniversalSearchItem } from '@/lib/api-types';

const LIVE_SEARCH_URL = 'https://alemdarteknik.com/live-search';
const NO_STORE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function noStoreJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function noStoreError(message: string, status = 400): Response {
  return noStoreJson({ error: message }, status);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const limit = parseIntParam(url.searchParams.get('limit'), 20, { max: 100 });

  if (q.length < 1) {
    return noStoreJson({ q, data: [] });
  }

  try {
    const liveUrl = new URL(LIVE_SEARCH_URL);
    liveUrl.searchParams.set('query', q);
    liveUrl.searchParams.set('limit', String(limit));

    const response = await fetch(liveUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return noStoreError('Search failed', response.status);
    }

    const data = (await response.json()) as UniversalSearchItem[];
    if (!Array.isArray(data)) {
      return noStoreError('Invalid search response', 502);
    }

    return noStoreJson({ q, data });
  } catch (e) {
    return noStoreError('Search failed', 500);
  }
}
