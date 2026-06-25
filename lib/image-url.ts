/**
 * Resolve a product `image_filename` (which may be a full URL or a bare
 * filename from the DB) into a loadable URL.
 *
 * If values are already absolute URLs they are returned untouched. Otherwise,
 * set `EXPO_PUBLIC_IMAGE_BASE_URL` (e.g. "https://alemdarteknik.com/images/")
 * to prefix bare filenames.
 */
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_BASE_URL ?? '';

export function resolveImageUrl(filename: string | null | undefined): string | undefined {
  if (!filename) return undefined;
  const value = String(filename).trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (!IMAGE_BASE_URL) return undefined;
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`;
  return `${base}${value.replace(/^\//, '')}`;
}
