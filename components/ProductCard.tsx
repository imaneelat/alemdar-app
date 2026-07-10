import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { TouchableOpacity, View as RNView, useColorScheme } from 'react-native';
import { Text } from '@/components/Themed';
import { CachedImage } from '@/components/CachedImage';
import { useCart } from '@/context/CartContext';
import { splitPrice } from '@/lib/price';
import { resolveImageUrl } from '@/lib/image-url';

const AMBER = '#FF6B00';

export type CardProduct = {
  id: number | string;
  section: string;
  name: string | null;
  price: string | null;
  image_filename?: string | null;
  category?: string | null;
};

type Props = {
  product: CardProduct;
  sectionTitle?: string;
  accentColor?: string;
  width?: number;
  fluid?: boolean;
};

function ProductCardBase({ product, sectionTitle, accentColor = AMBER, width = 155, fluid = false }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const isDark = useColorScheme() === 'dark';

  const CARD_BG = isDark ? '#131825' : '#ffffff';
  const TEXT = isDark ? '#ffffff' : '#111111';
  const SUBTEXT = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER = isDark ? '#1e2433' : '#ebebeb';
  const IMG_BG = isDark ? '#1a2030' : '#f5f5fa';

  const id = String(product.id);
  const name = product.name ?? 'Product';
  const { whole, dec } = splitPrice(product.price);
  const imageUrl = resolveImageUrl(product.image_filename);
  const categoryLabel = sectionTitle ?? product.category ?? '';

  const goToDetail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/product-detail',
      params: {
        productId: id,
        section: product.section,
      },
    });
  };

  const handleAdd = (e: any) => {
    e?.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToCart({
      id,
      name,
      price: whole,
      dec,
      categoryId: product.section,
      categoryTitle: categoryLabel || product.section,
      image: imageUrl,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={goToDetail}
      style={{
        width: fluid ? '100%' : width,
        backgroundColor: CARD_BG,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        marginRight: fluid ? 0 : 12,
        overflow: 'hidden',
      }}
    >
      {/* Image — no fixed height, fills naturally */}
      <RNView style={{ backgroundColor: IMG_BG, minHeight: 120 }}>
        {imageUrl ? (
          <CachedImage
            source={{ uri: imageUrl }}
            style={{ width: '100%', aspectRatio: 1 }}
            contentFit="cover"
            recyclingKey={id}
          />
        ) : (
          <RNView style={{ height: 120, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons
              name="image-outline"
              size={30}
              color={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
            />
          </RNView>
        )}
      </RNView>

      <RNView style={{ padding: 10 }}>
        {!!categoryLabel && (
          <Text numberOfLines={1} style={{ fontSize: 9, fontWeight: '700', marginBottom: 4, color: accentColor }}>
            {categoryLabel}
          </Text>
        )}
        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: '600', color: TEXT, lineHeight: 15, minHeight: 30, marginBottom: 8 }}>
          {name}
        </Text>
        <RNView style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: TEXT }}>{whole}</Text>
          <Text style={{ fontSize: 10, fontWeight: '600', color: TEXT, marginBottom: 1 }}>.{dec}</Text>
          <Text style={{ fontSize: 10, color: SUBTEXT, marginBottom: 1, marginLeft: 2 }}>TL</Text>
        </RNView>
        <TouchableOpacity
          onPress={handleAdd}
          style={{
            backgroundColor: '#FF6B00',
            borderRadius: 8,
            paddingVertical: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Ionicons name="cart-outline" size={11} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>Add to Cart</Text>
        </TouchableOpacity>
      </RNView>
    </TouchableOpacity>
  );
}

export const ProductCard = memo(ProductCardBase);