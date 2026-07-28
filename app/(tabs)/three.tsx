import {
  View as RNView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Share,
} from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState, useMemo } from 'react';
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
const AMBER = '#FF6B00';

type ViewMode = 'grid' | 'collections';

// ─── Wishlist Card ───────────────────────────────────────────────────
type WishlistCardProps = {
  item: WishlistItem;
  onRemove: (item: WishlistItem) => void;
  isDark: boolean;
  CARD_WIDTH: number;
};

function WishlistCard({ item, onRemove, isDark, CARD_WIDTH }: WishlistCardProps) {
  const router = useRouter();
  const imageUrl = item.image ? resolveImageUrl(item.image) : null;

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('wishlistPage.removeTitle'),
      `Remove "${item.name}" from your wishlist?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('wishlistPage.remove'),
          style: 'destructive',
          onPress: () => onRemove(item),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
          pathname: '/product-detail',
          params: { productId: item.id, section: item.sectionId },
        });
      }}
      style={{
        width: CARD_WIDTH,
        marginHorizontal: 4,
        marginBottom: 6,
        borderRadius: 14,
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#2a2a2a' : '#e8e8e8',
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <RNView
        style={{
          width: '100%',
          aspectRatio: 1,
          backgroundColor: isDark ? '#242424' : '#f5f5f5',
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
            color={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
          />
        )}
        <RNView
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: item.accentColor || AMBER,
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
            {item.sectionTitle}
          </Text>
        </RNView>
      </RNView>

      <RNView style={{ padding: 10, gap: 6 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#ffffff' : '#111111',
            lineHeight: 18,
          }}
        >
          {item.name}
        </Text>
        <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: AMBER }}>
            {item.price}.{item.dec} TL
          </Text>
          <TouchableOpacity
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(227,52,47,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="heart" size={15} color="#e3342f" />
          </TouchableOpacity>
        </RNView>
      </RNView>
    </TouchableOpacity>
  );
}

// ─── Collection Card ─────────────────────────────────────────────────
type CollectionCardProps = {
  title: string;
  items: WishlistItem[];
  isDark: boolean;
  onPress: () => void;
  onShare: () => void;
};

function CollectionCard({ title, items, isDark, onPress, onShare }: CollectionCardProps) {
  const previewImages = items.slice(0, 4);
  const TEXT   = isDark ? '#ffffff' : '#111111';
  const SUBTEXT = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const border = isDark ? '#2a2a2a' : '#e8e8e8';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
      }}
    >
      <RNView style={{ flexDirection: 'row', height: 140 }}>
        <RNView
          style={{
            flex: 2,
            backgroundColor: isDark ? '#242424' : '#f0f0f0',
            borderRightWidth: 2,
            borderRightColor: isDark ? '#0A0A0A' : '#F5F5F5',
          }}
        >
          {previewImages[0]?.image ? (
            <CachedImage
              source={{ uri: resolveImageUrl(previewImages[0].image!) }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              recyclingKey={previewImages[0].id}
            />
          ) : (
            <RNView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons
                name="image-outline"
                size={32}
                color={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
              />
            </RNView>
          )}
        </RNView>

        <RNView style={{ flex: 1, gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <RNView
              key={i}
              style={{
                flex: 1,
                backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
                borderBottomWidth: i < 3 ? 2 : 0,
                borderBottomColor: isDark ? '#0A0A0A' : '#F5F5F5',
              }}
            >
              {previewImages[i]?.image ? (
                <CachedImage
                  source={{ uri: resolveImageUrl(previewImages[i].image!) }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  recyclingKey={previewImages[i].id}
                />
              ) : (
                <RNView
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? '#222' : '#ebebeb',
                  }}
                >
                  {i === 3 && items.length > 4 && (
                    <Text style={{ color: SUBTEXT, fontSize: 11, fontWeight: '700' }}>
                      +{items.length - 4}
                    </Text>
                  )}
                </RNView>
              )}
            </RNView>
          ))}
        </RNView>
      </RNView>

      <RNView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <RNView style={{ gap: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT }}>{title}</Text>
          <Text style={{ fontSize: 12, color: SUBTEXT }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
        </RNView>
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); onShare(); }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Ionicons name="share-outline" size={14} color={isDark ? '#fff' : '#333'} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: isDark ? '#fff' : '#333' }}>
            Share
          </Text>
        </TouchableOpacity>
      </RNView>
    </TouchableOpacity>
  );
}

// ─── Filter Pills ────────────────────────────────────────────────────
type FilterPillsProps = {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
  isDark: boolean;
};

function FilterPills({ categories, selected, onSelect, isDark }: FilterPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 10,
        alignItems: 'center',
      }}
    >
      {['All', ...categories].map((cat) => {
        const active = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(cat);
            }}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              alignSelf: 'flex-start',
              backgroundColor: active ? AMBER : isDark ? '#1c1c1e' : '#ffffff',
              borderWidth: 1,
              borderColor: active ? AMBER : isDark ? '#2a2a2a' : '#e0e0e0',
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: active ? '#000' : isDark ? '#fff' : '#333',
            }}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────
function EmptyWishlist({ isDark, TEXT, SUBTEXT }: { isDark: boolean; TEXT: string; SUBTEXT: string }) {
  const router = useRouter();
  return (
    <RNView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 40 }}>
      <RNView
        style={{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: isDark ? '#1e2433' : '#f0f0f5',
          alignItems: 'center', justifyContent: 'center',
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
          marginTop: 8, backgroundColor: AMBER,
          borderRadius: 12, paddingHorizontal: 32, paddingVertical: 13,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#000' }}>
          {t('wishlistPage.browseItems')}
        </Text>
      </TouchableOpacity>
    </RNView>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────
export default function WishlistScreen() {
  const { isDark } = useColors();
  const offlineBannerVisible = useOfflineBannerVisible();
  useLocale();

  const TEXT    = isDark ? '#ffffff'                : '#111111';
  const SUBTEXT = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER  = isDark ? '#2A2A2A'                : '#E8E8E8';
  const BG      = isDark ? '#0A0A0A'                : '#ffffff' ;

  const { items, toggleWishlist } = useWishlist();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.sectionTitle))],
    [items]
  );

  const filteredItems = useMemo(
    () => selectedCategory === 'All'
      ? items
      : items.filter((i) => i.sectionTitle === selectedCategory),
    [items, selectedCategory]
  );

  const collections = useMemo(() => {
    const map: Record<string, WishlistItem[]> = {};
    items.forEach((item) => {
      if (!map[item.sectionTitle]) map[item.sectionTitle] = [];
      map[item.sectionTitle].push(item);
    });
    return Object.entries(map).map(([title, colItems]) => ({ title, items: colItems }));
  }, [items]);

  const columnCount = 2;
  const gap = 8;
  const CARD_WIDTH = (SCREEN_WIDTH - 16 - gap * (columnCount - 1)) / columnCount;

  const handleShareCollection = useCallback(
    async (collectionTitle: string, collectionItems: WishlistItem[]) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const itemList = collectionItems
        .map((i) => `• ${i.name} — ${i.price}.${i.dec} TL`)
        .join('\n');
      await Share.share({
        title: `Alemdar Teknik — ${collectionTitle}`,
        message: `🛒 My ${collectionTitle} wishlist from Alemdar Teknik:\n\n${itemList}\n\n🔗 alemdarteknik.com`,
      });
    },
    []
  );

  const handleShareAll = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const itemList = items
      .map((i) => `• ${i.name} — ${i.price}.${i.dec} TL`)
      .join('\n');
    await Share.share({
      title: 'Alemdar Teknik — My Wishlist',
      message: `My wishlist from Alemdar Teknik:\n\n${itemList}\n\n🔗 alemdarteknik.com`,
    });
  }, [items]);

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

  const keyExtractor = useCallback(
    (item: WishlistItem) => `${item.id}-${item.sectionId}`,
    []
  );

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
          backgroundColor: BG,
        }}
      >
        <RNView>
          <Text style={{ fontSize: 22, fontWeight: '700', color: TEXT }}>
            {t('wishlistPage.title')}
          </Text>
          {items.length > 0 && (
            <Text style={{ fontSize: 12, color: SUBTEXT, marginTop: 1 }}>
              {items.length}{' '}
              {t(items.length !== 1 ? 'wishlistPage.items' : 'wishlistPage.item')}
            </Text>
          )}
        </RNView>

        {items.length > 0 && (
          <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              onPress={handleShareAll}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                borderWidth: 1, borderColor: BORDER,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="share-outline" size={18} color={TEXT} />
            </TouchableOpacity>

            <RNView
              style={{
                flexDirection: 'row',
                backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                borderRadius: 10, borderWidth: 1, borderColor: BORDER,
                overflow: 'hidden',
              }}
            >
              <TouchableOpacity
                onPress={() => setViewMode('grid')}
                style={{
                  paddingHorizontal: 10, paddingVertical: 7,
                  backgroundColor: viewMode === 'grid' ? AMBER : 'transparent',
                }}
              >
                <Ionicons
                  name="grid-outline" size={16}
                  color={viewMode === 'grid' ? '#000' : isDark ? '#fff' : '#333'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('collections')}
                style={{
                  paddingHorizontal: 10, paddingVertical: 7,
                  backgroundColor: viewMode === 'collections' ? AMBER : 'transparent',
                }}
              >
                <Ionicons
                  name="albums-outline" size={16}
                  color={viewMode === 'collections' ? '#000' : isDark ? '#fff' : '#333'}
                />
              </TouchableOpacity>
            </RNView>
          </RNView>
        )}
      </RNView>

      {/* CONTENT */}
      {items.length === 0 ? (
        <EmptyWishlist isDark={isDark} TEXT={TEXT} SUBTEXT={SUBTEXT} />
      ) : viewMode === 'collections' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
        >
          {collections.map((col) => (
            <CollectionCard
              key={col.title}
              title={col.title}
              items={col.items}
              isDark={isDark}
              onPress={() => {
                setSelectedCategory(col.title);
                setViewMode('grid');
              }}
              onShare={() => handleShareCollection(col.title, col.items)}
            />
          ))}
        </ScrollView>
      ) : (
        <FlashList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
         
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingTop: 8,
            paddingBottom: 120,
          }}
          ListHeaderComponent={
            categories.length > 1 ? (
              <FilterPills
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                isDark={isDark}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}