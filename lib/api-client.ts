import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Thin typed fetch wrapper around the app's /api endpoints.
 *
 * Frontend code should NOT use this directly -- use the hooks in `hooks/`.
 *
 * Base URL resolution:
 * 1. `EXPO_PUBLIC_API_URL` if set (use for production / deployed server).
 * 2. Web: relative requests (empty base) hit the same origin.
 * 3. Native dev (Expo Go): derive the Metro dev server origin from
 *    `Constants.expoConfig.hostUri` so API routes are reachable on-device.
 */
function resolveBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'web') return '';

  const c = Constants as any;
  const hostUri: string | undefined =
    Constants.expoConfig?.hostUri ??
    c.expoGoConfig?.debuggerHost ??
    c.manifest2?.extra?.expoGo?.debuggerHost ??
    c.manifest?.debuggerHost;

  if (hostUri) {
    const host = String(hostUri).split('/')[0];
    return `http://${host}`;
  }
  return '';
}

const BASE_URL = resolveBaseUrl();

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildQuery(params?: Record<string, string | number | boolean | null | undefined>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    sp.append(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>,
  signal?: AbortSignal,
  options: { noStore?: boolean } = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}${buildQuery(params)}`, {
    cache: options.noStore ? 'no-store' : undefined,
    headers: {
      Accept: 'application/json',
      ...(options.noStore ? { 'Cache-Control': 'no-store' } : {}),
    },
    signal,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(message, res.status);
  }

  return (await res.json()) as T;
}
