import { Image, type ImageProps } from 'expo-image';
import { memo } from 'react';

/**
 * Drop-in image for remote product images. Built on `expo-image`, which caches
 * to both memory and disk by default, so images load instantly after the first
 * fetch and remain available offline.
 *
 * Use this for any network image (e.g. product `image_filename` URLs). For
 * bundled/local assets a plain require() image is fine.
 */
export type CachedImageProps = ImageProps & {
  /** Stable id (e.g. product id) to help recycle views in long lists. */
  recyclingKey?: string;
};

function CachedImageBase({
  cachePolicy = 'memory-disk',
  transition = 200,
  contentFit = 'cover',
  recyclingKey,
  ...rest
}: CachedImageProps) {
  return (
    <Image
      cachePolicy={cachePolicy}
      transition={transition}
      contentFit={contentFit}
      recyclingKey={recyclingKey}
      {...rest}
    />
  );
}

export const CachedImage = memo(CachedImageBase);
