import { Image } from 'expo-image';

/**
 * Helpers for the on-device image cache (backed by expo-image's disk + memory
 * cache). Use `prefetchImages` to warm the cache ahead of time, e.g. after a
 * product list query resolves.
 */

/** Warm the cache for a set of remote image URLs. */
export async function prefetchImages(
  urls: Array<string | null | undefined>,
  cachePolicy: 'memory' | 'disk' | 'memory-disk' = 'memory-disk'
): Promise<void> {
  const valid = urls.filter((u): u is string => !!u && /^https?:\/\//.test(u));
  if (valid.length === 0) return;
  try {
    await Image.prefetch(valid, { cachePolicy });
  } catch {
    // Prefetch is best-effort; ignore failures.
  }
}

/** Clear the in-memory image cache (keeps disk cache). */
export function clearImageMemoryCache(): Promise<boolean> {
  return Image.clearMemoryCache();
}

/** Clear the on-disk image cache. */
export function clearImageDiskCache(): Promise<boolean> {
  return Image.clearDiskCache();
}
