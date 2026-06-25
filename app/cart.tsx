import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View as RNView,
  Animated,
} from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { useCart } from '@/context/CartContext';
import { useLocale, t } from '@/lib/i18n';

const AMBER = '#f5a623';

export default function CartScreen() {
  const router = useRouter();
  useLocale();
  const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const scheme  = useColorScheme();
  const isDark  = scheme === 'dark';

  const PAGE_BG = isDark ? '#0d0d0d' : '#f2f2f7';
  const CARD_BG = isDark ? '#131825' : '#ffffff';
  const TEXT    = isDark ? '#ffffff' : '#111111';
  const SUBTEXT = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER  = isDark ? '#1e2433' : '#ebebeb';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PAGE_BG }} edges={['top']}>

      {/* HEADER */}
      <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: isDark ? '#0d0d0d' : '#ffffff', borderBottomWidth: 1, borderBottomColor: BORDER }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: TEXT }}>
          {t('cart.title')} {totalItems > 0 && <Text style={{ color: AMBER }}>({totalItems})</Text>}
        </Text>
        {items.length > 0 ? (
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); clearCart(); }} style={{ padding: 4 }}>
            <Text style={{ fontSize: 13, color: '#e3342f', fontWeight: '600' }}>{t('cart.clear')}</Text>
          </TouchableOpacity>
        ) : (
          <RNView style={{ width: 40 }} />
        )}
      </RNView>

      {items.length === 0 ? (
        /* EMPTY STATE */
        <RNView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <RNView style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: isDark ? '#1e2433' : '#f0f0f5', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="cart-outline" size={44} color={AMBER} />
          </RNView>
          <Text style={{ fontSize: 20, fontWeight: '700', color: TEXT }}>{t('cart.empty')}</Text>
          <Text style={{ fontSize: 14, color: SUBTEXT, textAlign: 'center', paddingHorizontal: 40 }}>
            {t('cart.emptyDesc')}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 8, backgroundColor: AMBER, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 13 }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#000' }}>{t('cart.startShopping')}</Text>
          </TouchableOpacity>
        </RNView>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 160 }}>
            {items.map(item => (
              <RNView key={`${item.categoryId}-${item.id}`} style={{ backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* Image */}
                <RNView style={{ width: 72, height: 72, borderRadius: 10, backgroundColor: isDark ? '#1a2030' : '#f5f5fa', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ionicons name="image-outline" size={28} color={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                </RNView>

                {/* Info */}
                <RNView style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: AMBER, fontWeight: '600', marginBottom: 3 }}>{item.categoryTitle}</Text>
                  <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '600', color: TEXT, lineHeight: 18, marginBottom: 6 }}>{item.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: AMBER }}>{item.price}.{item.dec} <Text style={{ fontSize: 11, color: SUBTEXT, fontWeight: '400' }}>TL</Text></Text>
                </RNView>

                {/* Qty controls + delete */}
                <RNView style={{ alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); removeFromCart(item.id, item.categoryId); }}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#e3342f" />
                  </TouchableOpacity>

                  <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 0, backgroundColor: isDark ? '#0d1120' : '#f0f0f5', borderRadius: 10, overflow: 'hidden' }}>
                    <TouchableOpacity
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQty(item.id, item.categoryId, item.quantity - 1); }}
                      style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="remove" size={16} color={TEXT} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: TEXT, minWidth: 24, textAlign: 'center' }}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQty(item.id, item.categoryId, item.quantity + 1); }}
                      style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="add" size={16} color={TEXT} />
                    </TouchableOpacity>
                  </RNView>
                </RNView>
              </RNView>
            ))}
          </ScrollView>

          {/* CHECKOUT BAR */}
          <RNView style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: isDark ? '#0d0d0d' : '#ffffff', borderTopWidth: 1, borderTopColor: BORDER, padding: 16, paddingBottom: 28 }}>
            {/* Order summary */}
            <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: SUBTEXT }}>{totalItems} {t(totalItems !== 1 ? 'cart.items' : 'cart.item')}</Text>
              <Text style={{ fontSize: 13, color: SUBTEXT }}>{t('cart.subtotal')}</Text>
            </RNView>
            <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
              <Text style={{ fontSize: 13, color: SUBTEXT }}>{t('cart.delivery')} <Text style={{ color: '#2ecc71', fontWeight: '700' }}>{t('cart.freeDelivery')}</Text></Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: TEXT }}>
                {totalPrice.toFixed(2)} <Text style={{ fontSize: 14, color: SUBTEXT }}>TL</Text>
              </Text>
            </RNView>

            <TouchableOpacity
              onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
              activeOpacity={0.85}
              style={{ backgroundColor: AMBER, borderRadius: 14, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#000" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>{t('cart.placeOrder')}</Text>
            </TouchableOpacity>
          </RNView>
        </>
      )}
    </SafeAreaView>
  );
}
