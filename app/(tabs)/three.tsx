import {
  View as RNView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import { useOfflineBannerVisible } from '@/hooks/useOfflineBanner';
import { useLocale, t } from '@/lib/i18n';
import { useColors } from '@/hooks/useColors';
import { CachedImage } from '@/components/CachedImage';
import { resolveImageUrl } from '@/lib/image-url';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AMBER = "#FF6B00";

// ─── Pinterest-style Wishlist Card ──────────────────────────────
type WishlistCardProps = {
  item: WishlistItem;
  onRemove: (item: WishlistItem) => void;
  isDark: boolean;
  CARD_WIDTH: number;
};

function WishlistCard({ item, onRemove, isDark, CARD_WIDTH }: WishlistCardProps) {
  const router = useRouter();

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('wishlistPage.removeTitle'),
      `Remove "${item.name}" from your wishlist?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('wishlistPage.remove'), style: 'destructive', onPress: () => onRemove(item) },
      ]
    );
  };

  const imageUrl = item.image ? resolveImageUrl(item.image) : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ 
          pathname: '/product-detail', 
          params: { 
            productId: item.id, 
            section: item.sectionId 
          } 
        });
      }}
      style={{
        width: CARD_WIDTH,
        marginHorizontal: 4,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#2a2a2a' : '#e8e8e8',
      }}
    >
      {/* Image */}
      <RNView
        style={{
          width: '100%',
          aspectRatio: 1,
          backgroundColor: isDark ? '#242424' : '#f0f0f0',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageUrl ? (
          <CachedImage
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            recyclingKey={item.id}
          />
        ) : (
          <Ionicons
            name="image-outline"
            size={40}
            color={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          />
        )}
      </RNView>

      {/* Info */}
      <RNView style={{ padding: 10, gap: 4 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#ffffff' : '#111111',
          }}
        >
          {item.name}
        </Text>

        <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: AMBER,
            }}
          >
            {item.price}.{item.dec} TL
          </Text>

          {/* Heart - Remove button */}
          <TouchableOpacity
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              padding: 4,
            }}
          >
            <Ionicons
              name="heart"
              size={18}
              color="#e3342f"
            />
          </TouchableOpacity>
        </RNView>
      </RNView>
    </TouchableOpacity>
  );
}

// ─── Empty State ────────────────────────────────────────────────────
function EmptyWishlist({ isDark, TEXT, SUBTEXT }: { isDark: boolean; TEXT: string; SUBTEXT: string }) {
  const router = useRouter();
  return (
    <RNView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 40 }}>
      <RNView
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: isDark ? '#1e2433' : '#f0f0f5',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="heart-outline" size={44} color={AMBER} />
      </RNView>
      <Text style={{ fontSize: 20, fontWeight: '700', color: TEXT, textAlign: 'center' }}>
        {t('wishlistPage.empty')}
      </Text>
      <Text style={{ fontSize: 14, color: SUBTEXT, textAlign: 'center' }}>
        {t('wishlistPage.emptyDesc')}
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/search')}
        style={{
          marginTop: 8,
          backgroundColor: AMBER,
          borderRadius: 12,
          paddingHorizontal: 32,
          paddingVertical: 13,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#000' }}>
          {t('wishlistPage.browseItems')}
        </Text>
      </TouchableOpacity>
    </RNView>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function WishlistScreen() {
  const { isDark } = useColors();
  const offlineBannerVisible = useOfflineBannerVisible();

  const TEXT = isDark ? '#ffffff' : '#111111';
  const SUBTEXT = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER = isDark ? '#2A2A2A' : '#E8E8E8';
  const BG = isDark ? '#0A0A0A' : '#F5F5F5';

  useLocale();
  const { items, toggleWishlist } = useWishlist();

  // ─── Pinterest-style grid layout ──────────────────────────────
  const columnCount = 2;
  const gap = 8;
  const CARD_WIDTH = (SCREEN_WIDTH - 16 - gap * (columnCount - 1)) / columnCount;

  const renderItem = useCallback(
    ({ item }: { item: WishlistItem }) => (
      <WishlistCard
        item={item}
        onRemove={toggleWishlist}
        isDark={isDark}
        CARD_WIDTH={CARD_WIDTH}
      />
    ),
    [toggleWishlist, isDark, CARD_WIDTH]
  );

  const keyExtractor = useCallback((item: WishlistItem) => `${item.id}-${item.sectionId}`, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BG }}
      edges={offlineBannerVisible ? [] : ['top']}
    >
      {/* HEADER */}
      <RNView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: BORDER,
          backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: TEXT,
          }}
        >
          {t('wishlistPage.title')}
        </Text>
        {items.length > 0 && (
          <Text
            style={{
              fontSize: 13,
              color: SUBTEXT,
            }}
          >
            {items.length} {t(items.length !== 1 ? 'wishlistPage.items' : 'wishlistPage.item')}
          </Text>
        )}
      </RNView>

      {items.length === 0 ? (
        <EmptyWishlist isDark={isDark} TEXT={TEXT} SUBTEXT={SUBTEXT} />
      ) : (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: BG }}
        />
      )}
    </SafeAreaView>
  );
}