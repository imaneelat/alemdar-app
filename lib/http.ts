/** JSON replacer that makes Prisma values safe to serialize (BigInt -> string). */
function replacer(_key: string, value: unknown) {
  return typeof value === 'bigint' ? value.toString() : value;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, replacer), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

/** Parse a positive integer query param with a default and max bound. */
export function parseIntParam(
  value: string | null,
  fallback: number,
  { min = 1, max = Number.MAX_SAFE_INTEGER }: { min?: number; max?: number } = {}
): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.trunc(n), min), max);
}
