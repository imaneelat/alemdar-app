import { error, json, parseIntParam } from '@/lib/http';
import type { UniversalSearchItem } from '@/lib/api-types';

const LIVE_SEARCH_URL = 'https://alemdarteknik.com/live-search';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const limit = parseIntParam(url.searchParams.get('limit'), 20, { max: 100 });

  if (q.length < 1) {
    return json({ q, data: [] });
  }

  try {
    const liveUrl = new URL(LIVE_SEARCH_URL);
    liveUrl.searchParams.set('query', q);
    liveUrl.searchParams.set('limit', String(limit));

    const response = await fetch(liveUrl, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return error('Search failed', response.status);
    }

    const data = (await response.json()) as UniversalSearchItem[];
    if (!Array.isArray(data)) {
      return error('Invalid search response', 502);
    }

    return json({ q, data });
  } catch (e) {
    return error('Search failed', 500);
  }
}
