import { useEffect } from 'react';
import { prefetchImages } from '@/lib/image-cache';

/**
 * Warms the on-device image cache for the given URLs whenever they change.
 * Pair with a product query, e.g.:
 *
 *   const { data } = useSectionProducts('arduino');
 *   usePrefetchImages(data?.data.map((p) => p.image_filename));
 */
export function usePrefetchImages(urls: Array<string | null | undefined> | undefined) {
  const key = (urls ?? []).filter(Boolean).join('|');
  useEffect(() => {
    if (urls?.length) {
      void prefetchImages(urls);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
