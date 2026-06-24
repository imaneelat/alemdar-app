import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View as RNView,
  Dimensions,
  Animated,
} from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { productSections } from '@/constants/ProductData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AMBER = '#f5a623';

export default function ProductDetail() {
  const router    = useRouter();
  const params    = useLocalSearchParams();
  const { addToCart } = useCart();
  const scheme    = useColorScheme();
  const isDark    = scheme === 'dark';

  const productId  = params.productId as string;
  const categoryId = params.categoryId as string;

  const section  = productSections.find(s => s.id === categoryId);
  const product  = section?.products.find(p => p.id === productId);

  const [added, setAdded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const PAGE_BG   = isDark ? '#0d0d0d' : '#f2f2f7';
  const CARD_BG   = isDark ? '#131825' : '#ffffff';
  const TEXT      = isDark ? '#ffffff' : '#111111';
  const SUBTEXT   = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER    = isDark ? '#1e2433' : '#ebebeb';

  if (!product || !section) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: PAGE_BG, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: TEXT }}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  const relatedProducts = section.products.filter(p => p.id !== productId).slice(0, 10);

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      dec: product.dec,
      categoryId: section.id,
      categoryTitle: section.title,
    });
    setAdded(true);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 30, bounciness: 10 }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 30, bounciness: 14 }),
    ]).start();
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setAdded(false));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAGE_BG }} edges={['top']}>

      {/* HEADER */}
      <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: isDark ? '#0d0d0d' : '#ffffff', borderBottomWidth: 1, borderBottomColor: BORDER }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700', color: TEXT, flex: 1, textAlign: 'center' }} numberOfLines={1}>
          {section.title}
        </Text>
        <TouchableOpacity onPress={() => router.push('/cart')} style={{ padding: 4 }}>
          <Ionicons name="cart-outline" size={24} color={TEXT} />
        </TouchableOpacity>
      </RNView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* PRODUCT IMAGE */}
        <RNView style={{ height: 280, backgroundColor: CARD_BG, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: BORDER }}>
          <Ionicons name="image-outline" size={80} color={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} />
        </RNView>

        {/* PRODUCT INFO */}
        <RNView style={{ backgroundColor: CARD_BG, padding: 20, marginBottom: 8 }}>
          {/* Stock */}
          <Text style={{ fontSize: 11, fontWeight: '700', color: product.low ? AMBER : '#2ecc71', marginBottom: 8 }}>
            ● {product.stock}
          </Text>

          {/* Name */}
          <Text style={{ fontSize: 20, fontWeight: '800', color: TEXT, lineHeight: 28, marginBottom: 12 }}>
            {product.name}
          </Text>

          {/* Category tag */}
          <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <RNView style={{ backgroundColor: isDark ? '#1e2433' : '#f0f0f5', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 11, color: section.accentColor, fontWeight: '600' }}>{section.title}</Text>
            </RNView>
          </RNView>

          {/* Price */}
          <RNView style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 20 }}>
            <Text style={{ fontSize: 36, fontWeight: '900', color: AMBER, lineHeight: 40 }}>{product.price}</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: AMBER, marginBottom: 4 }}>.{product.dec}</Text>
            <Text style={{ fontSize: 16, color: SUBTEXT, marginBottom: 6 }}>TL</Text>
          </RNView>

          {/* Specs placeholder */}
          <RNView style={{ backgroundColor: isDark ? '#0d1120' : '#f8f8fc', borderRadius: 12, padding: 14, marginBottom: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: TEXT, marginBottom: 10 }}>Product Details</Text>
            {[
              { label: 'Category',     value: section.title       },
              { label: 'Availability', value: product.stock       },
              { label: 'SKU',          value: `AT-${section.id.toUpperCase()}-${product.id.padStart(3,'0')}` },
              { label: 'Shipping',     value: 'Same-day in Lefkoşa' },
            ].map(row => (
              <RNView key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: BORDER }}>
                <Text style={{ fontSize: 12, color: SUBTEXT }}>{row.label}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: TEXT }}>{row.value}</Text>
              </RNView>
            ))}
          </RNView>
        </RNView>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <RNView style={{ paddingTop: 8 }}>
            <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
              <RNView style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: section.accentColor }} />
              <Text style={{ fontSize: 17, fontWeight: '700', color: TEXT }}>More from {section.title}</Text>
            </RNView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {relatedProducts.map(rel => (
                <TouchableOpacity
                  key={rel.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.replace({ pathname: '/product-detail', params: { productId: rel.id, categoryId: section.id } });
                  }}
                  style={{ width: 148, backgroundColor: CARD_BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' }}
                >
                  <RNView style={{ height: 110, backgroundColor: isDark ? '#1a2030' : '#f5f5fa', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="image-outline" size={28} color={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} />
                  </RNView>
                  <RNView style={{ padding: 10 }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', marginBottom: 4, color: rel.low ? AMBER : '#2ecc71' }}>● {rel.stock}</Text>
                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: '600', color: TEXT, lineHeight: 15, minHeight: 30, marginBottom: 8 }}>{rel.name}</Text>
                    <RNView style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: TEXT }}>{rel.price}</Text>
                      <Text style={{ fontSize: 9, color: SUBTEXT, marginBottom: 1, marginLeft: 2 }}>.{rel.dec} TL</Text>
                    </RNView>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        addToCart({ id: rel.id, name: rel.name, price: rel.price, dec: rel.dec, categoryId: section.id, categoryTitle: section.title });
                      }}
                      style={{ backgroundColor: AMBER, borderRadius: 8, paddingVertical: 7, alignItems: 'center' }}
                    >
                      <Text style={{ color: '#000', fontSize: 10, fontWeight: '700' }}>Add to Cart</Text>
                    </TouchableOpacity>
                  </RNView>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RNView>
        )}
      </ScrollView>

      {/* BOTTOM BAR */}
      <RNView style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: isDark ? '#0d0d0d' : '#ffffff', borderTopWidth: 1, borderTopColor: BORDER, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28 }}>
        {/* Added confirmation */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: '#2ecc71', fontWeight: '600' }}>✓ Added to cart!</Text>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.85}
            style={{ backgroundColor: AMBER, borderRadius: 14, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          >
            <Ionicons name="cart-outline" size={20} color="#000" />
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Add to Cart</Text>
          </TouchableOpacity>
        </Animated.View>
      </RNView>
    </SafeAreaView>
  );
}
